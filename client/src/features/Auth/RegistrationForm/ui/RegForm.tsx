import { useFormik } from "formik";
import { useAppDispatch } from "@/shared/hooks/rtkUser";
import { useNavigate } from "react-router-dom";
import { registration } from "@/entities/user/model/userThunk";
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
  name: Yup.string()
    .required("Имя обязательно")
    .min(2, "Имя должно содержать минимум 2 символа"),
  email: Yup.string().email("Некорректный email").required("Email обязателен"),
  password: Yup.string()
    .required("Пароль обязателен")
    .min(1, "Пароль должен содержать минимум 1 символ"),
  role: Yup.string().required("Роль обязательна"),
  phone: Yup.string()
    .required("Телефон обязателен")
    .matches(/^\d{10,15}$/, "Некорректный номер телефона"),
});

export function RegForm(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      phone: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(
          registration({
            ...values,
          })
        ).unwrap();
        navigate(CLIENT_ROUTES.HOME);
      } catch (error) {
        console.error("Registration failed:", error);
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
          Регистрация
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Имя"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

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

            <TextField
              fullWidth
              id="role"
              name="role"
              label="Роль"
              value={formik.values.role}
              onChange={formik.handleChange}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
            />

            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="Телефон"
              type="tel"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
