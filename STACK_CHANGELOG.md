### Обзор

Этот документ описывает эволюцию стека и ключевые изменения в приложении (frontend + backend) по датам, с акцентом на технологии, структуру и миграции БД.

---

### Текущий стек (состояние на сейчас)

- **Frontend**: React 18 + TypeScript, Vite 5, Redux Toolkit 2 (RTK), React Router v6, Material UI v7 (Emotion), Formik + Yup, Date-fns, React Dropzone, FileSaver
  - Сборка: Vite (`@vitejs/plugin-react-swc`), алиасы через `vite.config.ts`
  - Состояние: `@reduxjs/toolkit`, `react-redux`
  - UI: `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
  - Формы/валидация: `formik`, `yup`
  - Даты/утилиты/файлы: `date-fns`, `react-dropzone`, `file-saver`
  - Сетевой слой: `axios` (+ `shared/lib/axiosInstance.ts`), есть основа для реавторизации `shared/lib/baseQueryWithReauth.ts`
- **Backend**: Node.js + Express 4, Sequelize 6 (PostgreSQL), JWT аутентификация, bcrypt, dotenv, CORS, cookie-parser, morgan
  - ORM/БД: `sequelize`, `pg`, `pg-hstore`, миграции/сидеры через `sequelize-cli`
  - Авторизация: `jsonwebtoken`, middleware `middleware/varifyAccessToken.js`, `middleware/verifyRefreshToken.js`, генерация токенов `utils/generateTokens.js`
  - Структура: контроллеры (`controllers`), сервисы (`services`), роуты (`routes`)

---

### Структура проекта (высокоуровнево)

- `client/`
  - `src/app` — `App`, `Router` (роутинг, layout), `store`
  - `src/entities` — доменные сущности (например, `DocumentForm`, `user`) c `api`, `model`, `ui`
  - `src/features` — фичи (`Auth/AuthorizationForm`, `RegistrationForm`)
  - `src/pages` — страничные модули (`AuthPage`, `RegPage`, `DocPage`, `CrePage`, `NotFound`)
  - `src/widgets` — композиция UI (`DocForm`, `DocList`, `Nav`)
  - `src/shared` — общие хуки, `axiosInstance`, `baseQueryWithReauth`
- `server/`
  - `app.js`, `config/` (настройки сервера и JWT)
  - `routes/` (группы: `api.auth.routes.js`, `api.cat.routes.js`, `api.doc.routes.js`, `index.routes.js`)
  - `controllers/`, `services/` — разделение бизнес-логики и транспорта
  - `middleware/` — проверка токенов
  - `db/` — `models/`, `migrations/`, `seeders/`

---

### Хронология ключевых изменений

- 2024‑11‑21 — Инициализация доменной модели и данных (Sequelize)
  - Миграции: `create-user`, `create-category`, `create-doc` (`server/db/migrations/20241121...`)
  - Сидеры: `userSeed`, `categorySeed`, `docSeed` (`server/db/seeders/20241121...`)
  - На этом этапе сформированы основные таблицы пользователя, категорий и документов, настроены базовые связи.
- 2024‑11‑21 — Базовая серверная архитектура
  - Запуск `Express` (`server/app.js`), конфиг сервера (`config/serverConfig.js`), маршрутизация через `routes/index.routes.js`
  - JWT‑аутентификация: конфиги (`config/jwtConfig.js`), генерация токенов и middleware
- 2024‑11 — 2025‑H1 — Формирование клиентского приложения
  - Старт с шаблона `React + TypeScript + Vite` (см. `client/README.md`)
  - Подключение `Redux Toolkit`, `React Router v6`, `Material UI v7`
  - Формирование слоёв архитектуры FE: `entities` / `features` / `widgets` / `pages` / `shared`
  - Настройка сетевого слоя с `axios`, добавление основы для рефреш‑логики (`baseQueryWithReauth`)
- 2025‑09‑25 — Изменение схемы БД: телефон пользователя из числа в строку
  - Миграция: `20250925120000-alter-user-phone-to-string.js`
  - Причина: хранение телефонов с ведущими нулями, различными форматами, символами `+`, пробелами и т. п.
  - Потенциальные влияния: формы валидации на FE переводятся на строковую валидацию (`yup.string()`), форматирование/маска; на BE — валидация как строки, снятие числовых ограничений.

---

### Эволюция стека (кратко)

- С самого начала бекенд на **Express + Sequelize (PostgreSQL)**, фронтенд на **React + Vite + TypeScript**.
- По мере роста:
  - На FE добавлены: **Redux Toolkit**, **React Router v6**, **MUI v7**, экраны и фичи по слоям FSD‑подобной структуры.
  - На BE усилена аутентификация на JWT (access/refresh), выделены **controllers/services/middleware**.
  - В БД проведены миграции и сидеры; затем точечное изменение типа поля телефона пользователя на строковый.

---

### Текущие точки интеграции FE ↔ BE

- API группы: `auth`, `cat` (категории), `doc` (документы)
- FE использует `axios` и, при необходимости, реавторизацию через `baseQueryWithReauth` (основа в `shared/lib`).
- На BE маршруты сгруппированы в `server/routes/*.routes.js`, бизнес‑логика в `server/services`, авторизация — JWT middleware.

---

### Запуск и сборка

- Frontend:
  - Dev: `npm run dev` (в `client/`)
  - Build: `npm run build` (TS build + Vite)
  - Preview: `npm run preview`
- Backend:
  - Dev: `npm run dev` (в `server/`, через `nodemon app.js`)

---

### Возможные дальнейшие шаги

- FE: довести единую стратегию рефреш‑токенов (интегрировать `baseQueryWithReauth` во все API‑слайсы), валидация телефона как строки с маской, централизованные ошибки.
- BE: добавить rate limiting и CSRF‑защиту при работе с cookie (если используются), унифицировать ответы ошибок, покрыть e2e‑кейсами.
- DX: добавить корневой `README`/архитектурную схему, автоматизировать миграции/сидинг в npm‑скриптах.
