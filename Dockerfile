# สเต็ปที่ 1: ใช้ Node เพื่อ Build หน้าเว็บ Frontend (Vite)
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# สเต็ปที่ 2: ใช้ PHP + Apache สำหรับรันแอปพลิเคชันหลังบ้าน
FROM php:8.3-apache

# ติดตั้ง Extensions ที่จำเป็นสำหรับ Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd \
    && a2enmod rewrite

# ติดตั้ง Composer เข้าไปในเครื่อง
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/webapps

# ก๊อบปี้โค้ดทั้งหมดเข้ามาในตู้คอนเทนเนอร์
COPY . .

# ดึงไฟล์ที่ Vite build เสร็จจากสเต็ปแรกมาใส่ในโฟลเดอร์ public/build
COPY --from=frontend-builder /app/public/build ./public/build

# ติดตั้งแพ็กเกจของ PHP (Laravel)
RUN composer install --no-dev --optimize-autoloader

# ตั้งค่าสิทธิ์โฟลเดอร์ให้ Laravel เขียนไฟล์ Log และ Cache ได้
RUN chown -JW www-data:www-data storage bootstrap/cache

# ปรับแต่ง Apache ให้ชี้ไปที่โฟลเดอร์ public ของ Laravel
ENV APACHE_DOCUMENT_ROOT /var/webapps/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

EXPOSE 80

CMD ["apache2-foreground"]
