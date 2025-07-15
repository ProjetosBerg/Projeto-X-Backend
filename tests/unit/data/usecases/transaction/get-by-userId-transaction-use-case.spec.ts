import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { MonthlyRecordRepositoryProtocol } from "@/infra/db/interfaces/monthlyRecordRepositoryProtocol";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { ServerError } from "@/data/errors/ServerError";
import { ValidationError } from "yup";
import { mockMonthlyRecord } from "@/tests/unit/mocks/monthlyRecord/mockMonthlyRecord";
import { mockTransaction } from "@/tests/unit/mocks/transaction/mockTransaction";
import { mockUser } from "@/tests/unit/mocks/user/mockUser";
import { TransactionRepositoryProtocol } from "@/infra/db/interfaces/transactionRepositoryProtocol";
import { GetByUserIdTransactionUseCase } from "@/data/usecases/transactions/getByUserIdTransactionUseCase";

export const makeTransactionRepository =
  (): jest.Mocked<TransactionRepositoryProtocol> => ({
    create: jest.fn(),
    findByUserIdAndMonthlyRecordId: jest
      .fn()
      .mockResolvedValue([mockTransaction]),
    ...({} as any),
  });

export const makeUserRepository = (): jest.Mocked<UserRepositoryProtocol> => ({
  findOne: jest.fn().mockResolvedValue(mockUser),
  ...({} as any),
});

export const makeMonthlyRecordRepository =
  (): jest.Mocked<MonthlyRecordRepositoryProtocol> => ({
    create: jest.fn(),
    findOneMonthlyRecord: jest.fn(),
    findByUserId: jest.fn(),
    findByIdAndUserId: jest.fn().mockResolvedValue(mockMonthlyRecord),
    update: jest.fn(),
    delete: jest.fn(),
  });

const makeSut = () => {
  const transactionRepositorySpy = makeTransactionRepository();
  const userRepositorySpy = makeUserRepository();
  const monthlyRecordRepositorySpy = makeMonthlyRecordRepository();
  const sut = new GetByUserIdTransactionUseCase(
    transactionRepositorySpy,
    userRepositorySpy,
    monthlyRecordRepositorySpy
  );

  return {
    sut,
    transactionRepositorySpy,
    userRepositorySpy,
    monthlyRecordRepositorySpy,
  };
};

describe("GetByUserIdTransactionUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should retrieve transactions successfully", async () => {
    const {
      sut,
      transactionRepositorySpy,
      userRepositorySpy,
      monthlyRecordRepositorySpy,
    } = makeSut();
    userRepositorySpy.findOne.mockResolvedValue(mockUser);
    monthlyRecordRepositorySpy.findByIdAndUserId.mockResolvedValue(
      mockMonthlyRecord
    );
    transactionRepositorySpy.findByUserIdAndMonthlyRecordId.mockResolvedValue([
      mockTransaction,
    ]);

    const input = {
      userId: mockUser.id,
      monthlyRecordId: mockMonthlyRecord.id,
    };

    const result = await sut.handle(input);

    expect(result).toEqual([mockTransaction]);
    expect(userRepositorySpy.findOne).toHaveBeenCalledWith({
      id: input.userId,
    });
    expect(userRepositorySpy.findOne).toHaveBeenCalledTimes(1);
    expect(monthlyRecordRepositorySpy.findByIdAndUserId).toHaveBeenCalledWith({
      id: input.monthlyRecordId,
      userId: input.userId,
    });
    expect(monthlyRecordRepositorySpy.findByIdAndUserId).toHaveBeenCalledTimes(
      1
    );
    expect(
      transactionRepositorySpy.findByUserIdAndMonthlyRecordId
    ).toHaveBeenCalledWith({
      userId: input.userId,
      monthlyRecordId: input.monthlyRecordId,
    });
    expect(
      transactionRepositorySpy.findByUserIdAndMonthlyRecordId
    ).toHaveBeenCalledTimes(1);
  });

  test("should return empty array if no transactions are found", async () => {
    const {
      sut,
      transactionRepositorySpy,
      userRepositorySpy,
      monthlyRecordRepositorySpy,
    } = makeSut();
    userRepositorySpy.findOne.mockResolvedValue(mockUser);
    monthlyRecordRepositorySpy.findByIdAndUserId.mockResolvedValue(
      mockMonthlyRecord
    );
    transactionRepositorySpy.findByUserIdAndMonthlyRecordId.mockResolvedValue(
      []
    );

    const input = {
      userId: "user-123",
      monthlyRecordId: mockMonthlyRecord.id,
    };

    const result = await sut.handle(input);

    expect(result).toEqual([]);
    expect(userRepositorySpy.findOne).toHaveBeenCalledWith({
      id: input.userId,
    });
    expect(userRepositorySpy.findOne).toHaveBeenCalledTimes(1);
    expect(monthlyRecordRepositorySpy.findByIdAndUserId).toHaveBeenCalledWith({
      id: input.monthlyRecordId,
      userId: input.userId,
    });
    expect(monthlyRecordRepositorySpy.findByIdAndUserId).toHaveBeenCalledTimes(
      1
    );
    expect(
      transactionRepositorySpy.findByUserIdAndMonthlyRecordId
    ).toHaveBeenCalledWith({
      userId: input.userId,
      monthlyRecordId: input.monthlyRecordId,
    });
    expect(
      transactionRepositorySpy.findByUserIdAndMonthlyRecordId
    ).toHaveBeenCalledTimes(1);
  });

  test("should throw ValidationError if userId is empty", async () => {
    const {
      sut,
      transactionRepositorySpy,
      userRepositorySpy,
      monthlyRecordRepositorySpy,
    } = makeSut();
    const input = {
      userId: "",
      monthlyRecordId: mockMonthlyRecord.id,
    };

    await expect(sut.handle(input)).rejects.toThrow(ValidationError);
    await expect(sut.handle(input)).rejects.toMatchObject({
      errors: expect.arrayContaining(["ID do Usuário é obrigatório"]),
    });
    expect(userRepositorySpy.findOne).not.toHaveBeenCalled();
    expect(monthlyRecordRepositorySpy.findByIdAndUserId).not.toHaveBeenCalled();
    expect(
      transactionRepositorySpy.findByUserIdAndMonthlyRecordId
    ).not.toHaveBeenCalled();
  });

  test("should throw ValidationError if monthlyRecordId is empty", async () => {
    const {
      sut,
      transactionRepositorySpy,
      userRepositorySpy,
      monthlyRecordRepositorySpy,
    } = makeSut();
    const input = {
      userId: mockUser.id,
      monthlyRecordId: "",
    };

    await expect(sut.handle(input)).rejects.toThrow(ValidationError);
    await expect(sut.handle(input)).rejects.toMatchObject({
      errors: expect.arrayContaining(["Registro mensal é obrigatório"]),
    });
    expect(userRepositorySpy.findOne).not.toHaveBeenCalled();
    expect(monthlyRecordRepositorySpy.findByIdAndUserId).not.toHaveBeenCalled();
    expect(
      transactionRepositorySpy.findByUserIdAndMonthlyRecordId
    ).not.toHaveBeenCalled();
  });

  test("should throw NotFoundError if user does not exist", async () => {
    const {
      sut,
      transactionRepositorySpy,
      userRepositorySpy,
      monthlyRecordRepositorySpy,
    } = makeSut();
    userRepositorySpy.findOne.mockResolvedValue(null);

    const input = {
      userId: mockUser.id,
      monthlyRecordId: mockMonthlyRecord.id,
    };

    await expect(sut.handle(input)).rejects.toThrow(
      new NotFoundError(`Usuário com ID ${input.userId} não encontrado`)
    );
    expect(userRepositorySpy.findOne).toHaveBeenCalledWith({
      id: input.userId,
    });
    expect(userRepositorySpy.findOne).toHaveBeenCalledTimes(1);
    expect(monthlyRecordRepositorySpy.findByIdAndUserId).not.toHaveBeenCalled();
    expect(
      transactionRepositorySpy.findByUserIdAndMonthlyRecordId
    ).not.toHaveBeenCalled();
  });

  test("should throw NotFoundError if monthly record does not exist", async () => {
    const {
      sut,
      transactionRepositorySpy,
      userRepositorySpy,
      monthlyRecordRepositorySpy,
    } = makeSut();
    userRepositorySpy.findOne.mockResolvedValue(mockUser);
    monthlyRecordRepositorySpy.findByIdAndUserId.mockResolvedValue(null);

    const input = {
      userId: mockUser.id,
      monthlyRecordId: mockMonthlyRecord.id,
    };

    await expect(sut.handle(input)).rejects.toThrow(
      new NotFoundError(
        `Registro mensal com ID ${input.monthlyRecordId} não encontrado para este usuário`
      )
    );
    expect(userRepositorySpy.findOne).toHaveBeenCalledWith({
      id: input.userId,
    });
    expect(userRepositorySpy.findOne).toHaveBeenCalledTimes(1);
    expect(monthlyRecordRepositorySpy.findByIdAndUserId).toHaveBeenCalledWith({
      id: input.monthlyRecordId,
      userId: input.userId,
    });
    expect(monthlyRecordRepositorySpy.findByIdAndUserId).toHaveBeenCalledTimes(
      1
    );
    expect(
      transactionRepositorySpy.findByUserIdAndMonthlyRecordId
    ).not.toHaveBeenCalled();
  });

  test("should throw ServerError on unexpected error", async () => {
    const {
      sut,
      transactionRepositorySpy,
      userRepositorySpy,
      monthlyRecordRepositorySpy,
    } = makeSut();
    userRepositorySpy.findOne.mockResolvedValue(mockUser);
    monthlyRecordRepositorySpy.findByIdAndUserId.mockResolvedValue(
      mockMonthlyRecord
    );
    transactionRepositorySpy.findByUserIdAndMonthlyRecordId.mockRejectedValue(
      new Error("Database error")
    );

    const input = {
      userId: mockUser.id,
      monthlyRecordId: mockMonthlyRecord.id,
    };

    await expect(sut.handle(input)).rejects.toThrow(
      new ServerError("Falha na busca das transações: Database error")
    );
    expect(userRepositorySpy.findOne).toHaveBeenCalledWith({
      id: input.userId,
    });
    expect(userRepositorySpy.findOne).toHaveBeenCalledTimes(1);
    expect(monthlyRecordRepositorySpy.findByIdAndUserId).toHaveBeenCalledWith({
      id: input.monthlyRecordId,
      userId: input.userId,
    });
    expect(monthlyRecordRepositorySpy.findByIdAndUserId).toHaveBeenCalledTimes(
      1
    );
    expect(
      transactionRepositorySpy.findByUserIdAndMonthlyRecordId
    ).toHaveBeenCalledWith({
      userId: input.userId,
      monthlyRecordId: input.monthlyRecordId,
    });
    expect(
      transactionRepositorySpy.findByUserIdAndMonthlyRecordId
    ).toHaveBeenCalledTimes(1);
  });
});
