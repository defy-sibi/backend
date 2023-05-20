import { Request, Response } from 'express';
import { pool } from '../database/rds';
import { getUserByDeviceId } from './userController';

const mockRequest = (params?: any): Request => {
    return ({
        params: params || {},
        get: () => '', // Provide an implementation for the get method
    } as unknown) as Request;
};

const mockResponse = (): Response => {
    return ({
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    } as unknown) as Response;
};

jest.mock('../database/rds', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('getUserByDeviceId', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user data if user exists', async () => {
    const deviceId = 'device1';
    req.params.deviceId = deviceId;

    const mockUser = { name: 'User1', deviceId };
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

    await getUserByDeviceId(req, res);

    expect(res.json).toHaveBeenCalledWith({
      isNewUser: false,
      message: 'Welcome back ' + mockUser.name + '!',
      data: mockUser,
    });
  });

  it('should return isNewUser: true if user does not exist', async () => {
    const deviceId = 'device2';
    req.params.deviceId = deviceId;

    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    await getUserByDeviceId(req, res);

    expect(res.json).toHaveBeenCalledWith({
      isNewUser: true,
      message: 'Welcome!',
    });
  });

  it('should return 500 status code if an error occurs', async () => {
    const deviceId = 'device3';
    req.params.deviceId = deviceId;

    (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

    await getUserByDeviceId(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('An error occurred while retrieving user data. Please try again.');
  });

  it('should respond with 400 status code for missing deviceId', async () => {
    req.params = {}; // No deviceId provided
    await getUserByDeviceId(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Device ID is required' });
  });
});
