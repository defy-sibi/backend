import { athena, params } from "./athena";

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
