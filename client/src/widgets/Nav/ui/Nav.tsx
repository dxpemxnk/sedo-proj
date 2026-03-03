import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/rtkUser";
import { logout } from "@/entities/user/model/userThunk";
import { CLIENT_ROUTES } from "@/app/Router";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Tooltip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DescriptionIcon from "@mui/icons-material/Description";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export function Nav(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const handlerLogout = () => {
    dispatch(logout());
    navigate(CLIENT_ROUTES.AUTH);
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={CLIENT_ROUTES.HOME}
            sx={{
              mr: 2,
              display: "flex",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "primary.main",
              textDecoration: "none",
              "&:hover": {
                color: "primary.dark",
              },
            }}
          >
            ALFA SEDO
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              component={Link}
              to={CLIENT_ROUTES.CREATE}
              startIcon={<AddCircleIcon />}
              sx={{ color: "text.primary" }}
            >
              Создать
            </Button>
            <Button
              component={Link}
              to={CLIENT_ROUTES.DOCS}
              startIcon={<DescriptionIcon />}
              sx={{ color: "text.primary" }}
            >
              Документы
            </Button>

            <Box sx={{ ml: 2, display: "flex", alignItems: "center", gap: 2 }}>
              {!user ? (
                <>
                  <Button
                    component={Link}
                    to={CLIENT_ROUTES.AUTH}
                    variant="outlined"
                    startIcon={<LoginIcon />}
                    size="small"
                  >
                    Вход
                  </Button>
                  <Button
                    component={Link}
                    to={CLIENT_ROUTES.REG}
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    size="small"
                  >
                    Регистрация
                  </Button>
                </>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                  >
                    {user.email}
                  </Typography>
                  <Tooltip title="Выйти">
                    <IconButton
                      onClick={handlerLogout}
                      color="error"
                      size="small"
                    >
                      <LogoutIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
