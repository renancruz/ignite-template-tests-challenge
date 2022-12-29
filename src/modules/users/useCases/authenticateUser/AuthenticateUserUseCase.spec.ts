
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {

  beforeEach(()=> {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to authenticate an user", async () => {

    await createUserUseCase.execute({
      name: "test",
      email: "test@email.com",
      password: "4321"
    })

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: "test@email.com",
      password: "4321"
    })

    expect(userAuthenticated).toHaveProperty("token")
  })

  it("Should not be able to authenticate with a non exists user", () => {
    expect(async () => {

      await authenticateUserUseCase.execute({
        email: "anonexists@email.com",
        password: "7890"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })

  it("Should not be able to authenticate with a incorrect password", () => {
    expect(async () => {


      await createUserUseCase.execute({
        name: "test",
        email: "test@email.com",
        password: "4321"
      })

      await authenticateUserUseCase.execute({
        email: "test@email.com",
        password: "Incorrect"
      })


    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })

})
