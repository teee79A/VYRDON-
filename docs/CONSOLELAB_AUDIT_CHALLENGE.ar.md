# ConsoleLab والتدقيق

ConsoleLab يراجع دليل المسار: قائمة الملفات، بصمات sha256، نتيجة فحص الأسرار، المنافذ، الخدمات، ومسار التراجع.

## Route Decision

```text
REQUEST
  │
  ▼
VYRDON ROUTE GATE
  │
  ├── proof
  ├── authority
  ├── state
  ├── trace
  └── risk
        │
        ▼
PASS / HOLD / BLOCK / CHALLENGE
        │
        ▼
EXECUTION OR STOP
```
