FROM node:18.17-alpine3.17

RUN apk add git

WORKDIR /app

RUN corepack enable

COPY . .

RUN pnpm i --ignore-scripts

RUN npm run build

ENV HOST=0.0.0.0

ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/server/entry.mjs"]
