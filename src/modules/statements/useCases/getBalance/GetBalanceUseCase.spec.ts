import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceError } from './GetBalanceError';
import { GetBalanceUseCase } from './GetBalanceUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe('GetBalance', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to get an user balance', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    await inMemoryStatementsRepository.create({
      amount: 200,
      description: 'to test amount',
      type: 'deposit',
      user_id: user.id as string,
    });

    await inMemoryStatementsRepository.create({
      amount: 20,
      description: 'to test amount',
      type: 'withdraw',
      user_id: user.id as string,
    });

    const response = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(response.balance).toBe(180);
  });

  it('should not be able to create a statement for a non-existing user', async () => {
    await expect(
      getBalanceUseCase.execute({
        user_id: 'non-existing=id',
      }),
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
