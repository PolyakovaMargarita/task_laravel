## About project
Test project: basic user registration / authorization and private messaging with WebSockets.
Stack:
- Laravel 12
- PHP 8.3
- MySQL 8 (in Docker)
- Redis (broadcasting)
- Laravel Reverb (WebSockets)

## How to run

1. Copy environment file:

```bash
cp .env.example .env
```

2. Build and start Docker containers:

```bash
docker compose up -d --build
```

3. Generate application key:

```bash
docker compose exec app php artisan key:generate
```

4. Run database migrations:

```bash
docker compose exec app php artisan migrate --force
```

5. Open application in browser:

- Backend: `http://localhost:8000`
