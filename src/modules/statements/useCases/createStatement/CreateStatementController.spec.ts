import request from 'supertest';
import { createConnection, Connection } from 'typeorm';

import { app } from '../../../../app';

let connection: Connection;
describe('CreateStatementController', () => {
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

  it('should be able to post an deposit statement', async () => {
    const authResponse = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'rgis@test.com', password: '123456' });

    const { token } = authResponse.body;

    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 300.0,
        description: 'Test deposit for balance',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should be able to post an withdraw statement', async () => {
    const authResponse = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'rgis@test.com', password: '123456' });

    const { token } = authResponse.body;

    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 150.0,
        description: 'Test withdraw for balance',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
