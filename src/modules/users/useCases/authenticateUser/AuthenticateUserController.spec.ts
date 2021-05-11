import request from 'supertest';
import { createConnection, Connection } from 'typeorm';

import { app } from '../../../../app';

let connection: Connection;
describe('AuthenticateUserController', () => {
  beforeAll(async () => {
    connection = await createConnection('tests');
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to authenticate an user', async () => {
    await request(app).post('/api/v1/users').send({
      email: 'rgis@test.com',
      name: 'Gisre Riafa',
      password: '123456',
    });

    const response = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'rgis@test.com', password: '123456' });

    expect(response.status).toBe(200);
    expect(response.body.user.name).toBe('Gisre Riafa');
  });

  it('should not be able to authenticate an user with an wrong e-mail', async () => {
    await request(app).post('/api/v1/users').send({
      email: 'rgis@test.com',
      name: 'Gisre Riafa',
      password: '123456',
    });

    const response = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'rgiss@test.com', password: '123456' });

    expect(response.status).toBe(401);
  });

  it('should not be able to authenticate an user with an wrong password', async () => {
    await request(app).post('/api/v1/users').send({
      email: 'rgis@test.com',
      name: 'Gisre Riafa',
      password: '123456',
    });

    const response = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'rgis@test.com', password: '1234567' });

    expect(response.status).toBe(401);
  });
});
