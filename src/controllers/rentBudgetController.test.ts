import { Request, Response } from 'express';
import { getRentBudgetToZipcode } from './rentBudgetController';
import { runRentBudgetToZipcodeQuery } from '../database/query-executor';

jest.mock('../database/query-executor');


const mockRequest = () => {
    const req = {} as Request;
    req.params = { inputValue: '1000' };
    return req;
  };
  
  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };


describe('getRentBudgetToZipcode', () => {
  const req = {
    params: { inputValue: '' },
  } as unknown as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should respond with 400 status code for NaN', async () => {
    req.params.inputValue = 'not-a-number';
    await getRentBudgetToZipcode(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input value' });
  });

  it('should respond with 400 status code for null', async () => {
    const req = mockRequest();
    const res = mockResponse();
    delete req.params.inputValue;
    await getRentBudgetToZipcode(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input value' });
  });

  it('should respond with 400 status code for negative numbers', async () => {
    req.params.inputValue = '-1';
    await getRentBudgetToZipcode(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input value' });
  });

  it('should respond with 400 status code for 0', async () => {
    req.params.inputValue = '0';
    await getRentBudgetToZipcode(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input value' });
  });

  it('should respond with 500 status code for server errors', async () => {
    req.params.inputValue = '1000';
    (runRentBudgetToZipcodeQuery as jest.Mock).mockRejectedValue(new Error('Server error'));
    await getRentBudgetToZipcode(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while processing your request' });
  });

  it('should respond with query results for valid input value', async () => {
    req.params.inputValue = '1000';
    const mockResults = [{ zipCode: '12345', rent: '1000' }];
    (runRentBudgetToZipcodeQuery as jest.Mock).mockResolvedValue(mockResults);
    await getRentBudgetToZipcode(req, res);
    expect(res.json).toHaveBeenCalledWith(mockResults);
  });

  it('should respond with 400 status code for inputs with more than 5 digits', async () => {
    req.params.inputValue = '100000';
    await getRentBudgetToZipcode(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input value' });
  });
  
});
