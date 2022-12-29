import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  });
  it("should be able to show user by id", async () => {
    const user = {
      name: "teste",
      email: "teste@mail.com",
      password: "123"
    }

    const userCreated = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });
    const userShow = await showUserProfileUseCase.execute(userCreated.id as string)

    expect(userShow).toHaveProperty("id")
  });

  it("should not be able to show an non existent user", () => {
    expect(async () => {
      await showUserProfileUseCase.execute('12345')
    }).rejects.toBeInstanceOf(ShowUserProfileError)

  });
});
