import json
import os
import urllib.request
import urllib.error
from pathlib import Path

BASE = os.environ['N8N_BASE_URL'].rstrip('/') + '/api/v1'
API_KEY = os.environ['N8N_API_KEY']
BOT_WORKFLOW_ID = os.environ.get('HOTEL_BOT_WORKFLOW_ID', 'JEk9Jn15xNP931Pt')
EXPORT_DIR = Path(__file__).resolve().parent / 'n8n'
EXPORT_DIR.mkdir(parents=True, exist_ok=True)


def api(path, method='GET', payload=None):
    data = None if payload is None else json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        BASE + path,
        data=data,
        method=method,
        headers={
            'X-N8N-API-KEY': API_KEY,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            raw = resp.read().decode('utf-8')
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', errors='replace')
        raise RuntimeError(f'{method} {path} failed: {e.code} {body}')


def upsert_workflow(payload):
    listing = api('/workflows?limit=250')
    existing = next((wf for wf in listing.get('data', []) if wf.get('name') == payload['name']), None)
    if existing:
        detail = api(f"/workflows/{existing['id']}")
        payload['staticData'] = detail.get('staticData') or {'global': {}}
        api(f"/workflows/{existing['id']}", method='PUT', payload=payload)
        workflow_id = existing['id']
    else:
        payload['staticData'] = {'global': {}}
        created = api('/workflows', method='POST', payload=payload)
        workflow_id = created['id']
    api(f'/workflows/{workflow_id}/activate', method='POST', payload={})
    detail = api(f"/workflows/{workflow_id}")
    export_path = EXPORT_DIR / f"{payload['name'].lower().replace(' ', '-').replace('—', '-').replace('ü', 'ue')}.workflow.json"
    export_path.write_text(json.dumps(detail, indent=2, ensure_ascii=False))
    return workflow_id, export_path


response_node = {
    'type': 'n8n-nodes-base.respondToWebhook',
    'typeVersion': 1.1,
    'parameters': {
        'respondWith': 'json',
        'responseBody': '={{ JSON.stringify($json) }}',
        'options': {
            'responseCode': 200,
            'responseHeaders': {
                'entries': [
                    {'name': 'Access-Control-Allow-Origin', 'value': '*'},
                    {'name': 'Access-Control-Allow-Headers', 'value': '*'},
                    {'name': 'Access-Control-Allow-Methods', 'value': 'GET,POST,OPTIONS'},
                ]
            }
        }
    }
}

ical_config_code = f"""
const N8N_BASE = 'https://n8n.leolan.net/api/v1';
const N8N_API_KEY = '{API_KEY}';
const DEFAULT_BOT_WORKFLOW_ID = '{BOT_WORKFLOW_ID}';

function unwrapPayload(item) {{
  return item?.body || item || {{}};
}}

function normalizeFeed(feed) {{
  if (!feed || !feed.url) return null;
  return {{
    url: String(feed.url || '').trim(),
    source: String(feed.source || 'iCal').trim() || 'iCal',
    roomType: String(feed.roomType || 'standard').trim() || 'standard',
  }};
}}

function unfoldIcal(text) {{
  return String(text || '').replace(/\\r\\n[ \t]/g, '').replace(/\\n[ \t]/g, '');
}}

function parseDateValue(raw) {{
  const value = String(raw || '').trim().split(':').pop();
  if (!value) return null;
  if (/^\d{{8}}$/.test(value)) return `${{value.slice(0,4)}}-${{value.slice(4,6)}}-${{value.slice(6,8)}}`;
  const clean = value.replace('Z', '');
  if (/^\d{{8}}T\d{{6}}$/.test(clean)) return `${{clean.slice(0,4)}}-${{clean.slice(4,6)}}-${{clean.slice(6,8)}}`;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}}

function parseIcalEvents(text) {{
  const normalized = unfoldIcal(text);
  const blocks = normalized.split('BEGIN:VEVENT').slice(1);
  return blocks.map((block, index) => {{
    const section = block.split('END:VEVENT')[0] || '';
    const lines = section.split(/\\r?\\n/).map(line => line.trim()).filter(Boolean);
    const event = {{ uid: '', summary: '', checkIn: null, checkOut: null }};
    for (const line of lines) {{
      if (line.startsWith('UID')) event.uid = line.split(':').slice(1).join(':').trim();
      else if (line.startsWith('SUMMARY')) event.summary = line.split(':').slice(1).join(':').trim();
      else if (line.startsWith('DTSTART')) event.checkIn = parseDateValue(line);
      else if (line.startsWith('DTEND')) event.checkOut = parseDateValue(line);
    }}
    event.uid = event.uid || `event_${{index}}_${{event.checkIn || 'na'}}_${{event.checkOut || 'na'}}`;
    return event;
  }}).filter(event => event.checkIn && event.checkOut);
}}

async function api(path, method = 'GET', payload) {{
  return await this.helpers.httpRequest({{
    method,
    url: `${{N8N_BASE}}${{path}}`,
    headers: {{
      'X-N8N-API-KEY': N8N_API_KEY,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }},
    body: payload,
    json: true,
  }});
}}

async function getBotWorkflow(code) {{
  if (DEFAULT_BOT_WORKFLOW_ID) return await api(`/workflows/${{DEFAULT_BOT_WORKFLOW_ID}}`);
  const listing = await api('/workflows?limit=250');
  const match = (listing.data || []).find(wf => String(wf.name || '').includes(code || ''));
  if (!match) throw new Error('Kein Hotel-Bot-Workflow gefunden.');
  return await api(`/workflows/${{match.id}}`);
}}

async function persistBotWorkflow(detail, globalData) {{
  const payload = {{
    name: detail.name,
    nodes: detail.nodes,
    connections: detail.connections,
    settings: detail.settings || {{}},
    staticData: {{ global: globalData }},
  }};
  return await api(`/workflows/${{detail.id}}`, 'PUT', payload);
}}

const input = $input.first().json;
const method = input.httpMethod || 'POST';
const query = input.query || {{}};
const payload = unwrapPayload(input);
const code = String(payload.code || query.code || '').trim().toUpperCase();
if (!code) return [{{ json: {{ success: false, error: 'Code fehlt.' }} }}];

const detail = await getBotWorkflow(code);
const globalData = detail.staticData?.global || {{}};
globalData.portalCode = code;
globalData.icalFeeds = Array.isArray(globalData.icalFeeds) ? globalData.icalFeeds : [];
globalData.externalBookings = globalData.externalBookings || {{}};

if (method === 'GET') {{
  return [{{ json: {{ success: true, code, feeds: globalData.icalFeeds }} }}];
}}

const action = String(payload.action || 'save').toLowerCase();
if (action === 'test') {{
  const feed = normalizeFeed(payload.feed || (Array.isArray(payload.feeds) ? payload.feeds[0] : null));
  if (!feed?.url) return [{{ json: {{ success: false, error: 'Feed-URL fehlt.' }} }}];
  let text;
  try {{
    text = await this.helpers.httpRequest({{ method: 'GET', url: feed.url, json: false }});
  }} catch (error) {{
    return [{{ json: {{ success: false, error: `Abruf fehlgeschlagen: ${{error.message || error}}` }} }}];
  }}
  const events = parseIcalEvents(text);
  return [{{ json: {{
    success: true,
    tested: true,
    feed,
    eventCount: events.length,
    preview: events.slice(0, 3),
  }} }}];
}}

const feeds = (Array.isArray(payload.feeds) ? payload.feeds : []).map(normalizeFeed).filter(Boolean);
globalData.icalFeeds = feeds;
await persistBotWorkflow(detail, globalData);

return [{{ json: {{ success: true, code, feeds }} }}];
"""

ical_sync_code = f"""
const N8N_BASE = 'https://n8n.leolan.net/api/v1';
const N8N_API_KEY = '{API_KEY}';
const BOT_NAME_MARKER = 'Hotel WhatsApp Bot';

async function api(path, method = 'GET', payload) {{
  return await this.helpers.httpRequest({{
    method,
    url: `${{N8N_BASE}}${{path}}`,
    headers: {{
      'X-N8N-API-KEY': N8N_API_KEY,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }},
    body: payload,
    json: true,
  }});
}}

function unfoldIcal(text) {{
  return String(text || '').replace(/\\r\\n[ \t]/g, '').replace(/\\n[ \t]/g, '');
}}

function parseDateValue(raw) {{
  const value = String(raw || '').trim().split(':').pop();
  if (!value) return null;
  if (/^\d{{8}}$/.test(value)) return `${{value.slice(0,4)}}-${{value.slice(4,6)}}-${{value.slice(6,8)}}`;
  const clean = value.replace('Z', '');
  if (/^\d{{8}}T\d{{6}}$/.test(clean)) return `${{clean.slice(0,4)}}-${{clean.slice(4,6)}}-${{clean.slice(6,8)}}`;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}}

function parseIcalEvents(text) {{
  const normalized = unfoldIcal(text);
  const blocks = normalized.split('BEGIN:VEVENT').slice(1);
  return blocks.map((block, index) => {{
    const section = block.split('END:VEVENT')[0] || '';
    const lines = section.split(/\\r?\\n/).map(line => line.trim()).filter(Boolean);
    const event = {{ uid: '', summary: '', checkIn: null, checkOut: null }};
    for (const line of lines) {{
      if (line.startsWith('UID')) event.uid = line.split(':').slice(1).join(':').trim();
      else if (line.startsWith('SUMMARY')) event.summary = line.split(':').slice(1).join(':').trim();
      else if (line.startsWith('DTSTART')) event.checkIn = parseDateValue(line);
      else if (line.startsWith('DTEND')) event.checkOut = parseDateValue(line);
    }}
    event.uid = event.uid || `event_${{index}}_${{event.checkIn || 'na'}}_${{event.checkOut || 'na'}}`;
    return event;
  }}).filter(event => event.checkIn && event.checkOut);
}}

function overlaps(aStart, aEnd, bStart, bEnd) {{
  return aStart < bEnd && bStart < aEnd;
}}

function isoToday() {{
  return new Date().toISOString().slice(0, 10);
}}

async function saveWorkflow(detail, globalData) {{
  const payload = {{
    name: detail.name,
    nodes: detail.nodes,
    connections: detail.connections,
    settings: detail.settings || {{}},
    staticData: {{ global: globalData }},
  }};
  await api(`/workflows/${{detail.id}}`, 'PUT', payload);
}}

const listing = await api('/workflows?limit=250');
const hotelBots = (listing.data || []).filter(wf => String(wf.name || '').includes(BOT_NAME_MARKER));
const today = isoToday();
const summary = [];

for (const workflow of hotelBots) {{
  const detail = await api(`/workflows/${{workflow.id}}`);
  const globalData = detail.staticData?.global || {{}};
  const feeds = Array.isArray(globalData.icalFeeds) ? globalData.icalFeeds : [];
  if (!feeds.length) {{
    summary.push({{ workflowId: workflow.id, name: workflow.name, feeds: 0, synced: 0, skipped: true }});
    continue;
  }}

  globalData.bookings = globalData.bookings || {{}};
  globalData.externalBookings = {{}};
  globalData.rooms = globalData.rooms || {{
    standard: {{ total: 20, available: 20, pricePerNight: 89 }},
    superior: {{ total: 10, available: 10, pricePerNight: 129 }},
    suite: {{ total: 5, available: 5, pricePerNight: 199 }},
  }};

  let synced = 0;
  for (const feed of feeds) {{
    if (!feed?.url) continue;
    try {{
      const text = await this.helpers.httpRequest({{ method: 'GET', url: feed.url, json: false }});
      const events = parseIcalEvents(text);
      for (const event of events) {{
        const bookingId = `external_${{feed.roomType || 'standard'}}_${{feed.source || 'ical'}}_${{event.uid}}`;
        globalData.externalBookings[bookingId] = {{
          id: bookingId,
          checkIn: event.checkIn,
          checkOut: event.checkOut,
          roomType: String(feed.roomType || 'standard').trim() || 'standard',
          source: String(feed.source || event.summary || 'iCal').trim() || 'iCal',
          summary: event.summary || String(feed.source || 'iCal'),
          status: 'confirmed',
          importedAt: new Date().toISOString(),
          external: true,
        }};
        synced += 1;
      }}
    }} catch (error) {{
      const key = `sync_error_${{String(feed.source || 'ical').replace(/[^a-z0-9_-]+/gi, '_')}}`;
      globalData.externalBookings[key] = {{
        id: key,
        source: String(feed.source || 'iCal'),
        roomType: String(feed.roomType || 'standard'),
        status: 'error',
        error: String(error.message || error),
        importedAt: new Date().toISOString(),
      }};
    }}
  }}

  for (const [roomType, roomInfo] of Object.entries(globalData.rooms)) {{
    const internal = Object.values(globalData.bookings).filter(booking =>
      booking && booking.status === 'confirmed' && (booking.roomType || 'standard') === roomType && booking.checkIn && booking.checkOut && isOccupiedOnDate(booking.checkIn, booking.checkOut, today)
    );
    const external = Object.values(globalData.externalBookings).filter(booking =>
      booking && booking.status === 'confirmed' && (booking.roomType || 'standard') === roomType && booking.checkIn && booking.checkOut && isOccupiedOnDate(booking.checkIn, booking.checkOut, today)
    );
    roomInfo.available = Math.max(0, Number(roomInfo.total || 0) - internal.length - external.length);
  }}

  globalData.lastIcalSyncAt = new Date().toISOString();
  await saveWorkflow(detail, globalData);
  summary.push({{ workflowId: workflow.id, name: workflow.name, feeds: feeds.length, synced }});
}}

return [{{ json: {{ success: true, syncedAt: new Date().toISOString(), workflows: summary }} }}];
"""

workflows = [
    {
        'name': 'Hotel iCal Config',
        'nodes': [
            {'id': 'ic1', 'name': 'Hotel iCal Config Webhook', 'type': 'n8n-nodes-base.webhook', 'typeVersion': 2, 'position': [260, 280], 'parameters': {'httpMethod': 'POST', 'path': 'hotel-ical-config', 'responseMode': 'responseNode', 'options': {}}},
            {'id': 'ic2', 'name': 'Hotel iCal Config GET', 'type': 'n8n-nodes-base.webhook', 'typeVersion': 2, 'position': [260, 460], 'parameters': {'httpMethod': 'GET', 'path': 'hotel-ical-config', 'responseMode': 'responseNode', 'options': {}}},
            {'id': 'ic3', 'name': 'Handle iCal Config', 'type': 'n8n-nodes-base.code', 'typeVersion': 2, 'position': [580, 360], 'parameters': {'jsCode': ical_config_code}},
            {'id': 'ic4', 'name': 'Hotel iCal Config Response', 'position': [900, 360], **response_node},
        ],
        'connections': {
            'Hotel iCal Config Webhook': {'main': [[{'node': 'Handle iCal Config', 'type': 'main', 'index': 0}]]},
            'Hotel iCal Config GET': {'main': [[{'node': 'Handle iCal Config', 'type': 'main', 'index': 0}]]},
            'Handle iCal Config': {'main': [[{'node': 'Hotel iCal Config Response', 'type': 'main', 'index': 0}]]},
        },
        'settings': {'executionOrder': 'v1'},
    },
    {
        'name': 'Hotel iCal Sync',
        'nodes': [
            {'id': 'is1', 'name': 'Hourly Trigger', 'type': 'n8n-nodes-base.scheduleTrigger', 'typeVersion': 1.2, 'position': [260, 280], 'parameters': {'rule': {'interval': [{'field': 'hours', 'hoursInterval': 1}]}}},
            {'id': 'is2', 'name': 'Sync External Bookings', 'type': 'n8n-nodes-base.code', 'typeVersion': 2, 'position': [580, 280], 'parameters': {'jsCode': ical_sync_code}},
        ],
        'connections': {
            'Hourly Trigger': {'main': [[{'node': 'Sync External Bookings', 'type': 'main', 'index': 0}]]},
        },
        'settings': {'executionOrder': 'v1'},
    },
]

for workflow in workflows:
    wid, export_path = upsert_workflow(workflow)
    print(f'OK {workflow["name"]} -> {wid} ({export_path})')
