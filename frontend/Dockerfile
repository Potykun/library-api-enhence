FROM node:20-alpine AS build
WORKDIR /app

# Сначала зависимости (кеш)
COPY package.json package-lock.json ./
RUN npm ci --silent

# Затем исходники
COPY . .
RUN npm run build

FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Удаляем дефолтный конфиг nginx
RUN rm -rf ./*

# Копируем собранный React
COPY --from=build /app/dist .

# Копируем наш nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]