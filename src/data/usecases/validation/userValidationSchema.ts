import * as Yup from "yup";

export const userValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Nome é obrigatório")
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),

  login: Yup.string()
    .required("Login é obrigatório")
    .min(2, "Login deve ter no mínimo 2 caracteres")
    .max(50, "Login deve ter no máximo 50 caracteres")
    .matches(
      /^[a-z0-9._-]+$/,
      "Login deve conter apenas letras minúsculas, números, ponto (.), underline (_) ou traço (-)"
    ),

  email: Yup.string()
    .required("E-mail é obrigatório")
    .email("E-mail inválido")
    .test(
      "is-lowercase",
      "E-mail deve estar em minúsculo",
      (value) => !value || value === value.toLowerCase()
    ),

  password: Yup.string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres"),
  confirmpassword: Yup.string()
    .required("Confirmação de senha é obrigatória")
    .oneOf([Yup.ref("password")], "Senhas diferentes"),
});
