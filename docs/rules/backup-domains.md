# Rule: Backup Domains

## Context
High availability and redundancy are critical for Sunburst AI’s telephony platform. We use multiple domains and infrastructure for failover.

## Implementation Rule
- Primary webhook: `https://sunburst-voice.fly.dev`
- Failover webhook: `https://vps1.sunburstdigital.ai`
- Both endpoints run the same Fastify app and use the same environment variables.
- Deploys are staggered to ensure one is always available.

## Rationale
This setup provides true geo/provider redundancy, minimizing downtime and ensuring business continuity during outages or deployments.