FROM php:8.3-fpm

RUN apt-get update && apt-get install -y libpng-dev libonig-dev libxml2-dev zip unzip

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

WORKDIR /var/www

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

COPY . /var/www

RUN chown -R www-data:www-data /var/www \
 && chmod -R 775 /var/www

ENV COMPOSER_ALLOW_SUPERUSER=1

EXPOSE 9001
ENTRYPOINT ["php-fpm"]
