📦 Установка
yarn

🚀 Локальный запуск

yarn dev

Для локального HTTPS нужны сертификаты:

certs/localhost-key.pem
certs/localhost.pem

Создать их можно так:

openssl genrsa -out localhost-key.pem 2048
openssl req -new -x509 -key localhost-key.pem -out localhost.pem -days 365


После генерации положи оба файла в папку certs/ рядом с vite.config.js.

