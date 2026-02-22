import { serve } from "inngest/next";
import { inngest, functions } from "@/server/inngest";

// Inngest API endpoint
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
