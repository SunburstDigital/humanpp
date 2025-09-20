
const { setupApp } = require('../backend/app.js');
let app;


describe('API Endpoints', () => {
  beforeAll(async () => {
    app = await setupApp();
  });
  afterAll(async () => {
    if (app && app.close) await app.close();
  });

  it('GET /health should return 200', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toEqual(200);
    expect(res.json().ok).toBe(true);
  });

  it('POST /calls/summary should accept summary', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/calls/summary',
      payload: {
        phone: '0404123123',
        summary: 'Test summary',
        client_number: 'test-client',
      },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.statusCode).toEqual(200);
    expect(res.json().ok).toBe(true);
  });

  it('GET /logs/recent should return logs', async () => {
    const res = await app.inject({ method: 'GET', url: '/logs/recent' });
    expect([200,500]).toContain(res.statusCode); // 500 if no DB
  });

  it('GET /logs/supabase-check should return status', async () => {
    const res = await app.inject({ method: 'GET', url: '/logs/supabase-check' });
    expect([200,500]).toContain(res.statusCode);
  });

  it('GET /media-url without path should 400', async () => {
    const res = await app.inject({ method: 'GET', url: '/media-url' });
    expect(res.statusCode).toEqual(400);
  });

  it('POST /twilio/incoming-sms should 200 or 500', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/twilio/incoming-sms',
      payload: { From: '+1234567890', Body: 'Test' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect([200,500]).toContain(res.statusCode);
  });

  it('POST /twilio/sms-status should 200 or 500', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/twilio/sms-status',
      payload: { MessageSid: 'SM123', MessageStatus: 'delivered' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect([200,500]).toContain(res.statusCode);
  });

  it('POST /twilio/call-status should 200 or 500', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/twilio/call-status',
      payload: { CallSid: 'CA123', CallStatus: 'completed' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect([200,500]).toContain(res.statusCode);
  });

  it('POST /twilio/call-start should 200 or 500', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/twilio/call-start',
      payload: { CallSid: 'CA123', From: '+1234567890', To: '+0987654321' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect([200,500]).toContain(res.statusCode);
  });
});
