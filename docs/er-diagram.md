# ER Diagram

```mermaid
erDiagram
  USERS ||--o{ PROJECTS : owns
  USERS ||--o{ TASKS : assigned
  PROJECTS ||--o{ TASKS : contains
  USERS ||--o{ RCA_REPORTS : reports
```
