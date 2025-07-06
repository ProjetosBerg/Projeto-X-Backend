import * as yup from "yup";

export const getByIdRecordTypeValidationSchema = yup.object().shape({
  recordTypeId: yup.string().required("Id do Tipo de Registro é obrigatório"),
  userId: yup.string().required("ID do Usuário é obrigatório"),
});
