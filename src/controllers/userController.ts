// controllers/userController.ts

import { Request, Response } from 'express';
import { pool } from '../database/rds';

export const getUserByDeviceId = async (req: Request, res: Response) => {
  const deviceId = req.params.deviceId;
  
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
