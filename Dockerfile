FROM node:22-alpine AS build-env
COPY . /app
WORKDIR /app
RUN npm ci
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build-env /app/out /usr/share/nginx/html
