import { CategoryModel } from "./CategoryModel";
import { UserModel } from "./UserModel";
import { RoutineModel } from "./RoutinModel";

export interface Comment {
  author: string;
  text: string;
  created_at: Date;
  updated_at: Date;
}

export type NotesModel = {
  id?: string;
  status: string;
  collaborators?: string[];
  priority: string;
  category_id?: CategoryModel["id"];
  activity: string;
  activityType: string;
  description: string;
  startTime: string;
  endTime: string;
  comments?: Comment[];
  routine_id: RoutineModel["id"];
  user_id: UserModel["id"];
  created_at?: Date;
  updated_at?: Date;
};
