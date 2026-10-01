import { createClient } from "@supabase/supabase-js";
import { env } from "cloudflare:workers";
import { Database } from "./models";

const supabase = createClient<Database>(env.DB_KEY, env.DB_URL);
export default supabase;
