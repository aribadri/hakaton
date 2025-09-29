yarn
yarn dev

Для лоакального запуска нужны файлы сертификата localhost-key.pem и localhost.pem

Команда в терминале для создания сертфикиата:

openssl genrsa -out localhost-key.pem 2048
openssl req -new -x509 -key localhost-key.pem -out localhost.pem -days 365

Положить в папку "certs"

