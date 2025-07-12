import * as yup from "yup";

export const getByUserIdMonthlyRecordValidationSchema = yup.object().shape({
  userId: yup.string().required("ID do Usuário é obrigatório"),
  categoryId: yup.string().required("ID da categoria é obrigatório"),
});
