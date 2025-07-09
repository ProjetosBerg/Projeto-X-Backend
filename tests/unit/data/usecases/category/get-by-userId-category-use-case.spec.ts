import { CategoryRepositoryProtocol } from "@/infra/db/interfaces/categoryRepositoryProtocol";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { ServerError } from "@/data/errors/ServerError";
import { ValidationError } from "yup";
import { mockCategory } from "@/tests/unit/mocks/category/mockCategory";
import { mockUser } from "@/tests/unit/mocks/user/mockUser";
import { GetByUserIdCategoryUseCase } from "@/data/usecases/category/getByUserIdCategoryUseCase";

export const makeCategoryRepository =
  (): jest.Mocked<CategoryRepositoryProtocol> => ({
    create: jest.fn(),
    findByNameAndUserId: jest.fn(),
    findByUserId: jest.fn().mockResolvedValue([mockCategory]),
    ...({} as any),
  });

export const makeUserRepository = (): jest.Mocked<UserRepositoryProtocol> => ({
  findOne: jest.fn().mockResolvedValue(mockUser),
  ...({} as any),
});

const makeSut = () => {
  const categoryRepositorySpy = makeCategoryRepository();
  const userRepositorySpy = makeUserRepository();
  const sut = new GetByUserIdCategoryUseCase(
    categoryRepositorySpy,
    userRepositorySpy
  );

  return {
    sut,
    categoryRepositorySpy,
    userRepositorySpy,
  };
};

describe("GetByUserIdCategoryUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return categories successfully", async () => {
    const { sut, categoryRepositorySpy, userRepositorySpy } = makeSut();
    const input = { userId: mockUser.id };
    const expectedCategories = [
      {
        id: mockCategory.id,
        name: mockCategory.name,
        description: mockCategory.description,
        type: mockCategory.type,
        record_type_id: mockCategory.record_type_id,
        user_id: mockCategory.user_id,
        created_at: mockCategory.created_at,
        updated_at: mockCategory.updated_at,
      },
    ];

    userRepositorySpy.findOne.mockResolvedValue(mockUser);
    categoryRepositorySpy.findByUserId.mockResolvedValue([mockCategory]);

    const result = await sut.handle(input);

    expect(result).toEqual(expectedCategories);
    expect(userRepositorySpy.findOne).toHaveBeenCalledWith({
      id: input.userId,
    });
    expect(userRepositorySpy.findOne).toHaveBeenCalledTimes(1);
    expect(categoryRepositorySpy.findByUserId).toHaveBeenCalledWith({
      userId: input.userId,
    });
    expect(categoryRepositorySpy.findByUserId).toHaveBeenCalledTimes(1);
  });

  test("should throw ValidationError if userId is empty", async () => {
    const { sut, categoryRepositorySpy, userRepositorySpy } = makeSut();
    const input = { userId: "" };

    await expect(sut.handle(input)).rejects.toThrow(ValidationError);
    await expect(sut.handle(input)).rejects.toMatchObject({
      errors: expect.arrayContaining(["ID do Usuário é obrigatório"]),
    });
    expect(userRepositorySpy.findOne).not.toHaveBeenCalled();
    expect(categoryRepositorySpy.findByUserId).not.toHaveBeenCalled();
  });

  test("should throw NotFoundError if user is not found", async () => {
    const { sut, categoryRepositorySpy, userRepositorySpy } = makeSut();
    const input = { userId: mockUser.id };
    userRepositorySpy.findOne.mockResolvedValue(null);

    await expect(sut.handle(input)).rejects.toThrow(
      new NotFoundError("User não encontrado")
    );
    expect(userRepositorySpy.findOne).toHaveBeenCalledWith({
      id: input.userId,
    });
    expect(userRepositorySpy.findOne).toHaveBeenCalledTimes(1);
    expect(categoryRepositorySpy.findByUserId).not.toHaveBeenCalled();
  });

  test("should throw NotFoundError if no categories are found", async () => {
    const { sut, categoryRepositorySpy, userRepositorySpy } = makeSut();
    const input = { userId: mockUser.id };
    userRepositorySpy.findOne.mockResolvedValue(mockUser);
    categoryRepositorySpy.findByUserId.mockResolvedValue([]);

    await expect(sut.handle(input)).rejects.toThrow(
      new NotFoundError("Nenhuma categoria encontrada")
    );
    expect(userRepositorySpy.findOne).toHaveBeenCalledWith({
      id: input.userId,
    });
    expect(userRepositorySpy.findOne).toHaveBeenCalledTimes(1);
    expect(categoryRepositorySpy.findByUserId).toHaveBeenCalledWith({
      userId: input.userId,
    });
    expect(categoryRepositorySpy.findByUserId).toHaveBeenCalledTimes(1);
  });

  test("should throw ServerError on unexpected error", async () => {
    const { sut, categoryRepositorySpy, userRepositorySpy } = makeSut();
    const input = { userId: mockUser.id };
    userRepositorySpy.findOne.mockRejectedValue(new Error("Database error"));

    await expect(sut.handle(input)).rejects.toThrow(
      new ServerError("Falha na busca das categorias: Database error")
    );
    expect(userRepositorySpy.findOne).toHaveBeenCalledWith({
      id: input.userId,
    });
    expect(userRepositorySpy.findOne).toHaveBeenCalledTimes(1);
    expect(categoryRepositorySpy.findByUserId).not.toHaveBeenCalled();
  });
});
