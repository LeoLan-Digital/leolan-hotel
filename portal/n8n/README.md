# n8n Workflows

Die produktiven Hotel-Portal-Workflows wurden bereits in n8n deployt:

- `hotel-portal-auth`
- `hotel-portal-upload`
- `hotel-portal-chat`
- `hotel-portal-upgrade`
- `hotel-portal-upgrade-status`
- `hotel-portal-upgrade-stripe`

Die exportierten Workflow-JSONs werden absichtlich **nicht** im Repo versioniert, weil sie eingebettete Secrets enthalten können.

Zum Neu-Deploy das Skript `../deploy_hotel_portal_workflows.py` nur mit sicheren Umgebungsvariablen ausführen und anschließend bei Bedarf lokal exportieren.
