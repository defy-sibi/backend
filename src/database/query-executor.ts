import { athena, params } from "./athena";
import { pool } from './rds';


// Takes an array of queries and executes them within a single transaction.
export async function executeTransaction(queries: Array<{text: string, values: any[]}>) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for(let query of queries){
        await client.query(query.text, query.values);
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}


//athena sample query
const getQueryResults = async (queryExecutionId: string) => {
  const resultParams = {
    QueryExecutionId: queryExecutionId,
  };

  const resultsResponse = await athena.getQueryResults(resultParams).promise();
  return resultsResponse.ResultSet?.Rows;
};

export const runRentBudgetToZipcodeQuery = async (query: string) => {
  const queryParams = { ...params, QueryString: query };

  const startQueryResponse = await athena
    .startQueryExecution(queryParams)
    .promise();
  const queryExecutionId = startQueryResponse.QueryExecutionId;

  if (queryExecutionId) {
    // Check query status
    const statusResponse = await athena
      .getQueryExecution({ QueryExecutionId: queryExecutionId })
      .promise();
    const queryStatus =
      statusResponse?.QueryExecution?.Status?.State ?? "UNKNOWN";

    if (queryStatus === "SUCCEEDED") {
      // Get query results and log them
      const rows = await getQueryResults(queryExecutionId);
      console.log(rows);
    } else if (queryStatus === "FAILED") {
      console.error("Query failed:", queryExecutionId);
    } else if (queryStatus === "CANCELLED") {
      console.error("Query cancelled:", queryExecutionId);
    }
  }
};


//to add new user with deviceID
export const runUserQuery = async (query: string) => {
  const client = await pool.connect();
  try {
    await client.query(query);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
};


export const executeQuery = async (query: { text: string; values: any[]; }) => {
  try {
      const { rows } = await pool.query(query.text, query.values);
      return rows;
  } catch (error) {
      console.error('An error occurred while executing the query:', error);
      throw error;
  }
};