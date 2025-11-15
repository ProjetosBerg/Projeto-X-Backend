import { UserModel } from "./UserModel";

export type NotificationModel = {
  id?: string;
  title?: string;
  entity?: string;
  idEntity?: string;
  isRead?: boolean;
  user_id?: UserModel["id"];
  created_at?: Date;
  updated_at?: Date;
};
