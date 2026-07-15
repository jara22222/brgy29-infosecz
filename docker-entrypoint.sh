#!/bin/bash
set -e

echo "Starting deployment setup..."

# Clear caches
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Cache configuration for production
php artisan config:cache
php artisan event:cache
php artisan route:cache
php artisan view:cache

# Run database migrations if DB is configured
if [ ! -z "$DB_HOST" ] && [ "$DB_CONNECTION" != "sqlite" ]; then
    echo "Running database migrations..."
    php artisan migrate --force
elif [ "$DB_CONNECTION" == "sqlite" ]; then
    echo "Using SQLite, making sure database file exists..."
    touch database/database.sqlite
    php artisan migrate --force
fi

# Create storage link if it doesn't exist
if [ ! -L public/storage ]; then
    echo "Creating storage link..."
    php artisan storage:link || true
fi

echo "Setup complete. Starting Apache..."

# Execute the container's main process (apache2-foreground)
exec "$@"
