# Tech Stack

## Context

Global tech stack defaults for Agent OS projects, overridable in project-specific `.agent-os/product/tech-stack.md`.

## Frontend

**Framework:** React 18.2+  
**Language:** TypeScript 5.0+  
**Build Tool:** Vite 5.0+  
**Package Manager:** npm 10+  
**Node Version:** 20 LTS  
**State Management:** Zustand 4.4+  
**Server State:** TanStack Query 5.0+  
**Forms:** React Hook Form 7.48+ with Zod 3.22+  
**Routing:** React Router 6.20+  
**CSS Framework:** TailwindCSS 3.4+  
**UI Components:** shadcn/ui latest  
**Icons:** Lucide React latest  
**Font Provider:** Google Fonts  
**Font Loading:** Self-hosted via @fontsource  
**Testing Framework:** Jest 29+ with React Testing Library 14+  
**E2E Testing:** Playwright 1.40+  
**Linting:** ESLint 8.55+ with TypeScript rules  
**Formatting:** Prettier 3.1+  
**Git Hooks:** Husky 8.0+ with lint-staged  

## Backend

**Framework:** FastAPI 0.109+  
**Language:** Python 3.11+  
**API Design:** REST with WebSocket support  
**WebSocket:** Socket.io with python-socketio  
**ORM:** SQLAlchemy 2.0+  
**Migration Tool:** Alembic 1.13+  
**Data Validation:** Pydantic 2.5+  
**Task Queue:** Celery 5.3+ with Redis backend  
**Testing Framework:** pytest 7.4+ with pytest-asyncio  
**Linting:** Ruff 0.1.9+  
**Formatting:** Black 23.12+  
**Type Checking:** mypy 1.8+  
**API Documentation:** OpenAPI/Swagger (auto-generated)  
**ASGI Server:** Uvicorn 0.25+  

## Data Processing & Analytics

**Dataframe Library:** Pandas 2.1+  
**Numerical Computing:** NumPy 1.26+  
**Fast Dataframes:** Polars 0.20+ (for performance-critical operations)  
**Statistical Analysis:** SciPy 1.11+  
**Data Validation:** Pandera 0.17+ (dataframe validation)  
**Time Series:** pandas with pd.DatetimeIndex  
**Data Serialization:** Parquet for storage, JSON for APIs  
**Memory Optimization:** pandas categorical types, chunking for large datasets  
**Parallel Processing:** Dask 2023.12+ (for distributed computing)  

## Database

**Primary Database:** PostgreSQL 16+  
**Time-Series Database:** TimescaleDB 2.13+ (for trading data)  
**Cache Layer:** Redis 7.2+  
**Vector Database:** pgvector 0.5+ (for AI agents)  
**Search Engine:** PostgreSQL Full-Text Search (default) or Elasticsearch 8.11+  
**Connection Pooling:** PgBouncer  
**Backup Strategy:** Daily automated with point-in-time recovery  
**Backup Retention:** 30 days standard, 90 days for production  

## AI/ML Stack

**LLM Orchestration:** LangChain 0.1+  
**LLM Providers:** OpenAI API, Anthropic API  
**ML Framework:** scikit-learn 1.4+, XGBoost 2.0+  
**Deep Learning:** PyTorch 2.1+ (optional for custom models)  
**Feature Engineering:** Feature-engine 1.6+  
**Model Versioning:** MLflow or custom versioning  
**Model Serving:** FastAPI endpoints with Pydantic validation  
**Prompt Management:** Custom versioned system or LangSmith  
**Token Tracking:** Custom middleware with usage logging  

## Infrastructure

**Container Runtime:** Docker 24+  
**Container Orchestration:** Docker Compose (dev), Kubernetes 1.28+ (production)  
**Container Registry:** GitHub Container Registry or Docker Hub  
**Load Balancer:** NGINX 1.25+ or Traefik 3.0+  
**Process Manager:** PM2 (Node.js) or Supervisor (Python)  
**Service Mesh:** Istio (optional for microservices)  

## Cloud Platform

**Primary Cloud:** AWS (preferred) or Google Cloud Platform  
**Backend Hosting:** AWS ECS with Fargate or GCP Cloud Run  
**Frontend Hosting:** Vercel or Netlify  
**Database Hosting:** AWS RDS or GCP Cloud SQL  
**Object Storage:** AWS S3 or GCP Cloud Storage  
**CDN:** CloudFlare or AWS CloudFront  
**DNS Management:** CloudFlare or Route53  
**Regions:** Multi-region with primary based on user base  

## Configuration Management

**Environment Variables:** python-dotenv (dev), AWS Systems Manager Parameter Store (prod)  
**Configuration Framework:** Pydantic Settings (Python), env-schema (Node.js)  
**Feature Flags:** Unleash (self-hosted) or LaunchDarkly  
**Infrastructure as Code:** Terraform 1.6+ or Pulumi  
**Configuration Storage:** Git repository with encryption for sensitive values  

## Secrets Management

**Development:** .env files with direnv (never committed)  
**Production Primary:** HashiCorp Vault or AWS Secrets Manager  
**Production Alternative:** Google Secret Manager or Infisical  
**CI/CD Secrets:** GitHub Secrets or Vault integration  
**Rotation Policy:** Automatic 90-day rotation for all secrets  
**Access Pattern:** Zero-trust with temporary credentials  
**Audit:** All secret access logged and monitored  

## Logging & Observability

**Log Collection:** Fluent Bit 3.0+ or Vector 0.34+  
**Log Storage:** OpenObserve or Grafana Loki  
**Log Format:** Structured JSON with correlation IDs  
**Log Levels:** DEBUG, INFO, WARNING, ERROR, CRITICAL  
**Python Logger:** structlog 23.2+  
**JavaScript Logger:** winston 3.11+ or pino 8.17+  
**APM:** Sentry or OpenTelemetry with Jaeger  
**Metrics:** Prometheus with Grafana dashboards  
**Distributed Tracing:** OpenTelemetry with Tempo or Jaeger  
**Alerting:** PagerDuty or Opsgenie with Slack integration  

## Authentication & Authorization

**Authentication Provider:** Auth0 or Supabase Auth  
**Session Management:** Redis with JWT tokens  
**Authorization Model:** RBAC with Casbin or OPA  
**API Security:** API keys with rate limiting  
**OAuth Provider:** Support for Google, GitHub, Microsoft  
**MFA:** TOTP support required for production  
**Password Policy:** Minimum 12 characters with complexity requirements  

## CI/CD

**Platform:** GitHub Actions (primary) or GitLab CI  
**Build Trigger:** Push to main/staging/develop branches  
**Pipeline Stages:** Lint → Test → Security Scan → Build → Deploy  
**Test Coverage:** Minimum 80% for critical paths  
**Security Scanning:** Snyk or Trivy for dependencies and containers  
**Deployment Strategy:** Blue-Green or Canary with automatic rollback  
**Production Branch:** main  
**Staging Branch:** staging  
**Development Branch:** develop  

## Testing

**Unit Test Coverage:** Minimum 80%  
**Integration Tests:** API endpoints and database operations  
**E2E Test Suite:** Critical user journeys  
**Performance Testing:** k6 or Locust for load testing  
**Security Testing:** OWASP ZAP for vulnerability scanning  
**Test Data:** Factories with Faker for realistic data  
**Test Environment:** Docker-based for consistency  

## Monitoring & Alerting

**Uptime Monitoring:** Better Stack or Pingdom  
**Status Page:** Better Stack or Statuspage.io  
**Error Tracking:** Sentry with source map support  
**Performance Monitoring:** Real User Monitoring (RUM) enabled  
**SLO Targets:** 99.9% uptime for production  
**Alert Channels:** PagerDuty → Slack → Email escalation  
**Incident Management:** PagerDuty or Opsgenie  
**Cost Monitoring:** AWS Cost Explorer or GCP Cost Management  

## Security

**Dependency Scanning:** Snyk or GitHub Dependabot  
**Container Scanning:** Trivy or Clair  
**SAST:** SonarQube or CodeQL  
**DAST:** OWASP ZAP scheduled scans  
**SSL/TLS:** Let's Encrypt with auto-renewal  
**WAF:** CloudFlare or AWS WAF  
**DDoS Protection:** CloudFlare or AWS Shield  
**Compliance:** SOC 2 Type II ready architecture  

## Data Pipeline (for Trading/Analytics)

**Stream Processing:** Apache Kafka 3.6+ or Redis Streams  
**Batch Processing:** Apache Airflow 2.8+ or Prefect 2.14+  
**ETL/ELT:** dbt 1.7+ for transformations  
**Data Integration:** Airbyte or Fivetran  
**Message Queue:** RabbitMQ 3.12+ or AWS SQS  
**Event Bus:** Apache Kafka or AWS EventBridge  
**Data Warehouse:** PostgreSQL with partitioning or ClickHouse  
**Data Lake:** Parquet files on S3 with AWS Athena  

## Development Tools

**IDE:** VS Code with Python and TypeScript extensions  
**API Testing:** Postman or Insomnia  
**Database Client:** DBeaver or pgAdmin  
**Git Strategy:** Git Flow with protected branches  
**Code Review:** Pull request required with 1+ approvals  
**Documentation:** Sphinx (Python) and TypeDoc (TypeScript)  
**Architecture Docs:** ADRs in docs/architecture/decisions  
**Jupyter Notebooks:** For data exploration and analysis  

## Backup & Disaster Recovery

**Database Backup:** Daily automated with 30-day retention  
**Backup Location:** Cross-region replication  
**RPO:** 24 hours for standard, 1 hour for critical  
**RTO:** 4 hours for full restoration  
**Disaster Recovery:** Documented runbooks with annual testing  
**Data Export:** Monthly automated exports to cold storage  

## Communication & Collaboration

**Code Repository:** GitHub or GitLab  
**Issue Tracking:** GitHub Issues or Linear  
**Documentation:** Confluence or Notion  
**Team Communication:** Slack with GitHub/monitoring integrations  
**Video Conferencing:** Google Meet or Zoom  

## Application-Specific Additions

### Trading Tools
**Real-time Data:** WebSocket connections with automatic reconnection  
**Market Data Storage:** TimescaleDB with 1-minute candle aggregation  
**Technical Indicators:** TA-Lib with pandas integration  
**Backtesting Framework:** Backtrader or custom with pandas/numpy  
**Order Execution:** Rate-limited with circuit breakers  
**Data Processing:** NumPy for calculations, Pandas for OHLCV data  
**Performance:** Vectorized operations with NumPy for speed  

### AI Agents
**Context Storage:** pgvector with 1536-dimension embeddings  
**Embedding Processing:** NumPy arrays for vector operations  
**Conversation History:** PostgreSQL with 90-day retention  
**Rate Limiting:** Token-based quotas per user/API key  
**Model Selection:** Dynamic based on task complexity  
**Data Preprocessing:** Pandas for structured data, NumPy for embeddings  

### Workflow Automation
**Workflow Engine:** Temporal or Prefect  
**Webhook Processing:** Async with retry logic  
**Schedule Management:** Cron with distributed locking  
**Event Sourcing:** PostgreSQL with event replay capability  
**Data Transformation:** Pandas for batch processing  
**Analytics:** NumPy/Pandas for workflow metrics and reporting  

### Productivity Tools
**Offline Support:** Service Workers with IndexedDB  
**Sync Strategy:** Conflict-free replicated data types (CRDTs)  
**PWA Configuration:** Installable with push notifications  
**Performance Target:** <3s initial load, <1s subsequent  
**Data Export:** Pandas for CSV/Excel generation  
**Analytics:** NumPy for usage statistics calculations
