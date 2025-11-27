# Project Cost Report — Cloud-managed vs Serverless vs On‑Prem

Scope
- Audience: technical and product stakeholders for MountainLover platform.
- Base traffic: 1,000 registered users; assume 30% MAU (~300 active users/month); 100 paid transactions/month; storage 100GB; 300 OTP SMS/month.
- Goal: list components required, give monthly cost estimates, compare trade-offs and recommend the best approach.

Assumptions (used for cost arithmetic)
- DB size: 20–50 GB primary.
- Object storage: 100 GB active media.
- Compute: small service fleet able to handle registration spikes up to ~1k concurrent brief bursts.
- Monitoring/Logging retention: 30 days for key metrics, logs aggregated.
- SMS cost: $0.05 per OTP (region dependent).
- Payment fees: 2.5% of processed volume.
- Costs are USD, approximate, and exclude one-time setup or licensing.

---

1) Cloud-managed (managed services + containers)

Components required
- VPC / networking, load balancer (managed LB)
- Managed Postgres (RDS / Cloud SQL) with daily backups
- Managed Redis (ElastiCache / Memorystore)
- Container runtime: managed k8s (EKS/GKE/AKS) or managed containers (Cloud Run / App Service)
- Object storage (S3 / GCS / Blob)
- CDN (Cloudflare or provider CDN)
- Message queue (managed RabbitMQ / PubSub) or managed streaming
- Managed logging & metrics (Cloud logging or third-party like Datadog)
- Secrets manager (Secrets Manager / Key Vault)
- Payment gateway (Stripe / Razorpay) and SMS (Twilio / MessageBird)
- CI/CD (GitHub Actions) + IaC (Terraform)

Monthly cost breakdown (estimates)
- Managed Postgres (single AZ, small): $75
- Managed Redis (small): $30
- Compute (2 small nodes or managed containers): $100
- Object storage (100 GB): $5
- Message queue managed: $30
- CDN: $5
- Logging & monitoring (managed/basic): $50
- SMS (300 @ $0.05): $15
- Payment fees (2.5% of $5,000): $125
- Misc (backups, snapshots, small services): $20

Estimated monthly total (Cloud-managed): $455
Estimated monthly total (Cloud-managed): ₹37,993 (1 USD = ₹83.5)

Pros
- Fast to deploy, low ops overhead.
- Managed HA options available.
- Good scalability and durability.

Cons
- Higher unit cost vs self-managed.
- Some vendor lock-in and egress charges.
