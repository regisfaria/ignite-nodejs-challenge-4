import request from 'supertest';
import { createConnection, Connection } from 'typeorm';

import { app } from '../../../../app';

let connection: Connection;
describe('CreateUserController', () => {
  beforeAll(async () => {
    connection = await createConnection('tests');
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create an user', async () => {
    const response = await request(app).post('/api/v1/users').send({
      email: 'rgis@test.com',
      name: 'Gisre Riafa',
      password: '123456',
    });

    expect(response.status).toBe(201);
  });

  it('should not be able to create an user using an existing e-mail', async () => {
    await request(app).post('/api/v1/users').send({
      email: 'rgis@test.com',
      name: 'Gisre Riafa',
      password: '123456',
    });

    const response = await request(app).post('/api/v1/users').send({
      email: 'rgis@test.com',
      name: 'Regis Faria',
      password: '123456',
    });

    expect(response.status).toBe(400);
  });
});
