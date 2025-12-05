import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useAppSelector } from "@/shared/hooks/rtkUser";
import {
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useGetDocumentQuery,
} from "@/entities/DocumentForm/api/DocApi";
import { useGetCategoriesQuery } from "@/entities/DocumentForm/api/categoryApi";
import { CategoryType } from "@/entities/DocumentForm/model/catTypes";
import { DocumentType } from "@/entities/DocumentForm/model";
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

interface DocumentFormProps {
  document?: DocumentType;
  onClose?: () => void;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  document,
  onClose,
}) => {
  const isEditMode = !!document;
  const { user } = useAppSelector((state) => state.user);
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();
  const [createDoc, { isLoading: isCreating, error: createError }] =
    useCreateDocumentMutation();
  const [updateDoc, { isLoading: isUpdating, error: updateError }] =
    useUpdateDocumentMutation();
  const { data: documentData, isLoading: isLoadingDocument } =
    useGetDocumentQuery(document?.id || 0, {
      skip: !isEditMode || !document?.id,
    });
  const [file, setFile] = useState<File | null>(null);

  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;

  // Используем данные документа для редактирования или данные из запроса
  const currentDocument = isEditMode
    ? documentData || document
    : null;

  const formik = useFormik({
    initialValues: {
      name: currentDocument?.name || "",
      description: currentDocument?.description || "",
      category_id: currentDocument?.category_id?.toString() || "",
      signed: currentDocument?.signed || false,
      date_start: currentDocument?.date_start
        ? new Date(currentDocument.date_start)
        : new Date(),
      date_end: currentDocument?.date_end
        ? new Date(currentDocument.date_end)
        : new Date(),
    },
    validationSchema: documentValidationSchema,
    enableReinitialize: true, // Позволяет переинициализировать форму при изменении initialValues
    onSubmit: async (values) => {
      if (!user) return;

      try {
        if (isEditMode && currentDocument) {
          // Режим редактирования
          await updateDoc({
            id: currentDocument.id,
            name: values.name,
            description: values.description,
            category_id: Number(values.category_id),
            user_id: currentDocument.user_id,
            signed: values.signed,
            date_start: values.date_start.toISOString().split("T")[0],
            date_end: values.date_end.toISOString().split("T")[0],
            category: currentDocument.category,
            User: currentDocument.User,
          }).unwrap();
        } else {
          // Режим создания
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
        }

        formik.resetForm();
        setFile(null);
        onClose?.();
      } catch (err) {
        console.error(
          `Failed to ${isEditMode ? "update" : "create"} document:`,
          err
        );
      }
    },
  });

  // Обновляем форму при загрузке данных документа
  useEffect(() => {
    if (isEditMode && documentData) {
      formik.setValues({
        name: documentData.name,
        description: documentData.description,
        category_id: documentData.category_id.toString(),
        signed: documentData.signed,
        date_start: new Date(documentData.date_start),
        date_end: new Date(documentData.date_end),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentData, isEditMode]);

  const handleFileDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };

  if (isLoadingCategories || (isEditMode && isLoadingDocument)) {
    return <Box sx={{ p: 2 }}>Загрузка...</Box>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" component="h2">
            {isEditMode ? "Редактирование документа" : "Создание документа"}
          </Typography>
          {onClose && (
            <Button onClick={onClose} size="small">
              Закрыть
            </Button>
          )}
        </Box>

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
              disabled={isLoading}
              fullWidth
            >
              {isLoading
                ? isEditMode
                  ? "Сохранение..."
                  : "Создание..."
                : isEditMode
                ? "Сохранить изменения"
                : "Создать документ"}
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
