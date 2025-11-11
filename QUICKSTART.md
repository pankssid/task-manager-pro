# Quick Start Guide ⚡

Get your Task Manager Pro running in under 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Stripe (Get Free Test Keys)

1. Go to https://dashboard.stripe.com/register
2. Sign up (takes 1 minute)
3. Click **Developers** → **API keys**
4. Copy the **Publishable key** (pk_test_...)
5. Click **Reveal test key** and copy **Secret key** (sk_test_...)

## 3. Create Environment File

```bash
# Copy the example file
cp env.example .env.local
```

Edit `.env.local` and paste your keys:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_temp  # We'll update this later
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Start the App

```bash
npm run dev
```

Open http://localhost:3000 🎉

## 5. Try It Out!

### Test Basic Features:
- ✅ Create tasks (up to 5 on free plan)
- ✅ Mark tasks complete
- ✅ Edit and delete tasks

### Test Payments (Optional):
1. Click **"Upgrade for $9.99/month"**
2. Use test card: `4242 4242 4242 4242`
3. Expiry: `12/34` | CVC: `123` | Zip: `12345`
4. Complete payment ✅

**Note**: For premium upgrade to work automatically, you need webhooks (see below).

## 6. Enable Webhooks (For Full Functionality)

This makes the premium upgrade work automatically!

```bash
# Install Stripe CLI (macOS)
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Start webhook forwarding (keep this running)
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the webhook secret (whsec_...) and add it to `.env.local`, then restart the app.

Now payments will automatically upgrade users to premium! 🚀

## Common Issues

**"Module not found"**: Run `npm install`

**Stripe keys don't work**: Make sure they start with `pk_test_` and `sk_test_`

**Can't start server**: Kill existing process: `lsof -ti:3000 | xargs kill -9`

## Next Steps

- 📖 Read [README.md](./README.md) for full documentation
- 🧪 See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed testing
- 🚀 Deploy to Vercel when ready

---

**That's it! You're ready to go! 🎊**

Need help? Check the README or Stripe docs.


