import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/shared/lib/baseQueryWithReauth";
import { DocumentType, DocList, CreateDocumentType } from "../model";

// Тип для параметров фильтрации и поиска
export type DocumentFilters = {
  search?: string;
  category_id?: number | null;
  signed?: boolean | string | null;
  date_start?: string | null;
  date_end?: string | null;
  sortBy?: "name" | "date_start" | "date_end";
  sortOrder?: "ASC" | "DESC";
};

// Создаем API slice с помощью RTK Query
export const docApi = createApi({
  reducerPath: "docApi", // уникальный ключ в state для хранения данных API
  baseQuery: baseQueryWithReauth, // базовый запрос с обработкой авторизации/reauth
  tagTypes: ["Document"], // типы тегов для кеширования и инвалидации
  endpoints: (build) => ({
    // Получение списка документов с фильтрацией
    getDocuments: build.query<DocList, DocumentFilters | void>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        
        if (filters.search) params.append("search", filters.search);
        if (filters.category_id) params.append("category_id", String(filters.category_id));
        if (filters.signed !== null && filters.signed !== undefined && filters.signed !== "") {
          params.append("signed", String(filters.signed));
        }
        if (filters.date_start) params.append("date_start", filters.date_start);
        if (filters.date_end) params.append("date_end", filters.date_end);
        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

        const queryString = params.toString();
        return {
          url: `/docs${queryString ? `?${queryString}` : ""}`, // GET /docs?search=...&category_id=...
        };
      },
      // Трансформация ответа сервера в удобный формат
      transformResponse: (response: { message: string; docs: DocList }) =>
        response.docs,
      // Привязка к тегу для автоматического обновления кеша
      providesTags: ["Document"],
    }),

    // Получение одного документа по id
    getDocument: build.query<DocumentType, number>({
      query: (id) => ({
        url: `/docs/${id}`, // GET /docs/:id
      }),
      transformResponse: (response: { message: string; Doc: DocumentType }) =>
        response.Doc,
      providesTags: ["Document"],
    }),

    // Создание документа
    createDocument: build.mutation<
      DocumentType,
      { document: CreateDocumentType }
    >({
      query: ({ document }) => ({
        url: "/docs", // POST /docs
        method: "POST",
        body: document, // тело запроса — данные нового документа
      }),
      transformResponse: (response: { message: string; doc: DocumentType }) =>
        response.doc,
      invalidatesTags: ["Document"], // после создания инвалидируем кеш
    }),

    // Обновление документа
    updateDocument: build.mutation<DocumentType, DocumentType>({
      query: (document) => ({
        url: `/docs/${document.id}`, // PUT /docs/:id
        method: "PUT",
        body: document, // тело запроса — обновленный документ
      }),
      transformResponse: (response: { message: string; Doc: DocumentType }) =>
        response.Doc,
      invalidatesTags: ["Document"], // сброс кеша после изменения
    }),

    // Удаление документа
    deleteDocument: build.mutation<void, number>({
      query: (id) => ({
        url: `/docs/${id}`, // DELETE /docs/:id
        method: "DELETE",
      }),
      invalidatesTags: ["Document"], // сброс кеша после удаления
    }),
  }),
});

// Автоматически сгенерированные хуки для использования в компонентах
export const {
  useGetDocumentsQuery, // хук для получения списка документов
  useGetDocumentQuery, // хук для получения одного документа
  useCreateDocumentMutation, // хук для создания документа
  useUpdateDocumentMutation, // хук для обновления документа
  useDeleteDocumentMutation, // хук для удаления документа
} = docApi;
