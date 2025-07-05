import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import UserAuth from "@/auth/users/userAuth";
import { mockUser } from "@/tests/unit/mocks/user/mockUser";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { ForgotPasswordUserUseCase } from "@/data/usecases/users/forgotPasswordUserUseCase";
import { ValidationError } from "yup";

export const makeUserRepositoryRepository =
  (): jest.Mocked<UserRepositoryProtocol> => ({
    create: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn().mockResolvedValue(null),
    updatePassword: jest.fn().mockResolvedValue(mockUser),
    ...({} as any),
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
  const sut = new ForgotPasswordUserUseCase(
    userRepositoryRepositorySpy,
    userAuthRepositoryRepositorySpy
  );

  return {
    sut,
    userRepositoryRepositorySpy,
    userAuthRepositoryRepositorySpy,
  };
};

describe("ForgotPasswordUserUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should reset password successfully with valid input", async () => {
    const {
      sut,
      userRepositoryRepositorySpy,
      userAuthRepositoryRepositorySpy,
    } = makeSut();
    userRepositoryRepositorySpy.findOne.mockResolvedValue(mockUser);

    const input = {
      login: mockUser.login,
      newPassword: "newPassword123",
      confirmNewPassword: "newPassword123",
      securityQuestions: mockUser.security_questions.map((q) => ({
        question: q.question,
        answer: q.answer,
      })),
    };

    const result = await sut.handle(input);

    expect(result).toEqual({ message: "Senha redefinida com sucesso" });
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledWith({
      login: input.login,
    });
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledTimes(1);
    expect(userAuthRepositoryRepositorySpy.hashPassword).toHaveBeenCalledWith(
      input.newPassword
    );
    expect(userRepositoryRepositorySpy.updatePassword).toHaveBeenCalledWith({
      id: mockUser.id,
      password: "hashed_password",
    });
  });

  test("should throw NotFoundError if user not found", async () => {
    const { sut, userRepositoryRepositorySpy } = makeSut();
    userRepositoryRepositorySpy.findOne.mockResolvedValue(null);

    const input = {
      login: "invalid_login",
      newPassword: "newPassword123",
      confirmNewPassword: "newPassword123",
      securityQuestions: mockUser.security_questions.map((q) => ({
        question: q.question,
        answer: q.answer,
      })),
    };

    await expect(sut.handle(input)).rejects.toThrow(
      new NotFoundError("Usuário não encontrado")
    );
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledWith({
      login: input.login,
    });
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledTimes(1);
  });

  test("should throw BusinessRuleError if no security questions", async () => {
    const { sut, userRepositoryRepositorySpy } = makeSut();
    userRepositoryRepositorySpy.findOne.mockResolvedValue({
      ...mockUser,
      security_questions: [],
    });

    const input = {
      login: mockUser.login,
      newPassword: "newPassword123",
      confirmNewPassword: "newPassword123",
      securityQuestions: mockUser.security_questions.map((q) => ({
        question: q.question,
        answer: q.answer,
      })),
    };

    await expect(sut.handle(input)).rejects.toThrow(
      new BusinessRuleError(
        "Nenhuma questão de segurança registrada para este usuário"
      )
    );
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledWith({
      login: input.login,
    });
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledTimes(1);
  });

  test("should throw BusinessRuleError if number of security questions does not match", async () => {
    const { sut, userRepositoryRepositorySpy } = makeSut();
    userRepositoryRepositorySpy.findOne.mockResolvedValue(mockUser);

    const input = {
      login: mockUser.login,
      newPassword: "newPassword123",
      confirmNewPassword: "newPassword123",
      securityQuestions: [
        {
          question: mockUser.security_questions[0].question,
          answer: mockUser.security_questions[0].answer,
        },
      ],
    };

    await expect(sut.handle(input)).rejects.toThrow(
      new BusinessRuleError(
        "Número de questões de segurança fornecidas não corresponde ao registrado"
      )
    );
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledWith({
      login: input.login,
    });
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledTimes(1);
  });

  test("should throw BusinessRuleError if security question answers are invalid", async () => {
    const { sut, userRepositoryRepositorySpy } = makeSut();
    userRepositoryRepositorySpy.findOne.mockResolvedValue(mockUser);

    const input = {
      login: mockUser.login,
      newPassword: "newPassword123",
      confirmNewPassword: "newPassword123",
      securityQuestions: mockUser.security_questions.map((q) => ({
        question: q.question,
        answer: "wrong_answer",
      })),
    };

    await expect(sut.handle(input)).rejects.toThrow(
      new BusinessRuleError("Resposta de segurança inválida")
    );
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledWith({
      login: input.login,
    });
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledTimes(1);
  });

  test("should throw BusinessRuleError if password update fails", async () => {
    const {
      sut,
      userRepositoryRepositorySpy,
      userAuthRepositoryRepositorySpy,
    } = makeSut();
    userRepositoryRepositorySpy.findOne.mockResolvedValue(mockUser);
    userRepositoryRepositorySpy.updatePassword.mockResolvedValue(undefined);

    const input = {
      login: mockUser.login,
      newPassword: "newPassword123",
      confirmNewPassword: "newPassword123",
      securityQuestions: mockUser.security_questions.map((q) => ({
        question: q.question,
        answer: q.answer,
      })),
    };

    await expect(sut.handle(input)).rejects.toThrow(
      new BusinessRuleError("Falha ao atualizar a senha do usuário")
    );
    expect(userRepositoryRepositorySpy.findOne).toHaveBeenCalledWith({
      login: input.login,
    });
    expect(userAuthRepositoryRepositorySpy.hashPassword).toHaveBeenCalledWith(
      input.newPassword
    );
    expect(userRepositoryRepositorySpy.updatePassword).toHaveBeenCalledWith({
      id: mockUser.id,
      password: "hashed_password",
    });
  });

  test("should throw ValidationError if input is invalid", async () => {
    const { sut, userRepositoryRepositorySpy } = makeSut();

    const input = {
      login: "",
      newPassword: "",
      confirmNewPassword: "",
      securityQuestions: [],
    };

    await expect(sut.handle(input)).rejects.toThrow(ValidationError);
    expect(userRepositoryRepositorySpy.findOne).not.toHaveBeenCalled();
  });
});
