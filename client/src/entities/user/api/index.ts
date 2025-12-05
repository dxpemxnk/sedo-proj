import { axiosInstance, setAccessToken } from "@/shared/lib/axiosInstance";
import { UserWithoutPasswordType } from "../model";

enum API_ROUTES {
  REG_PATH = "/auth/reg",
  AUTH_PATH = "/auth/log",
  LOGOUT_PATH = "/auth/logout",
  REFRESH_PATH = "/auth/refresh",
}

export class UserService {
  static async registration(
    name: string,
    email: string,
    password: string,
    role: string,
    phone: string
  ): Promise<{ accessToken: string; user: UserWithoutPasswordType }> {
    const response = await axiosInstance.post(API_ROUTES.REG_PATH, {
      name,
      email,
      password,
      role,
      phone,
    });

    setAccessToken(response.data.accessToken);
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  }

  static async authorization(
    email: string,
    password: string
  ): Promise<{ accessToken: string; user: UserWithoutPasswordType }> {
    const response = await axiosInstance.post(API_ROUTES.AUTH_PATH, {
      email,
      password,
    });

    setAccessToken(response.data.accessToken);
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  }

  static async logout(): Promise<void> {
    try {
      await axiosInstance.delete(API_ROUTES.LOGOUT_PATH);
      setAccessToken("");
      localStorage.removeItem("accessToken");
    } catch (error) {
      console.log(error);
    }
  }

  static async refreshAccessToken(): Promise<{
    accessToken: string;
    user: UserWithoutPasswordType;
  }> {
    const response = await axiosInstance.get(API_ROUTES.REFRESH_PATH);
    setAccessToken(response.data.accessToken);
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  }
}
