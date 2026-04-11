import json
import urllib.request
import urllib.error
from pathlib import Path

API_KEY = 'N8N_API_KEY_FROM_ENV'
BASE = 'https://n8n.leolan.net/api/v1'
BREVO_KEY = 'BREVO_API_KEY_FROM_ENV'
STRIPE_SECRET = 'STRIPE_SECRET_FROM_ENV'
EXPORT_DIR = Path('/Users/leo/.openclaw/workspace/repos/leolan-hotel/portal/n8n')
EXPORT_DIR.mkdir(parents=True, exist_ok=True)

DEFAULT_CUSTOMER = {
    'HOTEL01': {
        'code': 'HOTEL01',
        'name': 'Beispiel Hotel',
        'hotelName': 'Beispiel Hotel',
        'restaurantName': 'Beispiel Hotel',
        'slug': 'beispiel-hotel',
        'plan': 'starter',
        'msgLimit': 500,
        'msgCount': {
            '2026-04-01': 16,
            '2026-04-03': 21,
            '2026-04-08': 34,
            '2026-04-10': 18,
            '2026-04-11': 11,
        },
        'customerEmail': 'hotel@example.com',
        'warned80': False,
        'warned100': False,
    }
}


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
        with urllib.request.urlopen(req, timeout=60) as resp:
            raw = resp.read().decode('utf-8')
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', errors='replace')
        raise RuntimeError(f'{method} {path} failed: {e.code} {body}')


def merge_static_data(static_data, with_messages=False, with_price_ids=False):
    static_data = static_data or {'global': {}}
    static_data.setdefault('global', {})
    global_data = static_data['global']
    customers = global_data.setdefault('customers', {})
    for code, customer in DEFAULT_CUSTOMER.items():
        if code not in customers:
            customers[code] = json.loads(json.dumps(customer))
        else:
            for key, value in customer.items():
                customers[code].setdefault(key, value)
    if with_messages:
        global_data.setdefault('messages', {})
        for customer in DEFAULT_CUSTOMER.values():
            global_data['messages'].setdefault(customer['slug'], [])
    if with_price_ids:
        global_data.setdefault('priceIds', {})
    return static_data


def upsert_workflow(payload, *, with_messages=False, with_price_ids=False):
    listing = api('/workflows?limit=250')
    existing = next((wf for wf in listing.get('data', []) if wf.get('name') == payload['name']), None)
    if existing:
      detail = api(f"/workflows/{existing['id']}")
      payload['staticData'] = merge_static_data(detail.get('staticData'), with_messages=with_messages, with_price_ids=with_price_ids)
      result = api(f"/workflows/{existing['id']}", method='PUT', payload=payload)
      workflow_id = existing['id']
    else:
      payload['staticData'] = merge_static_data(None, with_messages=with_messages, with_price_ids=with_price_ids)
      result = api('/workflows', method='POST', payload=payload)
      workflow_id = result['id']
    api(f'/workflows/{workflow_id}/activate', method='POST', payload={})
    detail = api(f"/workflows/{workflow_id}")
    export_path = EXPORT_DIR / f"{payload['name'].lower().replace(' ', '-').replace('—', '-').replace('ü', 'ue')}.workflow.json"
    export_path.write_text(json.dumps(detail, indent=2, ensure_ascii=False))
    return workflow_id, export_path


registry_snippet = r'''
const DEFAULT_CUSTOMERS = {
  HOTEL01: {
    code: 'HOTEL01',
    name: 'Beispiel Hotel',
    hotelName: 'Beispiel Hotel',
    restaurantName: 'Beispiel Hotel',
    slug: 'beispiel-hotel',
    plan: 'starter',
    msgLimit: 500,
    msgCount: { '2026-04-01': 16, '2026-04-03': 21, '2026-04-08': 34, '2026-04-10': 18, '2026-04-11': 11 },
    customerEmail: 'hotel@example.com',
    warned80: false,
    warned100: false,
  },
};
function initCustomers(staticData) {
  if (!staticData.customers) staticData.customers = JSON.parse(JSON.stringify(DEFAULT_CUSTOMERS));
  for (const [code, customer] of Object.entries(DEFAULT_CUSTOMERS)) {
    if (!staticData.customers[code]) staticData.customers[code] = JSON.parse(JSON.stringify(customer));
    staticData.customers[code].hotelName = staticData.customers[code].hotelName || staticData.customers[code].restaurantName || staticData.customers[code].name || customer.hotelName;
    staticData.customers[code].restaurantName = staticData.customers[code].restaurantName || staticData.customers[code].hotelName || customer.restaurantName;
  }
  return staticData.customers;
}
function normalizeCode(value) {
  return String(value || '').trim().toUpperCase();
}
function getCustomerByCode(staticData, code) {
  const customers = initCustomers(staticData);
  return customers[normalizeCode(code)] || null;
}
function monthUsage(msgCount = {}) {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return Object.entries(msgCount).reduce((sum, [day, count]) => day.startsWith(monthKey) ? sum + Number(count || 0) : sum, 0);
}
function weekUsage(msgCount = {}) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6);
  start.setHours(0,0,0,0);
  return Object.entries(msgCount).reduce((sum, [day, count]) => {
    const date = new Date(`${day}T00:00:00`);
    return date >= start && date <= now ? sum + Number(count || 0) : sum;
  }, 0);
}
'''

auth_code = registry_snippet + r'''
const payload = $json.body ?? $json;
const staticData = $getWorkflowStaticData('global');
const customer = getCustomerByCode(staticData, payload.code);
if (!customer) return [{ json: { success: false, error: 'Ungültiger Kunden-Code.' } }];
return [{ json: {
  success: true,
  code: customer.code,
  name: customer.name || customer.hotelName,
  hotelName: customer.hotelName || customer.restaurantName,
  slug: customer.slug,
  customerEmail: customer.customerEmail || '',
  token: `hotel-portal-${customer.slug}-${customer.code}`,
} }];
'''

upload_code = registry_snippet + rf'''
const payload = $json.body ?? $json;
const staticData = $getWorkflowStaticData('global');
const customer = getCustomerByCode(staticData, payload.code);
if (!customer) return [{{ json: {{ success: false, error: 'Ungültiger Kunden-Code.' }} }}];

const auth = 'Basic ' + Buffer.from('WEBDAV_USER:WEBDAV_PASS').toString('base64');
const type = String(payload.type || '');
const slug = customer.slug;
const hotelName = customer.hotelName || customer.restaurantName || customer.name;
const base = `http://192.168.178.129:5005/home/Kunden-Uploads/Hotels/${{slug}}`;
const results = [];

async function ensureFolder(url) {{
  await this.helpers.httpRequest({{
    method: 'MKCOL',
    url,
    headers: {{ Authorization: auth }},
    ignoreHttpStatusErrors: true,
    json: false,
  }});
}}
function sanitizeFilename(name, fallback) {{
  return String(name || fallback || 'upload.bin').replace(/[^a-zA-Z0-9._-]+/g, '-');
}}
function stripDataUrl(value) {{
  const input = String(value || '');
  return input.includes(',') ? input.split(',').slice(1).join(',') : input;
}}
async function putFile(url, base64Data, contentType = 'application/octet-stream') {{
  const buffer = Buffer.from(stripDataUrl(base64Data), 'base64');
  const response = await this.helpers.httpRequest({{
    method: 'PUT',
    url,
    headers: {{ Authorization: auth, 'Content-Type': contentType }},
    body: buffer,
    json: false,
    ignoreHttpStatusErrors: true,
    returnFullResponse: true,
  }});
  if (response.statusCode >= 400) throw new Error(`Upload fehlgeschlagen: ${{response.statusCode}}`);
}}
async function saveJson(folder, filename, data) {{
  const payload64 = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
  await putFile(`${{folder}}/${{filename}}`, payload64, 'application/json');
  results.push(filename);
}}

await ensureFolder('http://192.168.178.129:5005/home');
await ensureFolder('http://192.168.178.129:5005/home/Kunden-Uploads');
await ensureFolder('http://192.168.178.129:5005/home/Kunden-Uploads/Hotels');
await ensureFolder(base);

if (type === 'roomservice-menu') {{
  const folder = `${{base}}/roomservice-menu`;
  await ensureFolder(folder);
  const filename = sanitizeFilename(payload.filename, 'roomservice-menu');
  await putFile(`${{folder}}/${{filename}}`, payload.data, filename.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');
  results.push(filename);
}} else if (type === 'hotel-photos') {{
  const files = Array.isArray(payload.files) ? payload.files : [];
  if (!files.length) return [{{ json: {{ success: false, error: 'Keine Hotelfotos erhalten.' }} }}];
  const folder = `${{base}}/hotel-photos`;
  await ensureFolder(folder);
  for (const file of files.slice(0, 10)) {{
    const filename = sanitizeFilename(file.filename, `hotel-photo-${{results.length + 1}}.jpg`);
    await putFile(`${{folder}}/${{filename}}`, file.data, 'application/octet-stream');
    results.push(filename);
  }}
}} else if (type === 'opening-hours') {{
  const folder = `${{base}}/opening-hours`;
  await ensureFolder(folder);
  await saveJson(folder, 'opening-hours.json', {{ hotelName, slug, hours: payload.hours || {{}}, updatedAt: new Date().toISOString() }});
}} else if (type === 'issue-report') {{
  const folder = `${{base}}/issue-report`;
  await ensureFolder(folder);
  const room = payload.issue?.room ? String(payload.issue.room).replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 32) : 'bereich';
  const filename = `${{new Date().toISOString().replace(/[:.]/g, '-')}}-${{room}}.json`;
  await saveJson(folder, filename, {{ hotelName, slug, issue: payload.issue || {{}}, updatedAt: new Date().toISOString() }});
}} else if (type === 'price-list') {{
  const folder = `${{base}}/price-list`;
  await ensureFolder(folder);
  const filename = sanitizeFilename(payload.filename, 'price-list');
  await putFile(`${{folder}}/${{filename}}`, payload.data, 'application/octet-stream');
  results.push(filename);
}} else {{
  return [{{ json: {{ success: false, error: 'Unbekannter Upload-Typ.' }} }}];
}}

const subject = `[Hotel Portal Upload] ${{hotelName}} · ${{type}}`;
const html = `<div style="font-family:Arial,sans-serif;color:#17233b"><h2>Neuer Hotel-Portal Upload</h2><p><strong>Hotel:</strong> ${{hotelName}}</p><p><strong>Slug:</strong> ${{slug}}</p><p><strong>Typ:</strong> ${{type}}</p><p><strong>Dateien:</strong> ${{results.join(', ')}}</p><p><strong>Zeit:</strong> ${{new Date().toLocaleString('de-DE')}}</p></div>`;
await this.helpers.httpRequest({{
  method: 'POST',
  url: 'https://api.brevo.com/v3/smtp/email',
  headers: {{ 'api-key': '{BREVO_KEY}', 'Content-Type': 'application/json' }},
  body: {{
    sender: {{ email: 'business@leolan.net', name: 'LeoLan Digital' }},
    to: [{{ email: 'business@leolan.net', name: 'LeoLan Digital' }}],
    subject,
    htmlContent: html,
  }},
  json: true,
}});

return [{{ json: {{ success: true, uploaded: results, slug, hotelName, type }} }}];
'''

chat_code = registry_snippet + rf'''
const staticData = $getWorkflowStaticData('global');
const customers = initCustomers(staticData);
if (!staticData.messages) staticData.messages = {{}};

function getBySlug(slug) {{ return Object.values(customers).find(item => item.slug === slug) || null; }}
function getThread(slug) {{ if (!staticData.messages[slug]) staticData.messages[slug] = []; return staticData.messages[slug]; }}

const payload = {{ ...($json || {{}}), ...($json.query || {{}}), ...($json.params || {{}}), ...($json.body || {{}}) }};
const customer = payload.slug ? getBySlug(String(payload.slug || '')) : getCustomerByCode(staticData, payload.code);
if (!customer) return [{{ json: {{ success: false, error: 'Kunde nicht gefunden.' }} }}];
const hotelName = customer.hotelName || customer.restaurantName || customer.name;

if ($json.query || $json.httpMethod === 'GET') {{
  return [{{ json: {{ success: true, slug: customer.slug, hotelName, customerEmail: customer.customerEmail || '', messages: getThread(customer.slug) }} }}];
}}

const message = String(payload.message || '').trim();
if (!message) return [{{ json: {{ success: false, error: 'Leere Nachricht.' }} }}];
if (payload.customerEmail) customer.customerEmail = String(payload.customerEmail).trim();
const entry = {{ from: 'customer', message, timestamp: new Date().toISOString() }};
getThread(customer.slug).push(entry);

const html = `<div style="font-family:Arial,sans-serif;color:#17233b"><h2>Neue Hotel-Portal Nachricht</h2><p><strong>Hotel:</strong> ${{hotelName}}</p><p><strong>Slug:</strong> ${{customer.slug}}</p><p><strong>Nachricht:</strong></p><div style="white-space:pre-wrap;background:#f5f7fb;padding:14px;border-radius:12px">${{message}}</div></div>`;
await this.helpers.httpRequest({{
  method: 'POST',
  url: 'https://api.brevo.com/v3/smtp/email',
  headers: {{ 'api-key': '{BREVO_KEY}', 'Content-Type': 'application/json' }},
  body: {{
    sender: {{ email: 'business@leolan.net', name: 'LeoLan Digital' }},
    to: [{{ email: 'business@leolan.net', name: 'LeoLan Digital' }}],
    subject: `Neue Hotelkunden-Nachricht · ${{hotelName}}`,
    htmlContent: html,
  }},
  json: true,
}});

return [{{ json: {{ success: true, slug: customer.slug, hotelName, customerEmail: customer.customerEmail || '', messages: getThread(customer.slug) }} }}];
'''

upgrade_code = registry_snippet + rf'''
const staticData = $getWorkflowStaticData('global');
const customers = initCustomers(staticData);
if (!staticData.priceIds) staticData.priceIds = {{}};

async function stripeRequest(method, path, form) {{
  const body = new URLSearchParams(form).toString();
  return await this.helpers.httpRequest({{
    method,
    url: `https://api.stripe.com/v1/${{path}}`,
    headers: {{ Authorization: 'Bearer {STRIPE_SECRET}', 'Content-Type': 'application/x-www-form-urlencoded' }},
    body,
    json: true,
  }});
}}
async function ensureRecurringPrice(key, amount, name) {{
  if (staticData.priceIds[key]) return staticData.priceIds[key];
  const product = await stripeRequest('POST', 'products', {{ name }});
  const price = await stripeRequest('POST', 'prices', {{
    product: product.id,
    unit_amount: String(amount),
    currency: 'eur',
    'recurring[interval]': 'month',
  }});
  staticData.priceIds[key] = price.id;
  return price.id;
}}

const payload = {{ ...($json || {{}}), ...($json.query || {{}}), ...($json.params || {{}}), ...($json.body || {{}}) }};
const isStripeEvent = Boolean(payload?.type && payload?.data?.object);
if (payload.code && !payload.upgradeType && !isStripeEvent) {{
  const customer = getCustomerByCode(staticData, payload.code);
  if (!customer) return [{{ json: {{ success: false, error: 'Ungültiger Kunden-Code.' }} }}];
  return [{{ json: {{
    success: true,
    slug: customer.slug,
    hotelName: customer.hotelName || customer.restaurantName || customer.name,
    plan: customer.plan || 'starter',
    msgLimit: Number(customer.msgLimit || 500),
    weekUsage: weekUsage(customer.msgCount || {{}}),
    monthUsage: monthUsage(customer.msgCount || {{}}),
  }} }}];
}}

if (isStripeEvent) {{
  const event = payload.event || payload;
  if ((event.type || '') !== 'checkout.session.completed') return [{{ json: {{ success: true, ignored: true }} }}];
  const object = event.data?.object || {{}};
  const customer = getCustomerByCode(staticData, object.metadata?.code);
  if (!customer) return [{{ json: {{ success: false, error: 'Kunde aus Stripe-Webhook unbekannt.' }} }}];
  const upgradeType = object.metadata?.upgradeType || '';
  if (upgradeType === 'pro') {{ customer.plan = 'pro'; customer.msgLimit = Math.max(Number(customer.msgLimit || 0), 2000); }}
  if (upgradeType === 'msg_s') customer.msgLimit = Math.max(Number(customer.msgLimit || 0), 1000);
  if (upgradeType === 'msg_m') customer.msgLimit = Math.max(Number(customer.msgLimit || 0), 2000);
  if (upgradeType === 'msg_l') customer.msgLimit = Math.max(Number(customer.msgLimit || 0), 20000);
  customer.warned80 = false;
  customer.warned100 = false;
  return [{{ json: {{ success: true, hotelName: customer.hotelName || customer.restaurantName || customer.name, msgLimit: customer.msgLimit }} }}];
}}

const customer = getCustomerByCode(staticData, payload.code);
if (!customer) return [{{ json: {{ success: false, error: 'Ungültiger Kunden-Code.' }} }}];
const upgradeType = String(payload.upgradeType || '');
const config = {{
  pro: {{ amount: 34900, label: 'Hotel Pro Upgrade (349€/Monat)' }},
  msg_s: {{ amount: 49900, label: 'Hotel Nachrichten-Upgrade S (1.000/Mo)' }},
  msg_m: {{ amount: 59900, label: 'Hotel Nachrichten-Upgrade M (2.000/Mo)' }},
  msg_l: {{ amount: 69900, label: 'Hotel Nachrichten-Upgrade L (20.000/Mo)' }},
}}[upgradeType];
if (!config) return [{{ json: {{ success: false, error: 'Unbekanntes Upgrade.' }} }}];
const priceId = await ensureRecurringPrice(upgradeType, config.amount, config.label);
const session = await stripeRequest('POST', 'checkout/sessions', {{
  mode: 'subscription',
  success_url: 'https://hotel.leolan.net/portal/?upgrade=success',
  cancel_url: 'https://hotel.leolan.net/portal/?upgrade=cancel',
  'line_items[0][price]': priceId,
  'line_items[0][quantity]': '1',
  'metadata[code]': customer.code,
  'metadata[slug]': customer.slug,
  'metadata[upgradeType]': upgradeType,
  customer_email: customer.customerEmail || '',
}});
return [{{ json: {{ success: true, checkoutUrl: session.url, plan: customer.plan || 'starter', msgLimit: customer.msgLimit || 500 }} }}];
'''

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
                ]
            }
        }
    }
}

workflows = [
    {
        'name': 'Hotel Portal Auth',
        'nodes': [
            {'id': 'ha1', 'name': 'Hotel Portal Auth Webhook', 'type': 'n8n-nodes-base.webhook', 'typeVersion': 2, 'position': [260, 280], 'parameters': {'httpMethod': 'POST', 'path': 'hotel-portal-auth', 'responseMode': 'responseNode', 'options': {}}},
            {'id': 'ha2', 'name': 'Validate Hotel Code', 'type': 'n8n-nodes-base.code', 'typeVersion': 2, 'position': [560, 280], 'parameters': {'jsCode': auth_code}},
            {'id': 'ha3', 'name': 'Hotel Portal Auth Response', 'position': [860, 280], **response_node},
        ],
        'connections': {'Hotel Portal Auth Webhook': {'main': [[{'node': 'Validate Hotel Code', 'type': 'main', 'index': 0}]]}, 'Validate Hotel Code': {'main': [[{'node': 'Hotel Portal Auth Response', 'type': 'main', 'index': 0}]]}},
        'settings': {'executionOrder': 'v1'},
    },
    {
        'name': 'Hotel Portal Upload',
        'nodes': [
            {'id': 'hu1', 'name': 'Hotel Portal Upload Webhook', 'type': 'n8n-nodes-base.webhook', 'typeVersion': 2, 'position': [260, 280], 'parameters': {'httpMethod': 'POST', 'path': 'hotel-portal-upload', 'responseMode': 'responseNode', 'options': {}}},
            {'id': 'hu2', 'name': 'Save Hotel Upload', 'type': 'n8n-nodes-base.code', 'typeVersion': 2, 'position': [560, 280], 'parameters': {'jsCode': upload_code}},
            {'id': 'hu3', 'name': 'Hotel Portal Upload Response', 'position': [860, 280], **response_node},
        ],
        'connections': {'Hotel Portal Upload Webhook': {'main': [[{'node': 'Save Hotel Upload', 'type': 'main', 'index': 0}]]}, 'Save Hotel Upload': {'main': [[{'node': 'Hotel Portal Upload Response', 'type': 'main', 'index': 0}]]}},
        'settings': {'executionOrder': 'v1'},
    },
    {
        'name': 'Hotel Portal Chat',
        'nodes': [
            {'id': 'hc1', 'name': 'Hotel Portal Chat Webhook', 'type': 'n8n-nodes-base.webhook', 'typeVersion': 2, 'position': [240, 220], 'parameters': {'httpMethod': 'POST', 'path': 'hotel-portal-chat', 'responseMode': 'responseNode', 'options': {}}},
            {'id': 'hc2', 'name': 'Hotel Portal Chat History Webhook', 'type': 'n8n-nodes-base.webhook', 'typeVersion': 2, 'position': [240, 420], 'parameters': {'httpMethod': 'GET', 'path': 'hotel-portal-chat-history', 'responseMode': 'responseNode', 'options': {}}},
            {'id': 'hc3', 'name': 'Handle Hotel Chat', 'type': 'n8n-nodes-base.code', 'typeVersion': 2, 'position': [560, 320], 'parameters': {'jsCode': chat_code}},
            {'id': 'hc4', 'name': 'Hotel Portal Chat Response', 'position': [860, 320], **response_node},
        ],
        'connections': {
            'Hotel Portal Chat Webhook': {'main': [[{'node': 'Handle Hotel Chat', 'type': 'main', 'index': 0}]]},
            'Hotel Portal Chat History Webhook': {'main': [[{'node': 'Handle Hotel Chat', 'type': 'main', 'index': 0}]]},
            'Handle Hotel Chat': {'main': [[{'node': 'Hotel Portal Chat Response', 'type': 'main', 'index': 0}]]},
        },
        'settings': {'executionOrder': 'v1'},
    },
    {
        'name': 'Hotel Portal Upgrade Checkout',
        'nodes': [
            {'id': 'hg1', 'name': 'Hotel Portal Upgrade Webhook', 'type': 'n8n-nodes-base.webhook', 'typeVersion': 2, 'position': [220, 180], 'parameters': {'httpMethod': 'POST', 'path': 'hotel-portal-upgrade', 'responseMode': 'responseNode', 'options': {}}},
            {'id': 'hg2', 'name': 'Hotel Portal Upgrade Status Webhook', 'type': 'n8n-nodes-base.webhook', 'typeVersion': 2, 'position': [220, 360], 'parameters': {'httpMethod': 'GET', 'path': 'hotel-portal-upgrade-status', 'responseMode': 'responseNode', 'options': {}}},
            {'id': 'hg3', 'name': 'Hotel Portal Upgrade Stripe Webhook', 'type': 'n8n-nodes-base.webhook', 'typeVersion': 2, 'position': [220, 540], 'parameters': {'httpMethod': 'POST', 'path': 'hotel-portal-upgrade-stripe', 'responseMode': 'responseNode', 'options': {}}},
            {'id': 'hg4', 'name': 'Handle Hotel Upgrade', 'type': 'n8n-nodes-base.code', 'typeVersion': 2, 'position': [560, 360], 'parameters': {'jsCode': upgrade_code}},
            {'id': 'hg5', 'name': 'Hotel Portal Upgrade Response', 'position': [900, 360], **response_node},
        ],
        'connections': {
            'Hotel Portal Upgrade Webhook': {'main': [[{'node': 'Handle Hotel Upgrade', 'type': 'main', 'index': 0}]]},
            'Hotel Portal Upgrade Status Webhook': {'main': [[{'node': 'Handle Hotel Upgrade', 'type': 'main', 'index': 0}]]},
            'Hotel Portal Upgrade Stripe Webhook': {'main': [[{'node': 'Handle Hotel Upgrade', 'type': 'main', 'index': 0}]]},
            'Handle Hotel Upgrade': {'main': [[{'node': 'Hotel Portal Upgrade Response', 'type': 'main', 'index': 0}]]},
        },
        'settings': {'executionOrder': 'v1'},
    },
]

for workflow in workflows:
    wid, export_path = upsert_workflow(
        workflow,
        with_messages=workflow['name'] == 'Hotel Portal Chat',
        with_price_ids=workflow['name'] == 'Hotel Portal Upgrade Checkout',
    )
    print(f'OK {workflow["name"]} -> {wid} ({export_path})')
