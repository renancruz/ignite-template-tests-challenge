import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatement: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;


describe("Get Balance", () => {
  beforeEach(()=> {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    createStatement = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("Should be able get balance", async () => {
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

    await createStatement.execute(statement)

    const balance = await getBalanceUseCase.execute({user_id: user.id as string} );

    expect(balance).toHaveProperty("balance")
  })

  it("Should not be able to get balance with an user non existes", () => {
    expect(async ()=> {
      await getBalanceUseCase.execute({user_id: "not user"as string} );
    })
  })
})
