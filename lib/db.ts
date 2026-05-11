import Database from "better-sqlite3";
import path from "path";
 
// Singleton — better-sqlite3 keeps the connection open for the lifetime
// of the Node process, so we cache it on globalThis to survive Next dev
// hot-reloads (which would otherwise leak file handles).
declare global {
  // eslint-disable-next-line no-var
  var _db: Database.Database | undefined;
}
 
const DB_PATH = path.join(process.cwd(), "data", "AI_Infrastructure.db");
 
export function getDb(): Database.Database {
  if (!global._db) {
    global._db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
    global._db.pragma("foreign_keys = ON");
  }
  return global._db;
}