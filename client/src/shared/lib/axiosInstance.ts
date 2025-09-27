// AXIOS ИНСТАНС С AUTO-REFRESH ЛОГИКОЙ ДЛЯ ACCESS TOKEN
// Отвечает за:
// - базовую настройку axios (baseURL, credentials)
// - добавление Authorization заголовка к каждому запросу
// - перехват 403 ошибок и автоматическое обновление access токена через /auth/refresh

import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Расширяем тип конфигурации запроса, чтобы помечать повторную отправку (sent)
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  sent?: boolean;
}

// Создаём единый экземпляр axios с базовыми настройками
export const axiosInstance: AxiosInstance = axios.create({
  // Базовый URL читаем из переменной окружения VITE_API
  baseURL: `${import.meta.env.VITE_API}`,
  // Разрешаем отправку и получение cookie (нужно для refresh токенов)
  withCredentials: true,
});

// В ПАМЯТИ ХРАНИМ ТЕКУЩИЙ access токен
let accessToken: string = "";

// Функция для установки/обновления access токена извне
export function setAccessToken(token: string): void {
  accessToken = token;
}

// REQUEST INTERCEPTOR — добавляет Authorization заголовок если он ещё не проставлен
axiosInstance.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig): ExtendedAxiosRequestConfig => {
    if (config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  }
);

// RESPONSE INTERCEPTOR — перехватывает 403 и пытается обновить токен, затем повторяет запрос
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError) => {
    // Сохраняем исходный запрос, чтобы повторить его после обновления токена
    const prevRequest: ExtendedAxiosRequestConfig | undefined = error.config;

    if (error.response?.status === 403 && prevRequest && !prevRequest.sent) {
      try {
        // Запрашиваем новый access токен по эндпойнту refresh
        const response = await axiosInstance.get("/auth/refresh");

        // Сохраняем новый токен в памяти
        accessToken = response.data.accessToken;

        // Помечаем, что этот запрос уже повторяли (чтобы не уйти в бесконечный цикл)
        prevRequest.sent = true;

        if (prevRequest.headers) {
          prevRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Повторяем исходный запрос уже с новым токеном
        return axiosInstance(prevRequest);
      } catch (refreshError) {
        // Если не удалось обновить — пробрасываем ошибку дальше
        return Promise.reject(refreshError);
      }
    }

    // Для всех остальных ошибок просто пробрасываем дальше
    return Promise.reject(error);
  }
);
