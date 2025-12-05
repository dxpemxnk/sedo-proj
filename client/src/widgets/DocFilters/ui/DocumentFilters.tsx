import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import { useGetCategoriesQuery } from "@/entities/DocumentForm/api/categoryApi";
import { CategoryType } from "@/entities/DocumentForm/model/catTypes";
import { DocumentFilters } from "@/entities/DocumentForm/api/DocApi";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

/**
 * Пропсы компонента фильтров документов
 */
interface DocumentFiltersProps {
  /** Текущие значения фильтров */
  filters: DocumentFilters;
  /** Callback функция, вызываемая при изменении фильтров */
  onFiltersChange: (filters: DocumentFilters) => void;
}

/**
 * Компонент фильтров и поиска документов
 * 
 * Предоставляет интерфейс для:
 * - Поиска документов по названию и описанию
 * - Фильтрации по категории, статусу подписи и датам
 * - Сортировки документов по различным полям
 * 
 * Все изменения фильтров немедленно передаются родительскому компоненту
 * через callback onFiltersChange для обновления списка документов
 */
export const DocumentFiltersComponent: React.FC<DocumentFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  // Загружаем список категорий для фильтра
  const { data: categories } = useGetCategoriesQuery();
  
  // Локальное состояние фильтров для управления формой
  // Используется для синхронизации с внешним состоянием и предотвращения лишних ре-рендеров
  const [localFilters, setLocalFilters] = useState<DocumentFilters>(filters);

  // Синхронизируем локальное состояние с внешним при изменении пропсов
  // Это необходимо, если фильтры могут быть изменены извне (например, при сбросе)
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  /**
   * Обработчик изменения поискового запроса
   * Обновляет фильтр поиска и немедленно применяет изменения
   */
  const handleSearchChange = (value: string) => {
    const newFilters = { ...localFilters, search: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  /**
   * Обработчик изменения фильтра категории
   * Преобразует пустую строку в null для сброса фильтра
   */
  const handleCategoryChange = (value: number | "") => {
    const newFilters = {
      ...localFilters,
      category_id: value === "" ? null : value,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  /**
   * Обработчик изменения фильтра статуса подписи
   * Преобразует строковое значение "true"/"false" в boolean или null
   */
  const handleSignedChange = (value: string) => {
    const newFilters = {
      ...localFilters,
      signed: value === "" ? null : value === "true",
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  /**
   * Обработчик изменения даты начала
   * Преобразует Date объект в строку формата YYYY-MM-DD для отправки на сервер
   */
  const handleDateStartChange = (date: Date | null) => {
    const newFilters = {
      ...localFilters,
      date_start: date ? date.toISOString().split("T")[0] : null,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  /**
   * Обработчик изменения даты окончания
   * Преобразует Date объект в строку формата YYYY-MM-DD для отправки на сервер
   */
  const handleDateEndChange = (date: Date | null) => {
    const newFilters = {
      ...localFilters,
      date_end: date ? date.toISOString().split("T")[0] : null,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  /**
   * Обработчик изменения поля сортировки
   * Определяет, по какому полю будут сортироваться документы
   */
  const handleSortByChange = (value: string) => {
    const newFilters = {
      ...localFilters,
      sortBy: value as "name" | "date_start" | "date_end",
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  /**
   * Обработчик изменения направления сортировки
   * Определяет порядок сортировки: по возрастанию (ASC) или убыванию (DESC)
   */
  const handleSortOrderChange = (value: string) => {
    const newFilters = {
      ...localFilters,
      sortOrder: value as "ASC" | "DESC",
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  /**
   * Обработчик сброса всех фильтров
   * Возвращает фильтры к значениям по умолчанию:
   * - Пустой поиск
   * - Все категории
   * - Все статусы подписи
   * - Без фильтров по датам
   * - Сортировка по дате начала по убыванию
   */
  const handleClearFilters = () => {
    const clearedFilters: DocumentFilters = {
      search: "",
      category_id: null,
      signed: null,
      date_start: null,
      date_end: null,
      sortBy: "date_start",
      sortOrder: "DESC",
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    // LocalizationProvider обеспечивает локализацию компонентов выбора даты
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      {/* Контейнер для всех фильтров с тенью и отступами */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        {/* Заголовок секции с кнопкой очистки фильтров */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" component="h2">
            Поиск и фильтры
          </Typography>
          <Button
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            variant="outlined"
            size="small"
          >
            Очистить
          </Button>
        </Box>

        {/* Сетка для размещения полей фильтров
            - На мобильных устройствах (xs): одна колонка
            - На планшетах и десктопах (md): 12 колонок для гибкого размещения */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(12, 1fr)",
            },
            gap: 2,
          }}
        >
          {/* Поле поиска: занимает 6 колонок из 12 на десктопе, всю ширину на мобильных */}
          <Box sx={{ gridColumn: { xs: "1", md: "span 6" } }}>
            <TextField
              fullWidth
              label="Поиск по названию или описанию"
              value={localFilters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />,
              }}
              placeholder="Введите текст для поиска..."
            />
          </Box>

          {/* Фильтр по категории: занимает 3 колонки на десктопе */}
          <Box sx={{ gridColumn: { xs: "1", md: "span 3" } }}>
            <FormControl fullWidth>
              <InputLabel id="category-filter-label">Категория</InputLabel>
              <Select
                labelId="category-filter-label"
                value={localFilters.category_id || ""}
                onChange={(e) => handleCategoryChange(e.target.value as number | "")}
                label="Категория"
              >
                <MenuItem value="">Все категории</MenuItem>
                {/* Динамически генерируем пункты меню из загруженных категорий */}
                {categories?.map((category: CategoryType) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Фильтр по статусу подписи: занимает 3 колонки на десктопе */}
          <Box sx={{ gridColumn: { xs: "1", md: "span 3" } }}>
            <FormControl fullWidth>
              <InputLabel id="signed-filter-label">Статус подписи</InputLabel>
              <Select
                labelId="signed-filter-label"
                value={
                  localFilters.signed === null || localFilters.signed === undefined
                    ? ""
                    : String(localFilters.signed)
                }
                onChange={(e) => handleSignedChange(e.target.value)}
                label="Статус подписи"
              >
                <MenuItem value="">Все</MenuItem>
                <MenuItem value="true">Подписан</MenuItem>
                <MenuItem value="false">Не подписан</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Фильтр по дате начала: занимает 4 колонки на десктопе
              Позволяет выбрать минимальную дату начала для фильтрации */}
          <Box sx={{ gridColumn: { xs: "1", md: "span 4" } }}>
            <DatePicker
              label="Дата начала (от)"
              value={
                localFilters.date_start
                  ? new Date(localFilters.date_start)
                  : null
              }
              onChange={handleDateStartChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </Box>

          {/* Фильтр по дате окончания: занимает 4 колонки на десктопе
              Позволяет выбрать максимальную дату окончания для фильтрации */}
          <Box sx={{ gridColumn: { xs: "1", md: "span 4" } }}>
            <DatePicker
              label="Дата окончания (до)"
              value={
                localFilters.date_end ? new Date(localFilters.date_end) : null
              }
              onChange={handleDateEndChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </Box>

          {/* Выбор поля для сортировки: занимает 2 колонки на десктопе */}
          <Box sx={{ gridColumn: { xs: "1", md: "span 2" } }}>
            <FormControl fullWidth>
              <InputLabel id="sort-by-label">Сортировать по</InputLabel>
              <Select
                labelId="sort-by-label"
                value={localFilters.sortBy || "date_start"}
                onChange={(e) => handleSortByChange(e.target.value)}
                label="Сортировать по"
              >
                <MenuItem value="date_start">Дате начала</MenuItem>
                <MenuItem value="date_end">Дате окончания</MenuItem>
                <MenuItem value="name">Названию</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Выбор направления сортировки: занимает 2 колонки на десктопе */}
          <Box sx={{ gridColumn: { xs: "1", md: "span 2" } }}>
            <FormControl fullWidth>
              <InputLabel id="sort-order-label">Порядок</InputLabel>
              <Select
                labelId="sort-order-label"
                value={localFilters.sortOrder || "DESC"}
                onChange={(e) => handleSortOrderChange(e.target.value)}
                label="Порядок"
              >
                <MenuItem value="DESC">По убыванию</MenuItem>
                <MenuItem value="ASC">По возрастанию</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

