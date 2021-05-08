import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementError } from './CreateStatementError';
import { CreateStatementUseCase } from './CreateStatementUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe('CreateStatement', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  });

  it('should be able to create a new deposit statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    const statement = await createStatementUseCase.execute({
      amount: 200,
      description: 'to test amount',
      type: 'deposit',
      user_id: user.id as string,
    });

    expect(statement).toHaveProperty('id');
  });

  it('should be able to create a new withdraw statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    await createStatementUseCase.execute({
      amount: 200,
      description: 'to test amount',
      type: 'deposit',
      user_id: user.id as string,
    });

    const statement = await createStatementUseCase.execute({
      amount: 100,
      description: 'to test amount',
      type: 'withdraw',
      user_id: user.id as string,
    });

    expect(statement).toHaveProperty('id');
  });

  it('should not be able to create a statement for a non-existing user', async () => {
    await expect(
      createStatementUseCase.execute({
        amount: 100,
        description: 'to test amount',
        type: 'withdraw',
        user_id: 'non-existing=id',
      }),
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it('should not be able to create a withdraw statement with insufficient funds', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    await expect(
      createStatementUseCase.execute({
        amount: 100,
        description: 'to test amount',
        type: 'withdraw',
        user_id: user.id as string,
      }),
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
