# Используем официальный Node.js образ с LTS версией
FROM node:18-alpine

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json (если есть) в контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы приложения в контейнер
COPY . .

# Собираем проект (если необходимо)
RUN npm run build

# Указываем порт, на котором приложение будет слушать
EXPOSE 3000

# Команда для запуска Next.js приложения в production-режиме
CMD ["npm", "run", "start"]