FROM node:20.17.0-alpine AS base

WORKDIR /app

COPY package.json ./

RUN npm install --force

COPY . .

RUN npm run graphql-codegen --config graphql.config.ts

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
