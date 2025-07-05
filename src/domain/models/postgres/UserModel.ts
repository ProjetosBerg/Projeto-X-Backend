import { SecurityQuestionModel } from "./SecurityQuestionModel";

export type UserModel = {
  id?: string;
  name: string;
  login: string;
  email: string;
  security_questions: SecurityQuestionModel[];
  password: string;
  created_at?: Date;
  updated_at?: Date;
};
