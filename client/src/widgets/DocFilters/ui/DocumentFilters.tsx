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

interface DocumentFiltersProps {
  filters: DocumentFilters;
  onFiltersChange: (filters: DocumentFilters) => void;
}

export const DocumentFiltersComponent: React.FC<DocumentFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const { data: categories } = useGetCategoriesQuery();
  const [localFilters, setLocalFilters] = useState<DocumentFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSearchChange = (value: string) => {
    const newFilters = { ...localFilters, search: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCategoryChange = (value: number | "") => {
    const newFilters = {
      ...localFilters,
      category_id: value === "" ? null : value,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSignedChange = (value: string) => {
    const newFilters = {
      ...localFilters,
      signed: value === "" ? null : value === "true",
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateStartChange = (date: Date | null) => {
    const newFilters = {
      ...localFilters,
      date_start: date ? date.toISOString().split("T")[0] : null,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateEndChange = (date: Date | null) => {
    const newFilters = {
      ...localFilters,
      date_end: date ? date.toISOString().split("T")[0] : null,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSortByChange = (value: string) => {
    const newFilters = {
      ...localFilters,
      sortBy: value as "name" | "date_start" | "date_end",
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSortOrderChange = (value: string) => {
    const newFilters = {
      ...localFilters,
      sortOrder: value as "ASC" | "DESC",
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

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
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
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
          {/* Поиск */}
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

          {/* Категория */}
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
                {categories?.map((category: CategoryType) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Статус подписи */}
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

          {/* Дата начала */}
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

          {/* Дата окончания */}
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

          {/* Сортировка */}
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

