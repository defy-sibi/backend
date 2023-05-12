import { Pool } from 'pg';
import { rdsConfig } from "../../config/aws-config";


export const pool = new Pool(rdsConfig);


