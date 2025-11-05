import * as yup from "yup";

export const getByIdNotesValidationSchema = yup.object().shape({
  noteId: yup
    .string()
    .required("ID da nota é obrigatório")
    .uuid("ID da nota deve ser um UUID válido"),
  userId: yup.string().required("ID do Usuário é obrigatório"),
});
