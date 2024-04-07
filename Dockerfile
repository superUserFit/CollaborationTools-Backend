FROM node:20.7 as build

WORKDIR /app
COPY package*.json .
RUN pnpm i
COPY . .
RUN pnpm run build

FROM node:20.7
WORKDIR /app
COPY package.json .
RUN pnpm i --only=production
COPY --from=build /app/dist ./dist
CMD pnpm run start:prod