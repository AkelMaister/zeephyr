FROM node:8-alpine

COPY . /var/www

WORKDIR /var/www

RUN apk add git \
    && npm install

CMD ["npm start"]
