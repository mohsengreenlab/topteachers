import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const useNeon = process.env.USE_NEON === 'true';

// Initialize database connection based on configuration
let pool: Pool;
let db: ReturnType<typeof drizzle>;

if (useNeon) {
  // Future Neon support - uncomment and install @neondatabase/serverless if needed
  // import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
  // import { drizzle as neonDrizzle } from 'drizzle-orm/neon-serverless';
  // import ws from "ws";
  // neonConfig.webSocketConstructor = ws;
  // pool = new NeonPool({ connectionString: process.env.DATABASE_URL });
  // db = neonDrizzle({ client: pool, schema });
  throw new Error("Neon support not implemented. Set USE_NEON=false or implement Neon configuration.");
} else {
  // Standard PostgreSQL with node-postgres
  const connectionString = process.env.DATABASE_URL;
  const useSSL = (process.env.PGSSLMODE || '').toLowerCase() !== 'disable';
  
  pool = new Pool({
    connectionString,
    ssl: useSSL ? { rejectUnauthorized: false } : false
  });
  
  db = drizzle(pool, { schema });
}

export { pool, db };