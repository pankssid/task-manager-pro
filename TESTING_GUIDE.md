# Local Testing Guide 🧪

This guide will walk you through testing the Task Manager Pro application on your local machine, including Stripe payment integration.

## Quick Start Checklist ✅

- [ ] Node.js 18+ installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Stripe account created
- [ ] Environment variables configured
- [ ] Development server running
- [ ] Stripe CLI installed (for webhook testing)

## Step-by-Step Testing Instructions

### 1. Initial Setup (5 minutes)

```bash
# Navigate to project directory
cd /Users/pankaj.yadav/Library/CloudStorage/OneDrive-Sequoia/exp_folder

# Install dependencies
npm install

# Create environment file
cp env.example .env.local
```

### 2. Get Stripe Test Credentials (5 minutes)

1. **Create Stripe Account**
   - Go to https://dashboard.stripe.com/register
   - Sign up with your email
   - Skip business details (just testing)

2. **Get Test API Keys**
   - Click **Developers** in the left sidebar
   - Click **API keys**
   - Toggle **"Viewing test data"** (top right, should be ON)
   - Copy **Publishable key** (starts with `pk_test_`)
   - Click **Reveal test key** for Secret key (starts with `sk_test_`)

3. **Update .env.local**
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx
   STRIPE_SECRET_KEY=sk_test_51xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # We'll get this in step 4
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 3. Start the Application

```bash
# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

### 4. Test Basic Features (Without Payments)

**✅ Test Task Creation (Free Plan)**
1. Click **"Add New Task"**
2. Enter task details:
   - Title: "Test Task 1"
   - Description: "This is a test"
   - Priority: High
3. Click **"Add Task"**
4. ✅ Task should appear in the list

**✅ Test Task Completion**
1. Click the circle checkbox next to a task
2. ✅ Task should show as completed (strikethrough)

**✅ Test Task Editing**
1. Click the blue **Edit** icon (pencil)
2. Change the title or description
3. Click **"Save"**
4. ✅ Task should update

**✅ Test Task Deletion**
1. Click the red **Trash** icon
2. Confirm deletion
3. ✅ Task should be removed

**✅ Test Free Plan Limit**
1. Create 5 tasks
2. Try to create a 6th task
3. ✅ You should see an error: "Free plan limited to 5 tasks"

### 5. Test Stripe Payment (Basic - Without Webhooks)

**✅ Test Checkout Flow**
1. Click **"Upgrade for $9.99/month"** button
2. You should be redirected to Stripe Checkout
3. Use test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/34` (any future date)
   - CVC: `123` (any 3 digits)
   - Name: Your name
   - Zip: `12345` (any 5 digits)
4. Click **"Subscribe"**
5. ✅ You should be redirected back to the app
6. ✅ You should see "Payment successful" alert

**Note**: At this stage, the premium status won't automatically update because we need webhooks (Step 6).

### 6. Test Webhooks (Complete Payment Integration)

This is the most important part for production-ready payment processing!

**Install Stripe CLI**

```bash
# macOS (using Homebrew)
brew install stripe/stripe-cli/stripe

# Windows (using Scoop)
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.0/stripe_1.19.0_linux_x86_64.tar.gz
tar -xvf stripe_1.19.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

**Start Webhook Forwarding**

```bash
# Login to Stripe (will open browser)
stripe login

# Start forwarding webhooks
stripe listen --forward-to localhost:3000/api/webhook
```

You'll see output like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxx (^C to quit)
```

**Update Environment Variable**

1. Copy the webhook secret (`whsec_xxxxx`)
2. Add it to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```
3. **Restart your dev server** (stop with Ctrl+C, then `npm run dev`)

**Test Complete Payment Flow**

1. Keep Stripe CLI running in one terminal
2. In another terminal, run your dev server
3. Go to http://localhost:3000
4. Click **"Upgrade for $9.99/month"**
5. Complete payment with test card: `4242 4242 4242 4242`
6. Watch the Stripe CLI terminal - you should see:
   ```
   --> charge.succeeded
   --> checkout.session.completed
   ```
7. ✅ After redirect, you should see "Premium Member" banner
8. ✅ You can now create unlimited tasks!

### 7. Test Different Payment Scenarios

**Test Declined Card**
- Card: `4000 0000 0000 0002`
- ✅ Payment should be declined with error message

**Test 3D Secure Authentication**
- Card: `4000 0025 0000 3155`
- ✅ Will prompt for authentication, click "Complete"

**Test Insufficient Funds**
- Card: `4000 0000 0000 9995`
- ✅ Should fail with "insufficient funds" error

### 8. Test Premium Features

After successful upgrade:

**✅ Test Unlimited Tasks**
1. Create more than 5 tasks
2. ✅ All should be created without limit

**✅ Test Premium Banner**
1. ✅ Should show "Premium Member" with crown icon
2. ✅ "Upgrade" button should be hidden

### 9. Manual Webhook Testing

You can manually trigger webhooks for testing:

```bash
# Test successful payment event
stripe trigger checkout.session.completed

# Test subscription cancellation
stripe trigger customer.subscription.deleted
```

## Troubleshooting 🔧

### Problem: "Module not found" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: Stripe keys not working

- Verify you're using **test mode** keys (they start with `pk_test_` and `sk_test_`)
- Check there are no extra spaces in `.env.local`
- Restart dev server after updating `.env.local`

### Problem: Webhooks not working

- Ensure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhook`
- Check webhook secret is in `.env.local`
- Restart dev server after adding webhook secret
- Check Stripe CLI terminal for error messages

### Problem: Premium status not updating after payment

- Verify webhook is running
- Check browser console (F12) for errors
- Check server terminal for errors
- Try refreshing the page
- Check Stripe Dashboard → Developers → Events to see if event was sent

### Problem: Can't complete payment

- Use only test card numbers (not real cards!)
- Ensure you're in test mode (Stripe Dashboard should show "Test Mode" toggle)
- Check browser console for errors

### Problem: Port 3000 already in use

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

## Testing Checklist 📋

Before deploying to production, verify:

- [ ] All tasks can be created, edited, deleted, and completed
- [ ] Free plan limit (5 tasks) is enforced
- [ ] Payment checkout flow works
- [ ] Webhooks successfully upgrade users to premium
- [ ] Premium users can create unlimited tasks
- [ ] Test cards work correctly (success and failure scenarios)
- [ ] Webhook events appear in Stripe CLI
- [ ] No console errors in browser or server
- [ ] UI is responsive on mobile devices

## Quick Test Script

Run these commands in sequence for a full test:

```bash
# 1. Install and start
npm install
npm run dev

# 2. In another terminal, start webhooks
stripe login
stripe listen --forward-to localhost:3000/api/webhook

# 3. In browser: http://localhost:3000
# - Create 5 tasks (test free limit)
# - Click upgrade
# - Use card 4242 4242 4242 4242
# - Verify premium upgrade
# - Create 6+ tasks (test unlimited)
```

## Next Steps 🚀

After local testing succeeds:

1. Deploy to Vercel/Netlify
2. Set up production webhook endpoint
3. Switch to live Stripe keys
4. Add real authentication (NextAuth.js, Clerk, etc.)
5. Add a real database (PostgreSQL, MongoDB)
6. Set up email notifications
7. Add analytics tracking

## Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter

# Stripe CLI
stripe login                              # Login to Stripe
stripe listen --forward-to localhost:3000/api/webhook  # Forward webhooks
stripe trigger checkout.session.completed # Test webhook event
stripe logs tail                          # View Stripe logs
stripe events list                        # List recent events
```

## Resources 📚

- [Stripe Testing Cards](https://stripe.com/docs/testing)
- [Stripe CLI Reference](https://stripe.com/docs/cli)
- [Next.js Docs](https://nextjs.org/docs)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)

---

**Need Help?** Check the main README.md for more information or open an issue on GitHub.

Happy Testing! 🎉

