// ОБЁРТКА ВОКРУГ fetchBaseQuery С AUTO-REFRESH ACCESS TOKEN
// Используется в RTK Query для всех запросов, требующих авторизации
// Алгоритм:
// 1) добавляем Authorization заголовок из localStorage
// 2) выполняем запрос
// 3) при 403 — пробуем обновить токен через /auth/refresh
// 4) если обновление успешно — повторяем оригинальный запрос

import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

// Базовая функция запросов с подготовкой заголовков
const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API,          // базовый URL API из .env
  credentials: 'include',                     // отправляем cookie (нужно для refresh)
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Обёртка, добавляющая логику обновления токена при 403
export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // Выполняем оригинальный запрос
  let result = await rawBaseQuery(args, api, extraOptions);

  // Если получили 403 — пробуем обновить токен
  if (result.error && result.error.status === 403) {
    const refreshResult = await rawBaseQuery({ url: '/auth/refresh', method: 'GET' }, api, extraOptions);
    if (refreshResult.data && (refreshResult.data as any).accessToken) {
      const accessToken = (refreshResult.data as any).accessToken as string;
      localStorage.setItem('accessToken', accessToken); // сохраняем новый токен
      result = await rawBaseQuery(args, api, extraOptions); // повторяем исходный запрос
    }
  }

  return result;
};
