# TeamFlow Architecture

## Overview

TeamFlow follows a modular monorepo architecture with a React frontend, Node.js/Express backend, and a PostgreSQL/Prisma data layer planned for production.

## Components

- Frontend: React, TypeScript, Tailwind, Shadcn UI
- Backend: Express, JWT, Socket.IO, Redis, Nodemailer
- Data: PostgreSQL + Prisma
- Observability: logging, metrics, audit trails

## Flow

1. Users authenticate through the frontend.
2. The backend verifies JWTs and returns role-aware data.
3. Project, task, and RCA resources are persisted in PostgreSQL.
4. Notifications are emitted via Socket.IO and email queues.
