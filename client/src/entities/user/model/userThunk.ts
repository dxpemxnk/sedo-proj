import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { UserWithoutPasswordType } from "./index";
import { UserService } from "../api";

type RejectValue = {
  message: string;
};

type AuthResponse = {
  accessToken: string;
  user: UserWithoutPasswordType;
};

enum USER_THUNK_TYPES_PREFIX {
  USER_REFRESH_ACCESS_TOKEN = "user/refreshAccessToken",
  USER_AUTHORIZATION = "user/authorization",
  USER_REGISTRATION = "user/registration",
  USER_LOGOUT = "user/logout",
}

export const refreshAccessToken = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: RejectValue }
>(
  USER_THUNK_TYPES_PREFIX.USER_REFRESH_ACCESS_TOKEN,
  async (_, { rejectWithValue }) => {
    try {
      return await UserService.refreshAccessToken();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue({
        message: err.response?.data.message || err.message,
      });
    }
  }
);

export const authorization = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: RejectValue }
>(
  USER_THUNK_TYPES_PREFIX.USER_AUTHORIZATION,
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await UserService.authorization(email, password);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue({
        message: err.response?.data.message || err.message,
      });
    }
  }
);

export const registration = createAsyncThunk<
  AuthResponse,
  {
    name: string;
    email: string;
    password: string;
    role: string;
    phone: number;
  },
  { rejectValue: RejectValue }
>(
  USER_THUNK_TYPES_PREFIX.USER_REGISTRATION,
  async ({ name, email, password, role, phone }, { rejectWithValue }) => {
    try {
      return await UserService.registration(name, email, password, role, phone);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue({
        message: err.response?.data.message || err.message,
      });
    }
  }
);

export const logout = createAsyncThunk<
  void,
  void,
  { rejectValue: RejectValue }
>(USER_THUNK_TYPES_PREFIX.USER_LOGOUT, async (_, { rejectWithValue }) => {
  try {
    await UserService.logout();
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue({
      message: err.response?.data.message || err.message,
    });
  }
});
