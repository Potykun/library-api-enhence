# 📚 Library API

> A full-stack book catalog management system built with **Spring Boot 3**, **React 19**, and **PostgreSQL 16**.  
> Supports full CRUD, advanced multi-field search, server-side pagination, and soft deletion.

**Live Demo:** _[https://your-app.onrender.com](https://your-app.onrender.com)_ ← _replace with your Render URL_

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Running Locally](#running-locally)
- [CI Pipeline](#ci-pipeline)
- [Deployment](#deployment)

---

## Project Overview

**Library API** is a full-stack web application for managing a book catalog.  
It exposes a RESTful API (documented via **Swagger UI / OpenAPI 3**) that allows clients to:

- Browse the entire book catalog with **server-side pagination**
- Perform **advanced multi-field search** by title, author, or ID
- **Create**, **update**, and **soft-delete** book records
- Validate input on both the client and server side

The frontend communicates with the backend through a typed Axios client; all server state is managed by **TanStack Query**, which handles caching, background refetching, and optimistic updates.

---

## Tech Stack

### Frontend

| Technology | Version | Role |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5.9 | Static typing |
| Vite | 8 | Build tool / Dev server |
| Vanilla CSS | — | Handmade styling & design system |
| TanStack Query | 5 | Server-state management & caching |
| Axios | 1.x | HTTP client |
| Nginx | Alpine | Static file serving (production) |

### Backend

| Technology | Version | Role |
|---|---|---|
| Java | 17 | Language |
| Spring Boot | 3.5 | Application framework |
| Spring Data JPA | — | ORM / Repository layer |
| Spring Validation | — | Bean Validation (JSR-380) |
| Lombok | — | Boilerplate reduction |
| SpringDoc OpenAPI | 2.8 | Swagger UI & OpenAPI 3 spec |
| Maven | — | Build & dependency management |

### Database & Infrastructure

| Technology | Version | Role |
|---|---|---|
| PostgreSQL | 16 | Primary relational database |
| H2 | — | In-memory DB for unit tests |
| Docker / Compose | 3.9 | Containerized local deployment |

---

## Key Features

- [x] **Full CRUD** — create, read, update, and delete books via REST
- [x] **Advanced Search** — filter by title, author, or exact ID; searches are case-insensitive, substring-based, and combinable
- [x] **Server-Side Pagination** — results are paginated (10 per page) and sorted by `id` by default
- [x] **Soft Delete** — deleted books are flagged (`deleted = true`) and excluded from all queries; the row is never removed from the database
- [x] **Input Validation** — title and author are `@NotBlank`; publication year must be `≥ 1450`, enforced on both client and server
- [x] **OpenAPI / Swagger UI** — interactive API docs auto-generated at `/swagger-ui.html`
- [x] **Dockerized** — three-service `docker-compose.yml` for one-command local setup (db → backend → frontend)
- [x] **Deployed on Render** — backend and frontend services hosted on Render with a managed PostgreSQL instance

### Advanced Search — How It Works

The `GET /api/books` endpoint accepts optional query parameters `?title=` and `?author=`. The service layer branches on which parameters are provided:

| `title` provided | `author` provided | Query executed |
|---|---|---|
| ✅ | ✅ | `findByTitleContainingIgnoreCaseAndAuthorContainingIgnoreCaseAndDeletedFalse` |
| ✅ | ❌ | `findByTitleContainingIgnoreCaseAndDeletedFalse` |
| ❌ | ✅ | `findByAuthorContainingIgnoreCaseAndDeletedFalse` |
| ❌ | ❌ | `findByDeletedFalse` (all active books) |

The frontend also supports **search by ID**: when the user selects the `id` mode, the client calls `GET /api/books/{id}` directly instead of the paginated list endpoint.

### Fetch Flow (TanStack Query)

1. The `useBooks` custom hook manages two `useQuery` instances — one for the paginated list and one for single-book-by-ID lookups.
2. `committed` state is only updated on explicit **Search** button click, preventing unnecessary network requests on every keystroke.
3. After any mutation (create / delete), `queryClient.invalidateQueries` triggers an automatic background refetch of the book list.

### Soft Delete

Deletion calls `DELETE /api/books/{id}`, which sets `book.deleted = true` and saves the record. All repository queries include `AndDeletedFalse` predicates, so soft-deleted books are permanently hidden from the UI without destroying audit data.

---

## Database Schema

The schema is managed by **Hibernate DDL auto** (`spring.jpa.hibernate.ddl-auto=update`), which generates the table from the `Book` entity on first startup.

### Table: `book`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGSERIAL` | `PRIMARY KEY` | Auto-incremented surrogate key |
| `title` | `VARCHAR(255)` | `NOT NULL` | Book title |
| `author` | `VARCHAR(255)` | `NOT NULL` | Author name |
| `publication_year` | `INTEGER` | `CHECK (publication_year >= 1450)` | Year of publication |
| `deleted` | `BOOLEAN` | `NOT NULL DEFAULT false` | Soft-delete flag |

---

## API Endpoints

Base URL: `/api/books`  
Interactive docs: `GET /swagger-ui.html`

| Method | Endpoint | Description | Status |
|---|---|---|---|
| `GET` | `/api/books` | List all active books (paginated, filterable) | `200 OK` |
| `GET` | `/api/books/{id}` | Get a single book by ID | `200 OK` |
| `POST` | `/api/books` | Create a new book | `201 Created` |
| `PUT` | `/api/books/{id}` | Update an existing book | `200 OK` |
| `DELETE` | `/api/books/{id}` | Soft-delete a book | `204 No Content` |

### `GET /api/books` — Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | No | Case-insensitive substring match on title |
| `author` | `string` | No | Case-insensitive substring match on author |
| `page` | `integer` | No | Zero-based page number (default: `0`) |
| `size` | `integer` | No | Page size (default: `10`) |
| `sort` | `string` | No | Sort field and direction (default: `id,asc`) |

### Request / Response Examples

<details>
<summary><strong>POST /api/books</strong> — Create a book</summary>

**Request body:**
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "publicationYear": 2008
}
```

**Response `201 Created`:**
```json
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "publicationYear": 2008
}
```
</details>

<details>
<summary><strong>GET /api/books?title=clean&page=0</strong> — Search by title</summary>

**Response `200 OK`:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "publicationYear": 2008
    }
  ],
  "totalPages": 1,
  "totalElements": 1,
  "number": 0,
  "size": 10
}
```
</details>

<details>
<summary><strong>DELETE /api/books/1</strong> — Soft-delete a book</summary>

**Response:** `204 No Content`  
_The record remains in the database with `deleted = true`._
</details>

<details>
<summary><strong>Validation error — 400 Bad Request</strong></summary>

```json
{
  "title": "Title is mandatory",
  "publicationYear": "must be greater than or equal to 1450"
}
```
</details>

---

## Project Structure

```
project_02/
├── docker-compose.yml          # Three-service local stack
├── frontend/                   # React 19 + Vite + TypeScript
│   ├── src/
│   │   ├── api/books.ts        # Axios API client
│   │   ├── hooks/useBooks.ts   # TanStack Query hooks
│   │   ├── components/         # SearchBar, BooksTable
│   │   ├── types/              # Shared TypeScript types
│   │   └── App.tsx             # Root page component
│   ├── nginx.conf              # Production reverse proxy config
│   └── Dockerfile
└── library-api/                # Spring Boot 3 backend
    └── src/main/java/com/example/library_api/
        ├── controller/         # BookController (REST layer)
        ├── service/            # BookService (business logic)
        ├── repository/         # BookRepository (JPA queries)
        ├── model/              # Book entity
        ├── dto/                # BookRequestDto, BookResponseDto
        └── exception/          # GlobalExceptionHandler
```

---

## Running Locally

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose

### One-Command Start

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:80 |
| Backend API | http://localhost:8080/api/books |
| Swagger UI | http://localhost:8080/swagger-ui.html |

> The `db` service includes a health check; the backend waits until PostgreSQL is ready before starting.

### Running Without Docker

1. **Start PostgreSQL** locally and create a database named `library`.
2. **Configure** `library-api/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/library
   spring.datasource.username=<your-user>
   spring.datasource.password=<your-password>
   spring.jpa.hibernate.ddl-auto=update
   ```
3. **Start backend:**
   ```bash
   cd library-api && ./mvnw spring-boot:run
   ```
4. **Start frontend:**
   ```bash
   cd frontend && npm install && npm run dev
   ```

---

## CI Pipeline

Automated CI is configured with **GitHub Actions** — [`ci.yml`](.github/workflows/ci.yml).

### Triggers

| Event | Branches |
|---|---|
| `push` | `main`, `develop` |
| `pull_request` | `main` |

### Job: `test`

Runs on `ubuntu-latest` and executes the following steps in order:

| # | Step | Detail |
|---|---|---|
| 1 | **Checkout** | `actions/checkout@v4` |
| 2 | **Set up JDK 17** | Temurin distribution, Maven dependency cache enabled |
| 3 | **Wait for Postgres** | `sleep 20` — ensures the service container is accepting connections |
| 4 | **Run tests** | `./mvnw -B test` against a real PostgreSQL 16 service container |
| 5 | **Build JAR** | `./mvnw package -DskipTests` — produces the production artifact |

### PostgreSQL Service Container

A real `postgres:16-alpine` instance is spun up for the test job:

| Config | Value |
|---|---|
| Database | `library-db` |
| User | `user` |
| Port | `5432` |
| Health check | `pg_isready` (interval 10 s, timeout 5 s, 5 retries) |

---

## Deployment

The project is deployed on **[Render](https://render.com)**:

| Component | Render Service Type |
|---|---|
| Backend (Spring Boot JAR) | Web Service (Docker) |
| Frontend (Nginx + React build) | Web Service (Docker) |
| Database | Managed PostgreSQL |

**Live URL:** _[https://your-app.onrender.com](https://your-app.onrender.com)_ ← _replace with your Render URL_

> **Note:** On the free Render tier, the backend web service spins down after 15 minutes of inactivity. The first request after sleep may take ~30 seconds to respond.

---

## License

MIT
