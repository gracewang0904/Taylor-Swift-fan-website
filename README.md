# Taylor Swift Fan Hub
A full-stack e-commerce web application themed around Taylor Swift albums and merchandise. Users can browse products, add items to a shopping cart, and complete a simulated checkout using Stripe's test payment API.

## Features
- Bio of Taylor and her recent marrige on 2026/7/3
- Browse albums and merchandise
- Secure checkout using Stripe
- Product data stored in SQLite
- Server-side rendering with EJS

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript, EJS
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **API:** Stripe API

## Getting Started
1. Install dependencies
```bash
npm install
```

2. Sign up for Stripe
- Please go to https://stripe.com/ and sign up
- Go to Dashboard, at the top search bar search for API keys
- Under Standard keys, you'll find your Publishable key and Secret key

3. Create a `.env` file

```text
STRIPE_PUBLIC_KEY=your_public_key
STRIPE_SECRET_KEY=your_secret_key
```

4. Start the server

```bash
node server.js
```

Open `http://localhost:3000` in your browser.

## What I Learned

- Building RESTful APIs with Express
- Integrating SQLite into a Node.js application
- Using EJS for server-side rendering
- Working with asynchronous JavaScript
- Integrating a third-party payment API (Stripe)

Part of the project was inspired by YouTuber Web Dev Simplified
