import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"


let createUserUseCase: CreateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;

describe("Create User", () => {

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  })

  it("Should be able to create a new user", async () => {

      const user = await createUserUseCase.execute({
        name: "test",
        email: "test@test.com",
        password: "123"
      })

      expect(user).toHaveProperty("id");
  })

  it("Should not be able to create user with an email already exists", async () => {
    expect(async () => {

      await createUserUseCase.execute({
        name: "test1",
        email: "test@test.com",
        password: "1234"
      })

      await createUserUseCase.execute({
        name: "test2",
        email: "test@test.com",
        password: "5678"
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
