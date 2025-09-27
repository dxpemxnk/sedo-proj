// ГЛОБАЛЬНОЕ ХРАНИЛИЩЕ СОСТОЯНИЯ (Redux Store)
// Этот файл настраивает центральное хранилище состояния приложения с помощью Redux Toolkit

// Импорт редьюсера для управления состоянием пользователя (логин, профиль, токены)
import userReducer from "@/entities/user/model/userSlice";

// Импорт функции для создания и настройки Redux store из Redux Toolkit
// configureStore автоматически настраивает DevTools, middleware и другие полезные возможности
import { configureStore } from "@reduxjs/toolkit";

// Импорт функции для автоматической настройки слушателей RTK Query
// Обеспечивает автоматическое обновление кеша при фокусе окна, переподключении и т.д.
import { setupListeners } from "@reduxjs/toolkit/query";

// Импорт API слайса для работы с документами (CRUD операции через RTK Query)
import { docApi } from "@/entities/DocumentForm/api/DocApi";

// Импорт API слайса для работы с категориями документов
import { categoryApi } from "@/entities/DocumentForm/api/categoryApi";

// СОЗДАНИЕ И НАСТРОЙКА REDUX STORE
const store = configureStore({
  // РЕДЬЮСЕРЫ - функции, которые управляют различными частями состояния
  reducer: {
    // Управление состоянием пользователя (авторизация, профиль)
    user: userReducer,
    
    // Автоматически созданные редьюсеры для RTK Query API слайсов
    // [docApi.reducerPath] создаст редьюсер с ключом "docApi" для кеширования документов
    [docApi.reducerPath]: docApi.reducer,
    
    // [categoryApi.reducerPath] создаст редьюсер с ключом "categoryApi" для кеширования категорий
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  
  // MIDDLEWARE - промежуточное ПО для обработки действий
  middleware: (getDefaultMiddleware) =>
    // Получаем стандартные middleware Redux Toolkit и добавляем к ним middleware RTK Query
    // docApi.middleware и categoryApi.middleware обрабатывают HTTP запросы, кеширование, инвалидацию кеша
    getDefaultMiddleware().concat(docApi.middleware, categoryApi.middleware),
});

// НАСТРОЙКА СЛУШАТЕЛЕЙ RTK QUERY
// Автоматически обновляет кеш при:
// - фокусе на окне браузера
// - переподключении к интернету
// - других событиях браузера
setupListeners(store.dispatch);

// ТИПЫ TYPESCRIPT ДЛЯ ТИПОБЕЗОПАСНОСТИ

// Получаем тип корневого состояния - используется в useSelector для автокомплита и проверки типов
export type RootState = ReturnType<typeof store.getState>;

// Получаем тип dispatch функции - используется в useDispatch для типобезопасной отправки действий
export type AppDispatch = typeof store.dispatch;

// ЭКСПОРТ STORE ПО УМОЛЧАНИЮ
// Этот store будет использоваться в Provider компоненте для предоставления состояния всему приложению
export default store;
