# Task Manager Pro 🎯

A modern, full-featured task management web application with Stripe payment integration for premium features.

## Features ✨

### Free Plan
- Create up to 5 tasks
- Mark tasks as complete/incomplete
- Edit and delete tasks
- Priority levels (Low, Medium, High)
- Beautiful, responsive UI
- Dark mode support

### Premium Plan ($9.99/month)
- ✅ Unlimited tasks
- ✅ Priority support
- ✅ Advanced filters
- ✅ Task analytics
- ✅ All future features

## Tech Stack 🛠️

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Payments**: Stripe
- **State Management**: React Hooks
- **Storage**: In-memory (demo) - can be replaced with database

## Getting Started 🚀

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Stripe account (for payment integration)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd /Users/pankaj.yadav/Library/CloudStorage/OneDrive-Sequoia/exp_folder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp env.example .env.local
   ```

   Then edit `.env.local` with your Stripe keys:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Testing Stripe Payments Locally 🧪

### Step 1: Get Your Stripe Test Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Sign up or log in
3. Navigate to **Developers** → **API Keys**
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Copy your **Secret key** (starts with `sk_test_`)
6. Add these to your `.env.local` file

### Step 2: Test the Payment Flow

1. Click the **"Upgrade for $9.99/month"** button
2. You'll be redirected to Stripe Checkout
3. Use Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Requires Auth**: `4000 0025 0000 3155`
4. Use any future expiry date (e.g., 12/34)
5. Use any 3-digit CVC (e.g., 123)
6. Use any valid ZIP code (e.g., 12345)

### Step 3: Testing Webhooks Locally

Stripe webhooks notify your app when payments succeed. To test locally:

1. **Install Stripe CLI**
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe**
   ```bash
   stripe login
   ```

3. **Forward webhooks to your local server**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

4. **Copy the webhook signing secret**
   
   The CLI will display something like:
   ```
   Ready! Your webhook signing secret is whsec_xxxxx
   ```
   
   Add this to your `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

5. **Restart your dev server**
   ```bash
   npm run dev
   ```

6. **Test a payment**
   
   Complete a test payment. The webhook will:
   - Receive the payment confirmation
   - Upgrade the user to premium
   - You'll see the event in the Stripe CLI terminal

### Step 4: Verify Premium Upgrade

After successful payment:
1. You'll be redirected back to the app
2. The banner will change to show "Premium Member"
3. You can now create unlimited tasks

## Project Structure 📁

```
exp_folder/
├── app/
│   ├── api/
│   │   ├── tasks/
│   │   │   ├── route.ts           # GET & POST tasks
│   │   │   └── [id]/route.ts      # PATCH & DELETE task
│   │   ├── user/route.ts           # User management
│   │   ├── create-checkout-session/route.ts  # Stripe checkout
│   │   └── webhook/route.ts        # Stripe webhooks
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main page
├── components/
│   ├── AddTaskForm.tsx             # Task creation form
│   ├── TaskList.tsx                # Task list display
│   └── PremiumBanner.tsx           # Premium upgrade banner
├── lib/
│   ├── types.ts                    # TypeScript interfaces
│   └── storage.ts                  # In-memory data storage
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── env.example                     # Environment variables template
└── README.md
```

## API Endpoints 📡

### Tasks
- `GET /api/tasks` - Get all tasks for user
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### User
- `GET /api/user` - Get user info
- `PATCH /api/user` - Update user info

### Stripe
- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/webhook` - Handle Stripe webhooks

## Common Issues & Solutions 🔧

### Issue: Stripe keys not working

**Solution**: Make sure you're using **test mode** keys (they start with `pk_test_` and `sk_test_`)

### Issue: Webhooks not receiving events

**Solution**: 
1. Make sure Stripe CLI is running (`stripe listen --forward-to localhost:3000/api/webhook`)
2. Verify webhook secret is in `.env.local`
3. Restart your dev server after adding the secret

### Issue: Premium status not updating

**Solution**: 
1. Check browser console for errors
2. Verify webhook received the event (check Stripe CLI output)
3. Try refreshing the page

### Issue: "Module not found" errors

**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

## Deploying to Production 🌐

### 1. Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.

### 2. Set up production webhook

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your production URL: `https://yourdomain.com/api/webhook`
4. Select events: `checkout.session.completed`, `customer.subscription.deleted`
5. Copy the signing secret to your production environment variables

### 3. Use production Stripe keys

Replace test keys with live keys in production environment.

## Upgrading to a Real Database 💾

The app currently uses in-memory storage. For production, replace `lib/storage.ts` with:

- **PostgreSQL** (with Prisma)
- **MongoDB** (with Mongoose)
- **Supabase**
- **Firebase**

## Adding Authentication 🔐

To add real user authentication:

1. Install NextAuth.js or Clerk
2. Replace hardcoded `userId` with actual user session
3. Protect API routes with authentication middleware
4. Store Stripe customer ID with user profile

## Test Card Numbers 💳

| Scenario | Card Number | Behavior |
|----------|-------------|----------|
| Success | 4242 4242 4242 4242 | Payment succeeds |
| Decline | 4000 0000 0000 0002 | Card declined |
| Auth Required | 4000 0025 0000 3155 | Requires 3D Secure |
| Insufficient Funds | 4000 0000 0000 9995 | Insufficient funds |

Use any future date for expiry, any 3 digits for CVC.

## Support & Resources 📚

- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## License 📄

MIT License - feel free to use this project for learning or commercial purposes.

## Contributing 🤝

Contributions are welcome! Feel free to submit issues or pull requests.

---

**Happy Task Managing! 🎉**

