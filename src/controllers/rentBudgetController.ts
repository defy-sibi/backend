import { Request, Response } from 'express';
import { rentBudgetToZipcodeQuery } from '../database/query-generator';
import { runRentBudgetToZipcodeQuery } from '../database/query-executor';

export const getRentBudgetToZipcode = async (req: Request, res: Response) => {
  const inputValue = parseInt(req.params.inputValue, 10);
  if (isNaN(inputValue)) {
    res.status(400).json({ error: "Invalid input value" });
    return;
  }

  try {
    const query = rentBudgetToZipcodeQuery(inputValue);
    const results = await runRentBudgetToZipcodeQuery(query);
    console.log(results);
    res.json(results);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};
