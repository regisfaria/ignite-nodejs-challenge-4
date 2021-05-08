import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { ShowUserProfileError } from './ShowUserProfileError';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('ShowUserProfile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository,
    );
  });

  it('should be able to show an user profile', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    const profile = await showUserProfileUseCase.execute(user.id || '');

    expect(profile.email).toEqual(user.email);
    expect(profile.name).toEqual(user.name);
  });

  it('should not be able to show the profile of a non-existing user', async () => {
    await expect(
      showUserProfileUseCase.execute('non-existing-id'),
    ).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
