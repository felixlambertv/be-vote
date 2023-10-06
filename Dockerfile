FROM node:18-alpine

WORKDIR /src

COPY package*.json .
COPY yarn.lock .

RUN yarn install

COPY . .

CMD ["yarn", "build"]
CMD ["yarn", "seed:user"]
CMD ["yarn", "start"]
