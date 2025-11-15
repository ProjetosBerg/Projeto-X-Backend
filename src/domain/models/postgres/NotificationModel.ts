import { UserModel } from "./UserModel";

export type NotificationModel = {
  id?: string;
  title?: string;
  entity?: string;
  idEntity?: string;
  isRead?: boolean;
  path?: string;
  payload?: Record<string, any>;
  user_id?: UserModel["id"];
  created_at?: Date;
  updated_at?: Date;
};
