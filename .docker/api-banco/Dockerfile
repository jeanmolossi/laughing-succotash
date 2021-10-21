FROM node:14.16.1-alpine

WORKDIR /api

USER node

COPY . .

RUN yarn

CMD [ "yarn", "start" ]