import React, { useState } from "react";
import { useFormik } from "formik";
import { useAppSelector } from "@/shared/hooks/rtkUser";
import { useCreateDocumentMutation } from "@/entities/DocumentForm/api/DocApi";
import { useGetCategoriesQuery } from "@/entities/DocumentForm/api/categoryApi";
import { CategoryType } from "@/entities/DocumentForm/model/catTypes";
import { documentValidationSchema } from "@/entities/DocumentForm/model/validationSchema";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Paper,
  Typography,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import DropZone from "react-dropzone";

export const DocumentForm: React.FC = () => {
  const { user } = useAppSelector((state) => state.user);
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();
  const [createDoc, { isLoading: isCreating, error }] =
    useCreateDocumentMutation();
  const [file, setFile] = useState<File | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      category_id: "",
      signed: false,
      date_start: new Date(),
      date_end: new Date(),
    },
    validationSchema: documentValidationSchema,
    onSubmit: async (values) => {
      if (!user) return;

      try {
        await createDoc({
          document: {
            name: values.name,
            description: values.description,
            category_id: Number(values.category_id),
            user_id: user.id,
            signed: values.signed,
            date_start: values.date_start.toISOString().split("T")[0],
            date_end: values.date_end.toISOString().split("T")[0],
          },
        }).unwrap();

        formik.resetForm();
        setFile(null);
      } catch (err) {
        console.error("Failed to create document:", err);
      }
    },
  });

  const handleFileDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };

  if (isLoadingCategories) {
    return <Box sx={{ p: 2 }}>Загрузка категорий...</Box>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Создание документа
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Название"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <TextField
              fullWidth
              id="description"
              name="description"
              label="Описание"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />

            <FormControl
              fullWidth
              error={
                formik.touched.category_id && Boolean(formik.errors.category_id)
              }
            >
              <InputLabel id="category-label">Категория</InputLabel>
              <Select
                labelId="category-label"
                id="category_id"
                name="category_id"
                value={formik.values.category_id}
                onChange={formik.handleChange}
                label="Категория"
              >
                <MenuItem value="">
                  <em>Выберите категорию</em>
                </MenuItem>
                {categories?.map((category: CategoryType) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.signed}
                  onChange={formik.handleChange}
                  name="signed"
                />
              }
              label="Подписан"
            />

            <DatePicker
              label="Дата начала"
              value={formik.values.date_start}
              onChange={(newValue) => {
                formik.setFieldValue("date_start", newValue);
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error:
                    formik.touched.date_start &&
                    Boolean(formik.errors.date_start),
                  helperText:
                    formik.touched.date_start && formik.errors.date_start
                      ? String(formik.errors.date_start)
                      : undefined,
                },
              }}
            />

            <DatePicker
              label="Дата окончания"
              value={formik.values.date_end}
              onChange={(newValue) => {
                formik.setFieldValue("date_end", newValue);
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error:
                    formik.touched.date_end && Boolean(formik.errors.date_end),
                  helperText:
                    formik.touched.date_end && formik.errors.date_end
                      ? String(formik.errors.date_end)
                      : undefined,
                },
              }}
            />

            <Box
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 1,
                p: 2,
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <DropZone onDrop={handleFileDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {file
                      ? file.name
                      : "Перетащите файл сюда или кликните для выбора"}
                  </div>
                )}
              </DropZone>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isCreating}
              fullWidth
            >
              {isCreating ? "Создание..." : "Создать документ"}
            </Button>

            {error && (
              <Alert severity="error">Ошибка: {JSON.stringify(error)}</Alert>
            )}
          </Box>
        </form>
      </Paper>
    </LocalizationProvider>
  );
};
