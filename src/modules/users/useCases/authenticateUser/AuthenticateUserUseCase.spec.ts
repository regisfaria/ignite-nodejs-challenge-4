import bcryptjs from 'bcryptjs';
import 'dotenv/config';

import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
    );
  });

  it('should be able to authenticate an user', async () => {
    const user = await createUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    jest.spyOn(bcryptjs, 'compare').mockImplementationOnce(() => {
      return true;
    });

    const authResponse = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(authResponse).toHaveProperty('token');
  });

  it('should not be able to authenticate user with a wrong e-mail.', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    await expect(
      authenticateUserUseCase.execute({
        email: 'wrong@email.com',
        password: user.password,
      }),
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('should not be able to authenticate user with a wrong password.', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: 'wrongPassword',
      }),
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
