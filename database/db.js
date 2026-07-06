module.exports = openDB;
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function openDB() {
    const db = await open({
        filename: "./database/store.db",
        driver: sqlite3.Database,
    });

    // Create the products table if it doesn't exist
    await db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            price INTEGER NOT NULL,
            image TEXT NOT NULL,
            category TEXT NOT NULL
        );
    `);
    return db;
}

module.exports = openDB;

