import { Router } from "express";
import { getUserByDeviceId } from '../controllers/userController';
import { getRentBudgetToZipcode } from '../controllers/rentBudgetController';
const router = Router();

router.get('/user/:deviceId', getUserByDeviceId);

router.get("/rentBudgetToZipcode/:inputValue", getRentBudgetToZipcode);

export default router;
