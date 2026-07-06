const fs = require("fs");
const openDB = require("./database/db");

async function importProducts() {

    const db = await openDB();

    const data = JSON.parse(
        fs.readFileSync("items.json")
    );

    for (const product of data.music) {

        await db.run(
            `INSERT INTO products
            (id, name, price, image, category)
            VALUES (?, ?, ?, ?, ?)`,
            product.id,
            product.name,
            product.price,
            product.imgName,
            "music"
        );
    }

    for (const product of data.merch) {

        await db.run(
            `INSERT INTO products
            (id, name, price, image, category)
            VALUES (?, ?, ?, ?, ?)`,
            product.id,
            product.name,
            product.price,
            product.imgName,
            "merch"
        );
    }

    console.log("Products imported!");
}

importProducts();