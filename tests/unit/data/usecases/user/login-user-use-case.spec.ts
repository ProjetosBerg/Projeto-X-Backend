import { RegisterUserUseCase } from "@/data/usecases/users/registerUserUseCase";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import UserAuth from "@/auth/users/userAuth";
import { mockUser } from "@/tests/unit/mocks/user/mockUser";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { IUser } from "@/auth/interface/IUserAuth";
import { LoginUserUseCase } from "@/data/usecases/users/loginUserUseCase";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { ServerError } from "@/data/errors/ServerError";

export const makeUserRepositoryRepository =
  (): jest.Mocked<UserRepositoryProtocol> => ({
    create: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn().mockResolvedValue(null),
  });

export const makeUserAuthRepositoryRepository = (): jest.Mocked<UserAuth> => {
  const userAuth = new UserAuth() as jest.Mocked<UserAuth>;
  userAuth.hashPassword = jest.fn().mockResolvedValue("hashed_password");
  userAuth.comparePassword = jest.fn().mockResolvedValue(true);
  userAuth.checkToken = jest.fn().mockResolvedValue(true);
  userAuth.getToken = jest.fn().mockReturnValue("valid_token");
  userAuth.getUserByToken = jest.fn().mockResolvedValue({
    id: mockUser.id,
    name: mockUser.name,
    login: mockUser.login,
    email: mockUser.email,
  });
  userAuth.createUserToken = jest.fn().mockResolvedValue({
    message: "Token created successfully",
    token: "valid_token",
    user: mockUser,
  });
  return userAuth;
};

const makeSut = () => {
  const userAuthRepositoryRepositorySpy = makeUserAuthRepositoryRepository();
  const userRepositoryRepositorySpy = makeUserRepositoryRepository();
  const sut = new LoginUserUseCase(
    userRepositoryRepositorySpy,
    userAuthRepositoryRepositorySpy
  );

  const loginData = {
    login: mockUser.login,
    password: mockUser.password,
  };

  return {
    sut,
    userRepositoryRepositorySpy,
    userAuthRepositoryRepositorySpy,
    loginData,
  };
};

describe("LoginUserUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully login a user with valid credentials", async () => {
    const {
      sut,
      userRepositoryRepositorySpy,
      userAuthRepositoryRepositorySpy,
      loginData,
    } = makeSut();

    userRepositoryRepositorySpy.findOne.mockResolvedValue(mockUser);
    userAuthRepositoryRepositorySpy.comparePassword.mockResolvedValue(true);
    userAuthRepositoryRepositorySpy.createUserToken.mockResolvedValue({
      message: "Token created successfully",
      token: "valid_token",
      user: mockUser as IUser,
    });

    const result = await sut.handle(loginData);

    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledWith({
      login: mockUser.login,
    });
    expect(
      userAuthRepositoryRepositorySpy.comparePassword
    ).toHaveBeenCalledWith(loginData.password, mockUser.password);
    expect(
      userAuthRepositoryRepositorySpy.createUserToken
    ).toHaveBeenCalledWith({
      id: mockUser.id,
      name: mockUser.name,
      login: mockUser.login,
      email: mockUser.email,
    });
    expect(result).toEqual({
      message: "Token created successfully",
      token: "valid_token",
      user: mockUser,
    });
  });

  test("should throw NotFoundError if user is not found", async () => {
    const { sut, userRepositoryRepositorySpy, loginData } = makeSut();

    userRepositoryRepositorySpy.findOne.mockResolvedValue(null);

    await expect(sut.handle(loginData)).rejects.toThrow(
      new NotFoundError("Usuário não encontrado")
    );
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledWith({
      login: mockUser.login,
    });
  });

  test("should throw BusinessRuleError if password is incorrect", async () => {
    const {
      sut,
      userRepositoryRepositorySpy,
      userAuthRepositoryRepositorySpy,
      loginData,
    } = makeSut();

    userRepositoryRepositorySpy.findOne.mockResolvedValue(mockUser);
    userAuthRepositoryRepositorySpy.comparePassword.mockResolvedValue(false);

    await expect(sut.handle(loginData)).rejects.toThrow(
      new BusinessRuleError("Senha incorreta")
    );
    expect(
      userAuthRepositoryRepositorySpy.comparePassword
    ).toHaveBeenCalledWith(loginData.password, mockUser.password);
  });

  test("should throw ServerError for unexpected errors", async () => {
    const { sut, userRepositoryRepositorySpy, loginData } = makeSut();

    userRepositoryRepositorySpy.findOne.mockRejectedValue(
      new Error("Database error")
    );

    await expect(sut.handle(loginData)).rejects.toThrow(
      new ServerError("Falha no login do usuário: Database error")
    );
  });
});
