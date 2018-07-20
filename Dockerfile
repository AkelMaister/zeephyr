FROM node:8-alpine

COPY . /var/www

WORKDIR /var/www

RUN apk add --update git \
    python \
    make \
    g++ \
    libcap \
    && npm install \
    && setcap cap_net_raw+ep $(which node)

RUN apk del git make g++

RUN chmod -R +x node_modules/

CMD ["npm", "start"]
