#!/bin/sh
set -e

cd /var/www/html || exit 1

if [ ! -f vendor/autoload.php ]; then
    composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev
fi

exec "$@"
