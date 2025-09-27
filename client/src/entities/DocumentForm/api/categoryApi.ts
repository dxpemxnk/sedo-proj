import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CategoryList } from "../model/catTypes";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryList, void>({
      query: () => "/cat",
      transformResponse: (response: {
        message: string;
        categories: CategoryList;
      }) => response.categories,
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
