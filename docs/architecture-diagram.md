# Architecture Diagram

```mermaid
flowchart LR
  Browser[React UI] --> API[Express REST API]
  API --> DB[(PostgreSQL)]
  API --> Cache[(Redis)]
  API --> Events[Socket.IO]
  API --> Mail[Nodemailer]
```