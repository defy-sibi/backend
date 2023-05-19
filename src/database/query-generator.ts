
// S3 bucket querying
export function rentBudgetToZipcodeQuery(inputValue: number): string {
  return `
    SELECT
      "ZIP_Code",
      "HUD_Area_Code",
      "HUD_Metro_Fair_Market_Rent_Area_Name",
      CASE WHEN "SAFMR_0BR" < ${inputValue} THEN "SAFMR_0BR" ELSE NULL END as "SAFMR_0BR",
      CASE WHEN "SAFMR_1BR" < ${inputValue} THEN "SAFMR_1BR" ELSE NULL END as "SAFMR_1BR",
      CASE WHEN "SAFMR_2BR" < ${inputValue} THEN "SAFMR_2BR" ELSE NULL END as "SAFMR_2BR",
      CASE WHEN "SAFMR_3BR" < ${inputValue} THEN "SAFMR_3BR" ELSE NULL END as "SAFMR_3BR",
      CASE WHEN "SAFMR_4BR" < ${inputValue} THEN "SAFMR_4BR" ELSE NULL END as "SAFMR_4BR"
    FROM may
    WHERE
      ${inputValue} < "SAFMR_0BR"
      OR ${inputValue} < "SAFMR_1BR"
      OR ${inputValue} < "SAFMR_2BR"
      OR ${inputValue} < "SAFMR_3BR"
      OR ${inputValue} < "SAFMR_4BR";
  `;
}



//RDS
//adding new user with deviceID and name
export function addUserQuery(name: string, deviceId: string): { text: string; values: any[] } {
  return {
    text: 'INSERT INTO "user" (Name, DeviceID, User_since, Last_login) VALUES ($1, $2, NOW(), NOW())',
    values: [name, deviceId],
    };
}

//initializing row in search history table with user's deviceID. 
export function addSearchHistory(deviceId: string): { text: string, values: any[] } {
  return {
    text: `
      INSERT INTO "search_history" (
        DeviceID,
        Daily_search_counter,
        Total_search_counter
      ) values ($1, 0, 0)
    `,
    values: [deviceId]
  };
}


// getting user name by deviceID
export function getUserByDeviceIdQuery(deviceId: string) {
  return {
      text: 'SELECT * FROM "user" WHERE DeviceID = $1',
      values: [deviceId],
  };
};