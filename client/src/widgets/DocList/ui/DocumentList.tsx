import { useState } from "react";
import { DocumentItem } from "@/entities/DocumentForm/ui/DocumentItem";
import {
  useGetDocumentsQuery,
  DocumentFilters,
} from "@/entities/DocumentForm/api/DocApi";
import { DocumentFiltersComponent } from "@/widgets/DocFilters";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";

export function DocumentList(): JSX.Element {
  const [filters, setFilters] = useState<DocumentFilters>({
    search: "",
    category_id: null,
    signed: null,
    date_start: null,
    date_end: null,
    sortBy: "date_start",
    sortOrder: "DESC",
  });

  const { data: docs, isLoading, error } = useGetDocumentsQuery(filters);

  const handleFiltersChange = (newFilters: DocumentFilters) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Ошибка загрузки документов
      </Alert>
    );
  }

  return (
    <Box>
      <DocumentFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {docs && docs.length > 0 ? (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Найдено документов: {docs.length}
          </Typography>
          {docs.map((doc) => (
            <DocumentItem key={doc.id} doc={doc} />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Документы не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Попробуйте изменить параметры поиска или фильтры
          </Typography>
        </Box>
      )}
    </Box>
  );
}
