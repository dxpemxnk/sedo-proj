# SEDO Project

Full-stack приложение с React + TypeScript фронтендом и Node.js + Express + PostgreSQL бэкендом.

## Требования

- Node.js (v18+)
- npm или yarn
- PostgreSQL 15+ (или Docker для запуска через docker-compose)

## Быстрый старт

### 1. Установка зависимостей

```bash
# Установка зависимостей для клиента
cd client
npm install

# Установка зависимостей для сервера
cd ../server
npm install
```

### 2. Настройка базы данных

#### Вариант A: Использование Docker (рекомендуется)

Убедитесь, что у вас установлен Docker Desktop для Windows.

```bash
# Из корневой директории проекта
docker-compose up -d
```

Это запустит PostgreSQL в контейнере с настройками:
- Пользователь: `postgres`
- Пароль: `123`
- База данных: `db-sedo`
- Порт: `5432`

#### Вариант B: Локальная установка PostgreSQL

1. Установите PostgreSQL с официального сайта: https://www.postgresql.org/download/windows/
2. Создайте базу данных:
   ```sql
   CREATE DATABASE "db-sedo";
   CREATE USER postgres WITH PASSWORD '123';
   GRANT ALL PRIVILEGES ON DATABASE "db-sedo" TO postgres;
   ```

### 3. Настройка переменных окружения

#### Клиент (client/.env)

Создайте файл `client/.env`:
```
VITE_API=http://localhost:3000/api
```

#### Сервер (server/.env)

Создайте файл `server/.env` (опционально, если нужно переопределить настройки):
```
NODE_ENV=development
```

### 4. Запуск миграций и сидеров

```bash
cd server

# Запуск миграций
npx sequelize-cli db:migrate

# Запуск сидеров (заполнение тестовыми данными)
npx sequelize-cli db:seed:all
```

### 5. Запуск приложения

Откройте два терминала:

**Терминал 1 - Backend:**
```bash
cd server
npm run dev
```

**Терминал 2 - Frontend:**
```bash
cd client
npm run dev
```

Приложение будет доступно:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API: http://localhost:3000/api

## Структура проекта

- `client/` - React + TypeScript фронтенд
- `server/` - Node.js + Express бэкенд
- `docker-compose.yml` - Конфигурация PostgreSQL в Docker

## Решение проблем

### Ошибка подключения к PostgreSQL

Если видите ошибку `SequelizeConnectionRefusedError: connect ECONNREFUSED 127.0.0.1:5432`:

1. **Проверьте, запущен ли PostgreSQL:**
   ```bash
   # Для Docker
   docker ps
   
   # Для локального PostgreSQL (Windows)
   Get-Service -Name "*postgresql*"
   ```

2. **Если используете Docker, запустите контейнер:**
   ```bash
   docker-compose up -d
   ```

3. **Проверьте настройки подключения в `server/db/config/database.json`**

### Ошибка 404 на API запросах

Убедитесь, что файл `client/.env` создан и содержит:
```
VITE_API=http://localhost:3000/api
```

После создания/изменения `.env` файла **перезапустите dev-сервер Vite**.

## Дополнительная информация

Подробности о стеке и архитектуре см. в `STACK_CHANGELOG.md`.


