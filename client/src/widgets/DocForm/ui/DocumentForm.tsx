import React, { useState } from "react";
import { Formik } from "formik";
import { useAppSelector } from "@/shared/hooks/rtkUser";
import {
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useGetDocumentQuery,
} from "@/entities/DocumentForm/api/DocApi";
import { useGetCategoriesQuery } from "@/entities/DocumentForm/api/categoryApi";
import { DocumentType } from "@/entities/DocumentForm/model";
import { documentValidationSchema } from "@/entities/DocumentForm/model/validationSchema";
import {
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import { DocumentFormFields } from "./DocumentFormFields";

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

  const handleFileDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };

  if (isLoadingCategories || (isEditMode && isLoadingDocument)) {
    return <Box sx={{ p: 2 }}>Загрузка...</Box>;
  }

  const initialValues = {
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
  };

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

        <Formik
          initialValues={initialValues}
          validationSchema={documentValidationSchema}
          enableReinitialize
          onSubmit={async (values, { resetForm }) => {
            if (!user) return;

            try {
              if (isEditMode && currentDocument) {
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

              resetForm();
              setFile(null);
              onClose?.();
            } catch (err) {
              console.error(
                `Failed to ${isEditMode ? "update" : "create"} document:`,
                err
              );
            }
          }}
        >
          <DocumentFormFields
            categories={categories || []}
            isLoading={isLoading}
            isEditMode={isEditMode}
            file={file}
            handleFileDrop={handleFileDrop}
            error={error}
          />
        </Formik>
      </Paper>
    </LocalizationProvider>
  );
};
