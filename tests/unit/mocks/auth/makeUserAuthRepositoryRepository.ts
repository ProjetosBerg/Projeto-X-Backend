import UserAuth from "@/auth/users/userAuth";

export const makeUserAuthRepositoryRepository = (): UserAuth => ({
  hashPassword: jest.fn().mockResolvedValue(""),
  comparePassword: jest.fn().mockResolvedValue(true),
  checkToken: jest.fn().mockResolvedValue(true),
  generateToken: jest.fn().mockResolvedValue(""),
  generateRefreshToken: jest.fn().mockResolvedValue(""),
  createUserToken: jest.fn().mockResolvedValue({}),
  ...({} as any),
});
