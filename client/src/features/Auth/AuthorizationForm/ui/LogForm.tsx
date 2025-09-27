import { useFormik } from "formik";
import { useAppDispatch } from "@/shared/hooks/rtkUser";
import { useNavigate } from "react-router-dom";
import { authorization } from "@/entities/user/model/userThunk";
import { CLIENT_ROUTES } from "@/app/Router";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Alert,
} from "@mui/material";

const validationSchema = Yup.object({
  email: Yup.string().email("Некорректный email").required("Email обязателен"),
  password: Yup.string()
    .required("Пароль обязателен")
    .min(6, "Пароль должен содержать минимум 6 символов"),
});

export function AuthorizationForm(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(authorization(values)).unwrap();
        navigate(CLIENT_ROUTES.HOME);
      } catch (error) {
        console.error("Authorization failed:", error);
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: "400px",
          width: "100%",
          p: 3,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Вход
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Пароль"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Вход..." : "Войти"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
