import { RoutineModel, Period } from "@/domain/models/postgres/RoutinModel";

export interface RoutinesRepositoryProtocol {
  create(data: RoutinesRepositoryProtocol.CreateRoutine): Promise<RoutineModel>;
  findByTypeAndPeriodAndUserId(
    data: RoutinesRepositoryProtocol.FindByTypeAndPeriodAndUserIdParams
  ): Promise<RoutineModel | null>;
  findByUserId(
    data: RoutinesRepositoryProtocol.FindByUserIdParams
  ): Promise<{ routines: RoutineModel[]; total: number }>;
  findByIdAndUserId(
    data: RoutinesRepositoryProtocol.FindByIdAndUserIdParams
  ): Promise<RoutineModel | null>;
  deleteRoutine(
    data: RoutinesRepositoryProtocol.DeleteRoutineParams
  ): Promise<void>;
  updateRoutine(
    data: RoutinesRepositoryProtocol.UpdateRoutineParams
  ): Promise<RoutineModel>;
}

export namespace RoutinesRepositoryProtocol {
  export type CreateRoutine = {
    type: RoutineModel["type"];
    period?: RoutineModel["period"];
    userId: RoutineModel["user_id"];
  };

  export type FindByTypeAndPeriodAndUserIdParams = {
    type: RoutineModel["type"];
    period?: RoutineModel["period"];
    userId: RoutineModel["user_id"];
  };

  export type FindByUserIdParams = {
    userId: RoutineModel["user_id"];
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: string;
  };

  export type FindByIdAndUserIdParams = {
    id: RoutineModel["id"];
    userId: RoutineModel["user_id"];
  };

  export type DeleteRoutineParams = {
    id: RoutineModel["id"];
    userId: RoutineModel["user_id"];
  };

  export type UpdateRoutineParams = {
    id: string;
    type?: RoutineModel["type"];
    period?: Period;
    userId: RoutineModel["user_id"];
  };
}
