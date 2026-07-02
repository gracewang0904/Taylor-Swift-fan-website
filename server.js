// 1st thing: check if we're in production or developing environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const stripePubKey = process.env.STRIPE_PUBLIC_KEY
const stripeSecKey = process.env.STRIPE_SECRET_KEY

const express = require('express')
// express is also just a funtion
// to create the server
const app = express()
const fs = require('fs')

app.set('view engine', 'ejs')  // look into views folder for ejs files
// use the pulic folder as our staic file
app.use(express.static('public'))

// route
app.get('/store', function (req, res) {
    fs.readFile('items.json', function (error, data) {
        if (error) {
            res.status(500).end()  // 500: Internal Server Error
        } else {
            // injects your JSON data (passed under the variable name items) directly into that HTML template.
            // send stripePubKey to store.ejs as well
            res.render('store.ejs', {
                stripePubKey: stripePubKey,
                items: JSON.parse(data)
            })
        }
    })
})

app.listen(3000)


