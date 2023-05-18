// controllers/userController.ts

import { Request, Response } from 'express';
import { pool } from '../database/rds';
import { addUserQuery } from '../database/query-generator';
import { runUserQuery } from '../database/query-executor';

export const getUserByDeviceId = async (req: Request, res: Response) => {
  const deviceId = req.params.deviceId;

  // Input validation
  if (!deviceId) {
    res.status(400).json({ error: "Device ID is required" });
    return;
  }
  
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE device_id = $1', [deviceId]);

    if (rows.length > 0) {
      // User found in database
      const user = rows[0];
      res.json({
        isNewUser: false,
        message: 'Welcome back ' + user.name + '!',
        data: user,
      });
    } else {
      // User not found in database
      res.json({
        isNewUser: true,
        message: 'Welcome!',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while retrieving user data.');
  }
};


export const addNewUser = async (name: string, deviceId: string) => {
    if (!name || !deviceId) {
      throw new Error("Missing 'name' or 'deviceId'");
    }
  
    try {
      const query = addUserQuery(name, deviceId);
      await runUserQuery(query);
      return { message: 'User added successfully' };
    } catch (error) {
      console.error('An error occurred while adding the user:', error);
      throw error;
    }
  };
  

