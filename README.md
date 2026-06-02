There is no AI code written in this project except this file.

# NestJS Jira

A Jira-like project management REST API built with NestJS and PostgreSQL. Supports multi-tenant workspaces, projects, tasks, and role-based access control.

## Tech Stack

- **Framework:** NestJS 11
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT (access + refresh tokens) stored in HTTP-only cookies
- **Validation:** class-validator + class-transformer

## Data Model

```
Workspace
  └── Project (many per workspace)
        └── Task (many per project)

User
  ├── WorkspaceUsers (role: MEMBER | ADMIN)
  └── ProjectMembers (role: MEMBER | ADMIN)
```

**Task status:** `TODO` → `IN_PROGRESS` → `DONE`

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL

### Setup

```bash
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/nestjs_jira
jwtAccessKey=your_access_token_secret
jwtRefreshKey=your_refresh_token_secret
PORT=3000
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the server:

```bash
npm run start:dev
```

## API Reference

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/signup` | — | Register |
| POST | `/auth/signin` | — | Login |
| POST | `/auth/refresh` | Refresh token | Refresh access token |
| GET | `/auth/me` | ✓ | Get current user |
| PATCH | `/auth/password` | ✓ | Update password |

### Workspaces

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/workspace` | ✓ | Create workspace |
| GET | `/workspace` | Admin only | Get all workspaces |
| GET | `/workspace/my` | ✓ | Get my workspaces |
| GET | `/workspace/:id` | Member | Get workspace |
| PATCH | `/workspace/:id` | WS Admin | Update workspace |
| DELETE | `/workspace/:id` | WS Admin | Delete workspace |
| GET | `/workspace/:id/members` | WS Admin | List members |
| POST | `/workspace/:id/members` | WS Admin | Add member |
| DELETE | `/workspace/:id/members` | WS Admin | Remove member |
| PATCH | `/workspace/:id/members/role` | WS Admin | Update member role |
| DELETE | `/workspace/:id/my` | Member | Exit workspace |

### Projects

Base path: `/workspace/:workspaceId/project`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | WS Admin | Create project |
| GET | `/` | WS Admin | List projects |
| GET | `/my` | ✓ | Get my projects |
| GET | `/:projectId` | Member | Get project |
| PATCH | `/:projectId` | Project Admin | Update project |
| DELETE | `/:projectId` | WS Admin | Delete project |
| GET | `/:projectId/members` | Member | List members |
| POST | `/:projectId/members` | Project Admin | Add member |
| PATCH | `/:projectId/members` | Project Admin | Update member role |
| DELETE | `/:projectId/members` | Project Admin | Remove member |
| DELETE | `/:projectId/my` | Member | Exit project |

### Tasks

Base path: `/workspace/:workspaceId/project/:projectId/task`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Member | Create task |
| GET | `/` | Member | List tasks (paginated) |
| GET | `/my` | Member | Get my assigned tasks |
| GET | `/:taskId` | Member | Get task |
| PATCH | `/:taskId` | Member | Update task |
| DELETE | `/:taskId` | Project Admin | Delete task |

## Authentication

Tokens are returned as HTTP-only cookies on signin. Access tokens expire in 15 minutes, refresh tokens in 7 days.

## Roles

| Role | Scope | Permissions |
|------|-------|-------------|
| `ADMIN` | System | Full access to everything |
| `ADMIN` | Workspace | Manage workspace, projects, and members |
| `MEMBER` | Workspace | View workspace and join projects |
| `ADMIN` | Project | Manage project, members, and delete tasks |
| `MEMBER` | Project | Create, view, and update tasks |
