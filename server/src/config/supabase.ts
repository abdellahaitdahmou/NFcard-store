import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "https://enengmuyrmaqguzmkvrr.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "sb_publishable_Ylzt2fs83gVwmQ_mJj_NKw_Yj-c6CGR";

export const supabase = createClient(supabaseUrl, supabaseKey);
