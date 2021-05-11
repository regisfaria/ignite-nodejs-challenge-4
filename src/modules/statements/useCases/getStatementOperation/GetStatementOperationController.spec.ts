import request from 'supertest';
import { createConnection, Connection } from 'typeorm';

import { app } from '../../../../app';

let connection: Connection;
describe('GetStatementOperationController', () => {
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

  it('should be able to get a statement operation information', async () => {
    const authResponse = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'rgis@test.com', password: '123456' });

    const { token } = authResponse.body;

    const statementResponse = await request(app)
      .post('/api/v1/statements/deposit')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 300.0,
        description: 'Test deposit for balance',
      });

    const statement = statementResponse.body;

    const response = await request(app)
      .get(`/api/v1/statements/${statement.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send();

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(statement.id);
  });

  it('should not be able to get a non-existing statement operation information', async () => {
    const authResponse = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'rgis@test.com', password: '123456' });

    const { token } = authResponse.body;

    const response = await request(app)
      .get(`/api/v1/statements/1d20291a-0bd3-4210-b423-9dd7db289ac4`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send();

    expect(response.status).toBe(404);
  });
});
