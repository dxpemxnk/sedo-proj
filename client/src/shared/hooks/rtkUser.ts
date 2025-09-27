// Импортируем типы из нашего собственного хранилища и встроенных хуков Redux
import { AppDispatch, RootState } from "@/app/store/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Создаем пользовательский хук для получения диспетчера с правильным типом
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Создаем пользовательский хук для использования селектора с правильным типом
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;