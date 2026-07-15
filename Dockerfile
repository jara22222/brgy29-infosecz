# Stage 1: Build PHP and Node dependencies together
FROM php:8.2-cli AS builder
WORKDIR /app

# Install system dependencies, Node.js (v20), and PHP extensions
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    libpq-dev \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && docker-php-ext-install pdo_mysql pdo_pgsql pcntl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Copy package files first
COPY composer.json composer.lock ./
COPY package*.json ./

# Install PHP dependencies (Foxy will also be happy because Node is installed)
RUN composer install --no-dev --no-scripts --prefer-dist --optimize-autoloader

# Install Node dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Pass ReCAPTCHA Site Key to Vite during build
ENV VITE_RECAPTCHA_SITEKEY="6LfXKVUtAAAAALuINaEkqYXlHfQz_HkJKNcGtjlK"

# Build Vite assets (Wayfinder will now have PHP and the vendor directory to run artisan)
RUN npm run build

# Finalize composer autoloader
RUN composer dump-autoload --optimize


# Stage 2: Final Image
FROM php:8.2-apache
WORKDIR /var/www/html

# Install system dependencies and PHP extensions for the web server
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Copy everything from the builder stage
COPY --from=builder /app ./

# Configure Apache DocumentRoot to public directory
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Set directory permissions for Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Ensure entrypoint is executable and in the right place
RUN chmod +x /var/www/html/docker-entrypoint.sh
RUN cp /var/www/html/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Use the custom entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Start Apache in foreground
CMD ["apache2-foreground"]
