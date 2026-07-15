# Stage 1: Build frontend assets
FROM node:20-alpine AS frontend
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files needed for build
COPY resources/ ./resources/
COPY public/ ./public/
COPY vite.config.ts tsconfig.json components.json ./ 
# Since Tailwind 4 uses vite plugin, the config might just be in vite.config.ts or css, 
# but copying all necessary root files is safe.
# Actually, just copy everything to be safe since Vite might look at various files.
COPY . .

# Build assets
ENV VITE_SKIP_WAYFINDER_GENERATE=1
RUN npm run build


# Stage 2: Build PHP dependencies
FROM composer:2.7 AS backend
WORKDIR /app

COPY composer.json composer.lock ./
# Install dependencies without dev packages and scripts
RUN composer install --no-dev --no-scripts --prefer-dist --optimize-autoloader

COPY . .
# Run dump-autoload
RUN composer dump-autoload --optimize


# Stage 3: Final Image
FROM php:8.2-apache
WORKDIR /var/www/html

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    # Needed for PostgreSQL (Supabase)
    && docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Copy built frontend assets
COPY --from=frontend /app/public/build ./public/build
# Copy PHP dependencies
COPY --from=backend /app/vendor ./vendor
# Copy the rest of the application
COPY . .

# Configure Apache DocumentRoot to public directory
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Set directory permissions for Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Copy the entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Use the custom entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Start Apache in foreground
CMD ["apache2-foreground"]
