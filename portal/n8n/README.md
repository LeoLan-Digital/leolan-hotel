# Hotel Dynamic Pricing Engine — n8n Import-Anleitung

## Workflow: `hotel-pricing-workflow.json`

Webhook-basierter n8n-Workflow zur KI-gestützten Hotelpreisempfehlung.

---

## Import-Schritte

### 1. n8n öffnen
Gehe zu: **https://n8n.leolan.net**

### 2. Workflow importieren
1. Im linken Menü auf **Workflows** klicken
2. Oben rechts **+ New Workflow** → dann **Import from File**
3. Datei `hotel-pricing-workflow.json` aus diesem Ordner auswählen
4. **Import** bestätigen

### 3. Workflow aktivieren
1. Oben rechts den Toggle **Inactive → Active** umlegen
2. Der Webhook ist dann erreichbar unter:
   ```
   POST https://n8n.leolan.net/webhook/hotel-pricing
   ```

---

## Workflow-Architektur

```
Webhook
  └── Parse Input (Code)
        └── Scrape Booking.com (HTTP Request)
              └── Parse Competitor Prices (Code)
                    └── Claude Haiku Analysis (HTTP Request → Anthropic API)
                          └── Build Response (Code)
                                └── Respond to Webhook
```

### Nodes im Detail

| Node | Typ | Beschreibung |
|------|-----|--------------|
| **Webhook** | Trigger | Empfängt POST-Anfragen auf `/webhook/hotel-pricing` |
| **Parse Input** | Code | Validiert Input, berechnet Wochentag, Saison, Vorlaufzeit |
| **Scrape Booking.com** | HTTP Request | Versucht Preise von Booking.com zu scrapen (continueOnFail) |
| **Parse Competitor Prices** | Code | Extrahiert Preise aus HTML; fällt auf Mock-Daten zurück wenn geblockt |
| **Claude Haiku Analysis** | HTTP Request | Sendet Daten an Anthropic API (Claude Haiku) |
| **Build Response** | Code | Kombiniert AI-Antwort mit Marktdaten |
| **Respond to Webhook** | Response | Sendet JSON-Antwort zurück |

---

## API-Anfrage

### Endpoint
```
POST https://n8n.leolan.net/webhook/hotel-pricing
Content-Type: application/json
```

### Request Body
```json
{
  "hotel_id": "hotel-123",
  "city": "Berlin",
  "room_type": "Doppelzimmer",
  "checkin_date": "2026-07-15",
  "nights": 2
}
```

### Felder
| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|--------------|
| `hotel_id` | string | Nein | Identifikator des Hotels |
| `city` | string | Ja | Stadt (deutsch oder englisch) |
| `room_type` | string | Nein | Zimmertyp (Default: Doppelzimmer) |
| `checkin_date` | string | Ja | Datum im Format `YYYY-MM-DD` |
| `nights` | number | Nein | Anzahl Nächte (Default: 1) |

### Response
```json
{
  "recommended_price": 115,
  "min_price": 85,
  "max_price": 165,
  "confidence": "hoch",
  "reasoning": "Wochenendzuschlag +12% aufgrund Freitag-Check-in. Hochsaison Juli mit +18% berücksichtigt. Empfehlung 8% unter Marktdurchschnitt für optimale Auslastung.",
  "competitor_avg": 125,
  "competitor_min": 85,
  "competitor_max": 180,
  "city": "Berlin",
  "room_type": "Doppelzimmer",
  "checkin": "2026-07-15",
  "nights": 2,
  "season": "Hochsaison (Sommer)",
  "day_of_week": "Mittwoch",
  "is_weekend": false,
  "lead_time_days": 51,
  "data_source": "booking_com",
  "generated_at": "2026-05-24T11:30:00.000Z"
}
```

---

## Mock-Daten (Fallback)

Falls Booking.com den Scraping-Zugriff blockiert, werden realistische Mock-Preise für deutsche Städte verwendet:

| Stadt | Einzelzimmer | Doppelzimmer | Suite |
|-------|-------------|--------------|-------|
| Berlin | 65–125 € | 85–180 € | 180–300 € |
| München | 80–140 € | 105–220 € | 220–340 € |
| Hamburg | 70–115 € | 90–175 € | 175–260 € |
| Frankfurt | 75–140 € | 95–195 € | 195–300 € |
| Dresden | 55–90 € | 65–130 € | 130–200 € |
| Köln | 65–110 € | 85–155 € | 155–240 € |
| Düsseldorf | 70–115 € | 88–172 € | 172–255 € |
| Stuttgart | 72–120 € | 92–188 € | 188–280 € |
| Leipzig | 55–88 € | 68–122 € | 122–185 € |

---

## Pricing-Logik (Claude Haiku)

Claude Haiku berücksichtigt folgende Faktoren:

1. **Wochentag** — Freitag/Samstag: +10–15% Aufschlag
2. **Saison** — Sommer (Jun–Aug): +15–20%; Winter (Dez–Feb): −10–15%
3. **Vorlaufzeit** — Kurzfristig (<3 Tage): −5–10% (Zimmer füllen); Fernbuchung normal
4. **Marktpositionierung** — 5–10% unter Mitbewerber-Durchschnitt für gute Auslastung

---

## Troubleshooting

### Webhook antwortet nicht
- Workflow muss auf **Active** gesetzt sein
- n8n-Server läuft auf `https://n8n.leolan.net` (Hetzner: 94.130.109.39)

### Claude antwortet nicht
- API Key in Node **Claude Haiku Analysis** unter Header `x-api-key` prüfen
- Aktueller Key: In `TOOLS.md` unter "Anthropic (Claude)"

### Nur Mock-Daten
- Normal — Booking.com blockt Scraping-Requests gelegentlich
- Mock-Daten sind realistisch und für Preisempfehlungen geeignet
- `data_source: "mock_data"` in der Antwort zeigt an, wann Mock verwendet wird

---

## Dateien in diesem Ordner

```
n8n/
├── hotel-pricing-workflow.json   # n8n Workflow Export (importierbar)
└── README.md                     # Diese Datei
```

---

*Erstellt: 2026-05-24 | LeoLan Digital | Dynamic Pricing BETA*
