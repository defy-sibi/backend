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
