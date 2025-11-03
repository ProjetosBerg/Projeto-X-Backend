import { UserModel } from "./UserModel";

export type Period = "Manhã" | "Tarde" | "Noite";

export type RoutineModel = {
  id?: string;
  type: string;
  period?: Period;
  user_id?: UserModel["id"];
  created_at?: Date;
  updated_at?: Date;
};
