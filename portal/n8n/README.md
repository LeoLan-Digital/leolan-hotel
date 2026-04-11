# n8n Workflows

Die produktiven Hotel-Portal-Workflows wurden bereits in n8n deployt:

- `hotel-portal-auth`
- `hotel-portal-upload`
- `hotel-portal-chat`
- `hotel-portal-upgrade`
- `hotel-portal-upgrade-status`
- `hotel-portal-upgrade-stripe`
- `hotel-ical-config`
- `hotel-ical-sync`

Die exportierten Workflow-JSONs werden absichtlich **nicht** im Repo versioniert, weil sie eingebettete Secrets enthalten können.

Zum Neu-Deploy:

- Portal-Workflows: `../deploy_hotel_portal_workflows.py`
- iCal-Workflows: `../deploy_hotel_ical_workflows.py`

Beide Skripte nur mit sicheren Umgebungsvariablen ausführen. Exportierte `*.workflow.json`-Dateien bleiben lokal und werden nicht versioniert.
