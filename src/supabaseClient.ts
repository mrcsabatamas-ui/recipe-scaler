import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ycdsxexzileobptgiilt.supabase.co";
const supabaseKey = "sb_publishable_07j015OOg7kwmLQoPnGlUw_rZagmO_k"; // use the publishable/anon key
export const supabase = createClient(supabaseUrl, supabaseKey);
