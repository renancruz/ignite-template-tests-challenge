import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatement: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create Statment", () => {

  beforeEach(()=> {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatement = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("Should be able to create a new statement", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "test@email.com",
      password: "1234"
    })

    const statement = new Statement();

    Object.assign(statement, {
      user_id: user.id as string,
      amount: 1000,
      description: "pix",
      type: "deposit"
    })

    const deposit = await createStatement.execute(statement)

    expect(deposit).toHaveProperty("id")
  })

  it("Should not be able to withdraw without funds", () => {
    expect(async ()=> {
      const user = await createUserUseCase.execute({
        name: "User Test",
        email: "test@email.com",
        password: "1234"
      })

      const statement = new Statement();

      Object.assign(statement, {
        user_id: user.id as string,
        amount: 1000,
        description: "pix",
        type: "withdraw"
      })

      await createStatement.execute(statement)
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})



it("Should not be able to create statement without user", () => {
  expect( async () => {
    const statement = new Statement();

    Object.assign(statement, {
      amount: 1000,
      description: "pix",
      type: "deposit"
    })

    await createStatement.execute(statement)

  }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
})
