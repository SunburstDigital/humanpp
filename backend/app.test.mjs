import request from 'supertest';
import { createServer } from 'http';
import app from '../backend/app.js';

describe('API Endpoints', () => {
  let server;
  beforeAll((done) => {
    server = createServer(app);
    server.listen(done);
  });
  afterAll((done) => {
    server.close(done);
  });

  it('should return 200 for /health', async () => {
    const res = await request(server).get('/health');
    expect(res.statusCode).toEqual(200);
  });

  it('should accept POST /calls/summary', async () => {
    const res = await request(server)
      .post('/calls/summary')
      .send({ phone: '0404123123', summary: 'Test summary', client_number: 'test-client' })
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toEqual(200);
    expect(res.body.ok).toBe(true);
  });
});
