import { FindUserByIdUseCase } from "@/data/usecases/users/findUserByIdUseCase";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { mockUser } from "@/tests/unit/mocks/user/mockUser";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { ValidationError } from "yup";

export const makeUserRepositoryRepository =
  (): jest.Mocked<UserRepositoryProtocol> => ({
    findOne: jest.fn().mockResolvedValue(null),
    ...({} as any),
  });

const makeSut = () => {
  const userRepositoryRepositorySpy = makeUserRepositoryRepository();
  const sut = new FindUserByIdUseCase(userRepositoryRepositorySpy);

  return {
    sut,
    userRepositoryRepositorySpy,
  };
};

describe("FindUserByIdUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return user with security questions for valid id", async () => {
    const { sut, userRepositoryRepositorySpy } = makeSut();
    userRepositoryRepositorySpy.findOne.mockResolvedValue(mockUser);

    const result = await sut.handle({ id: mockUser.id });

    expect(result).toEqual({ user: mockUser });
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledWith({
      id: mockUser.id,
    });
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledTimes(1);
  });

  test("should throw NotFoundError if user not found", async () => {
    const { sut, userRepositoryRepositorySpy } = makeSut();
    userRepositoryRepositorySpy.findOne.mockResolvedValue(null);

    const input = { id: "invalid_id" };
    await expect(sut.handle(input)).rejects.toThrow(
      new NotFoundError("Usuário não encontrado")
    );
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledWith({
      id: input.id,
    });
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledTimes(1);
  });

  test("should throw BusinessRuleError if no security questions", async () => {
    const { sut, userRepositoryRepositorySpy } = makeSut();
    userRepositoryRepositorySpy.findOne.mockResolvedValue({
      ...mockUser,
      security_questions: [],
    });

    await expect(sut.handle({ id: mockUser.id })).rejects.toThrow(
      new BusinessRuleError(
        "Nenhuma questão de segurança registrada para este usuário"
      )
    );
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledWith({
      id: mockUser.id,
    });
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledTimes(1);
  });

  test("should throw ValidationError if id is empty", async () => {
    const { sut, userRepositoryRepositorySpy } = makeSut();

    const input = { id: "" };
    await expect(sut.handle(input)).rejects.toThrow(ValidationError);
    expect(userRepositoryRepositorySpy.findOne).not.toHaveBeenCalled();
  });

  test("should throw ValidationError if id is missing", async () => {
    const { sut, userRepositoryRepositorySpy } = makeSut();

    const input = {} as any;
    await expect(sut.handle(input)).rejects.toThrow(ValidationError);
    expect(userRepositoryRepositorySpy.findOne).not.toHaveBeenCalled();
  });
});
