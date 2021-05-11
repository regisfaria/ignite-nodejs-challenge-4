import request from 'supertest';
import { createConnection, Connection } from 'typeorm';

import { app } from '../../../../app';

let connection: Connection;
describe('ShowUserProfileController', () => {
  beforeAll(async () => {
    connection = await createConnection('tests');
    await connection.runMigrations();

    await request(app).post('/api/v1/users').send({
      email: 'rgis@test.com',
      name: 'Gisre Riafa',
      password: '123456',
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to get an user profile', async () => {
    const authResponse = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'rgis@test.com', password: '123456' });

    const { token } = authResponse.body;

    const response = await request(app)
      .get('/api/v1/profile')
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});
