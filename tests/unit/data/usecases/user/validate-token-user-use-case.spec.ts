import { AuthenticationRepositoryProtocol } from "@/infra/db/interfaces/authenticationRepositoryProtocol";
import { ValidateTokenUseCase } from "@/data/usecases/users/validateTokenUseCase";
import { ServerError } from "@/data/errors/ServerError";

export const makeAuthenticationRepositoryRepository =
  (): jest.Mocked<AuthenticationRepositoryProtocol> => {
    return {
      hasLoginToday: jest.fn().mockResolvedValue(false),
      create: jest.fn().mockResolvedValue(undefined),
      ...({} as any),
    };
  };

const makeSut = () => {
  const authenticationRepositoryRepositorySpy =
    makeAuthenticationRepositoryRepository();
  const sut = new ValidateTokenUseCase(authenticationRepositoryRepositorySpy);

  const validateData = {
    userId: "mock-user-id",
  };

  return {
    sut,
    authenticationRepositoryRepositorySpy,
    validateData,
  };
};

describe("ValidateTokenUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should validate token when already logged in today", async () => {
    const { sut, authenticationRepositoryRepositorySpy, validateData } =
      makeSut();

    authenticationRepositoryRepositorySpy.hasLoginToday.mockResolvedValue(true);

    const result = await sut.handle(validateData);

    expect(
      authenticationRepositoryRepositorySpy.hasLoginToday
    ).toHaveBeenCalledWith({
      userId: validateData.userId,
      date: expect.any(Date),
    });
    expect(authenticationRepositoryRepositorySpy.create).not.toHaveBeenCalled();
    expect(result).toEqual({
      valid: true,
      sessionId: expect.any(String),
    });
  });

  test("should validate token and create new entry when not logged in today", async () => {
    const { sut, authenticationRepositoryRepositorySpy, validateData } =
      makeSut();

    authenticationRepositoryRepositorySpy.hasLoginToday.mockResolvedValue(
      false
    );

    const result = await sut.handle(validateData);

    expect(
      authenticationRepositoryRepositorySpy.hasLoginToday
    ).toHaveBeenCalledWith({
      userId: validateData.userId,
      date: expect.any(Date),
    });
    expect(authenticationRepositoryRepositorySpy.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: validateData.userId,
        loginAt: expect.any(Date),
        sessionId: expect.any(String),
        isOffensive: expect.any(Boolean),
      })
    );
    expect(result).toEqual({
      valid: true,
      sessionId: expect.any(String),
    });
  });

  test("should throw ServerError for unexpected errors", async () => {
    const { sut, authenticationRepositoryRepositorySpy, validateData } =
      makeSut();

    authenticationRepositoryRepositorySpy.hasLoginToday.mockRejectedValue(
      new Error("Database error")
    );

    await expect(sut.handle(validateData)).rejects.toThrow(
      new ServerError("Falha na validação do token: Database error")
    );
    expect(
      authenticationRepositoryRepositorySpy.hasLoginToday
    ).toHaveBeenCalledWith({
      userId: validateData.userId,
      date: expect.any(Date),
    });
  });
});
