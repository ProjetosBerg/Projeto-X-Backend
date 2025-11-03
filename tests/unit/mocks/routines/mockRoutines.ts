import { RoutineModel } from "@/domain/models/postgres/RoutinModel";

export const mockRoutine: RoutineModel = {
  id: "routine-123",
  type: "Despesa",
  period: "Manhã",
  user_id: "user-123",
  created_at: new Date(),
  updated_at: new Date(),
};
