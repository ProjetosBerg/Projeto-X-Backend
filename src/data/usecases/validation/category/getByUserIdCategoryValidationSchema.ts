import * as yup from "yup";

export const getByUserIdCategoryValidationSchema = yup.object().shape({
  userId: yup.string().required("ID do Usuário é obrigatório"),
});
