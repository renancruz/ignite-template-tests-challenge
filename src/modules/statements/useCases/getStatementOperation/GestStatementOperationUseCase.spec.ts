import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatement: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Get Statement Operation", () => {
  beforeEach(()=> {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatement = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("Should be able to get statement operation", async () => {
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

    const statementCreated = await createStatement.execute(statement)

    const statementOption = await getStatementOperationUseCase.execute({user_id: statementCreated.user_id, statement_id: statementCreated.id as string})

    expect(statementOption).toBeInstanceOf(Statement);
  })

  it("Should not be able to get statement without user existent", () => {
    expect( async () => {
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

      const statementCreated = await createStatement.execute(statement)

      await getStatementOperationUseCase.execute({user_id: "not user", statement_id: statementCreated.id as string})
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it("Should not be able to get operation without statement existent", () => {
    expect( async () => {
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

      const statementCreated = await createStatement.execute(statement)

      await getStatementOperationUseCase.execute({user_id: statementCreated.user_id, statement_id: "not statement"})
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

  it("Should not be able to get operation without statement existent", () => {
    expect( async () => {
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

      const statementCreated = await createStatement.execute(statement)

      await getStatementOperationUseCase.execute({user_id: statementCreated.user_id, statement_id: "not statement"})
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
