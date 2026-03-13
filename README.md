## About project

Test project: basic user registration / authorization and private messaging with WebSockets.
Stack:

- Laravel 12
- PHP 8.3
- MySQL 8 (in Docker)
- Redis (broadcasting)
- Laravel Reverb (WebSockets)

## How to run

Клонируйте репозиторий (папка `vendor` не нужна — зависимости ставятся внутри Docker).

1. Скопируйте файл окружения:

```bash
cp .env.example .env
```

2. Соберите и запустите контейнеры (при первом запуске `composer install` выполнится автоматически в контейнере):

```bash
docker compose up -d --build
```

3. Сгенерируйте ключ приложения:

```bash
docker compose exec app php artisan key:generate
```

4. Выполните миграции БД (дождитесь готовности MySQL):

```bash
docker compose exec app php artisan migrate --force
```

5. Откройте в браузере:

- Backend: `http://localhost:8000`

**Если появляется ошибка** `vendor/autoload.php: No such file or directory`:

- Пересоберите образы без кэша и поднимите контейнеры заново:  
  `docker compose build --no-cache && docker compose up -d`
- При первом запуске подождите 1–2 минуты, пока в контейнере выполнится `composer install`.
- Убедитесь, что в корне проекта есть `composer.json` и `composer.lock` (в репозитории они должны быть).
