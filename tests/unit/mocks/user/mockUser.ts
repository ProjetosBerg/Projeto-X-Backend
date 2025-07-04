import { UserModel } from "@/domain/models/postgres/UserModel";
import { faker } from "@faker-js/faker";

const mockUser: UserModel = {
  id: faker.string.uuid(),
  name: "berg",
  login: "bergkley",
  email: "berg@example.com",
  password: faker.internet.password(),
};

export { mockUser };
