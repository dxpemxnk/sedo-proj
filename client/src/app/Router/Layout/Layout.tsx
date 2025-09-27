// LAYOUT КОМПОНЕНТ — общая оболочка для страниц (header/nav + контент)
// Здесь происходит фоновая попытка обновить access токен при монтировании

import { useEffect } from "react";
import { Outlet } from "react-router-dom";

// Глобальная навигация приложения (меню, ссылки)
import { Nav } from "../../../widgets";

// Хук-обёртка над useDispatch с типами (AppDispatch)
import { useAppDispatch } from "../../../shared/hooks/rtkUser";

// Thunk для фонового обновления access токена через /auth/refresh
import { refreshAccessToken } from "../../../entities/user/model/userThunk";

export function Layout(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // При первом рендере запрашиваем обновление токена
    // Это позволяет автоматически продлить сессию, если refresh токен валиден
    dispatch(refreshAccessToken());
  }, [dispatch]);

  return (
    <>
      {/* Навигация (шапка/меню) отображается на всех страницах */}
      <Nav />
      {/* Место для рендеринга текущей страницы согласно роутингу */}
      <Outlet />
    </>
  );
}
