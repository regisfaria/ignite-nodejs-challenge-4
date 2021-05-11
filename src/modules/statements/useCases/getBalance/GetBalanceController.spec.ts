import request from 'supertest';
import { createConnection, Connection } from 'typeorm';

import { app } from '../../../../app';

let connection: Connection;
describe('GetBalanceController', () => {
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

  it('should be able to get an user balance', async () => {
    const authResponse = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'rgis@test.com', password: '123456' });

    const { token } = authResponse.body;

    await request(app)
      .post('/api/v1/statements/deposit')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 300.0,
        description: 'Test deposit for balance',
      });

    await request(app)
      .post('/api/v1/statements/withdraw')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 150.0,
        description: 'Test withdraw for balance',
      });

    const response = await request(app)
      .get(`/api/v1/statements/balance`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send();

    expect(response.status).toBe(200);
    expect(response.body.statement.length).toBe(2);
    expect(response.body.balance).toBe(150);
  });
});
