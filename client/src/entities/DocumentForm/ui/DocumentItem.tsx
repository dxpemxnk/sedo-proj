import { DocumentType } from "../model";
import { useDeleteDocumentMutation } from "../api/DocApi";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { DocumentForm } from "@/widgets/DocForm/ui/DocumentForm";

export function DocumentItem({ doc }: { doc: DocumentType }): JSX.Element {
  const [deleteDoc] = useDeleteDocumentMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc.id).unwrap();
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              {doc.name}
            </Typography>
            <Box>
              <IconButton
                color="primary"
                onClick={() => setOpenEditForm(true)}
                size="small"
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => setOpenDialog(true)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          <Typography color="text.secondary" paragraph>
            {doc.description}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Chip
              label={doc.signed ? "Подписан" : "Не подписан"}
              color={doc.signed ? "success" : "default"}
              size="small"
            />
            <Chip
              label={doc.category?.name || "Без категории"}
              color="primary"
              size="small"
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              color: "text.secondary",
            }}
          >
            <Typography variant="body2">
              Дата начала: {formatDate(doc.date_start)}
            </Typography>
            <Typography variant="body2">
              Дата окончания: {formatDate(doc.date_end)}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Пользователь: {doc.User?.name || "Не указан"}
          </Typography>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить документ "{doc.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditForm}
        onClose={() => setOpenEditForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <DocumentForm
            document={doc}
            onClose={() => setOpenEditForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
