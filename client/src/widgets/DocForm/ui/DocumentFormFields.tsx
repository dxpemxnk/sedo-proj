import React from "react";
import { useFormikContext, Form } from "formik";
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
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DropZone from "react-dropzone";
import { CategoryType } from "@/entities/DocumentForm/model/catTypes";

interface DocumentFormFieldsProps {
  categories: CategoryType[];
  isLoading: boolean;
  isEditMode: boolean;
  file: File | null;
  handleFileDrop: (files: File[]) => void;
  error: any;
}

export const DocumentFormFields: React.FC<DocumentFormFieldsProps> = ({
  categories,
  isLoading,
  isEditMode,
  file,
  handleFileDrop,
  error,
}) => {
  const { values, touched, errors, handleChange, setFieldValue } =
    useFormikContext<any>();

  return (
    <Form>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Название"
          value={values.name}
          onChange={handleChange}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && (errors.name as string)}
        />

        <TextField
          fullWidth
          id="description"
          name="description"
          label="Описание"
          multiline
          rows={4}
          value={values.description}
          onChange={handleChange}
          error={touched.description && Boolean(errors.description)}
          helperText={touched.description && (errors.description as string)}
        />

        <FormControl
          fullWidth
          error={touched.category_id && Boolean(errors.category_id)}
        >
          <InputLabel id="category-label">Категория</InputLabel>
          <Select
            labelId="category-label"
            id="category_id"
            name="category_id"
            value={values.category_id}
            onChange={handleChange}
            label="Категория"
          >
            <MenuItem value="">
              <em>Выберите категорию</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={values.signed}
              onChange={handleChange}
              name="signed"
            />
          }
          label="Подписан"
        />

        <DatePicker
          label="Дата начала"
          value={values.date_start}
          onChange={(newValue) => {
            setFieldValue("date_start", newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: touched.date_start && Boolean(errors.date_start),
              helperText:
                touched.date_start && errors.date_start
                  ? String(errors.date_start)
                  : undefined,
            },
          }}
        />

        <DatePicker
          label="Дата окончания"
          value={values.date_end}
          onChange={(newValue) => {
            setFieldValue("date_end", newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: touched.date_end && Boolean(errors.date_end),
              helperText:
                touched.date_end && errors.date_end
                  ? String(errors.date_end)
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
    </Form>
  );
};
