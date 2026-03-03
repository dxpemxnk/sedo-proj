import { Box, Typography, Button, Container, Paper, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTES } from "@/app/Router";
import DescriptionIcon from "@mui/icons-material/Description";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export function HomePage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 4, md: 8 },
            textAlign: "center",
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: "primary.main",
              letterSpacing: -1,
            }}
          >
            ALFA SEDO
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            paragraph
            sx={{ mb: 6, fontWeight: 300 }}
          >
            Система Электронного Документооборота
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => navigate(CLIENT_ROUTES.CREATE)}
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
            >
              Создать документ
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<DescriptionIcon />}
              onClick={() => navigate(CLIENT_ROUTES.DOCS)}
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
            >
              Список документов
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}