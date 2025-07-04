import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { UserModel } from "@/domain/models/postgres/UserModel";
import { mockUser } from "@/tests/unit/mocks/user/mockUser";

export const makeUserRepositoryRepository = (): UserRepositoryProtocol => ({
  create: jest.fn().mockImplementation(async (data: Partial<UserModel>) => {
    // Return a mock user with the input data merged with default mockUser values
    return {
      ...mockUser,
      ...data,
      id: data.id || mockUser.id, // Ensure id is always present
    };
  }),
  findOne: jest.fn().mockImplementation(async (query: Partial<UserModel>) => {
    // Simulate finding a user by email or login
    if (query.email === mockUser.email || query.login === mockUser.login) {
      return mockUser;
    }
    return null; // Return null if no user is found
  }),
});
