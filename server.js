// 1st thing: check if we're in production or developing environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const stripePubKey = process.env.STRIPE_PUBLIC_KEY
const stripeSecKey = process.env.STRIPE_SECRET_KEY

// libs
const express = require('express')
const stripe = require('stripe')(stripeSecKey)

const app = express()
const openDB = require("./database/db.js")
// ejs framework
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())

async function startServer() {
    const db = await openDB()
    // Store page
    app.get('/store', async function (req, res) {
        try {
            const music = await db.all(
                "SELECT * FROM products WHERE category = 'music'"
            )
            const merch = await db.all(
                "SELECT * FROM products WHERE category = 'merch'"
            )
            res.render('store.ejs', {
                stripePubKey: stripePubKey,
                items: {
                    music,
                    merch
                }
            })
        } catch (err) {
            console.error(err)
            res.status(500).end()
        }
    })

    // Purchase route
    app.post('/purchase', async function (req, res) {
        try {
            const itemsArr = await db.all(
                "SELECT * FROM products"
            )
            let total = 0
            // user's
            req.body.items.forEach(function (item) {
                const itemJson = itemsArr.find(function (i) {
                    return i.id == item.id
                })
                if (itemJson) {
                    total += itemJson.price * item.quantity
                }
            })
            await stripe.charges.create({
                amount: total,
                source: req.body.stripeTokenId,
                currency: 'cad'
            })
            console.log("Charge Successful")
            res.json({
                message: "No item is gonna be shipped to your house"
            })
        } catch (err) {
            console.error(err)
            console.log("Charge Failed")
            res.status(500).end()
        }
    })

    app.listen(3000, () => {
        console.log("Server running on port 3000")
    })
}

startServer()


