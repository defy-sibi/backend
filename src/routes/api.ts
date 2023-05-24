import { Router, Request, Response } from "express";
import { getUserByDeviceId } from '../controllers/userController';
import { getRentBudgetToZipcode } from '../controllers/rentBudgetController';
import { addNewUser } from '../controllers/userController';
const router = Router();

//userController
//check deviceId to determine if user is new or existing
router.get('/user/:deviceId', getUserByDeviceId);


//new user provides name, which is stored in db along with deviceid 
router.post('/addNewUser', async (req, res) => {
  const { name, deviceId } = req.body;

  try {
    const response = await addNewUser(name, deviceId);
    res.json(response);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});


// rentBudgetController
//based on given budget return affordable zipcodes
router.get("/rentBudgetToZipcode/:inputValue", getRentBudgetToZipcode);


export default router;
