# ImpactScore

ImpactScore is a full-stack MERN application that enables athletes and sports enthusiasts to leverage their performance to drive real-world charitable impact.

Through a subscription-based model, users submit their activity scores (like golf rounds), which algorithmically determine their chances in monthly prize draws. A portion of all subscription revenue forms the prize pool, while users can independently support vetted charities directly from their dashboards.

## Architecture

The project is structured as a monorepo containing both the client and server applications:

- **/client**: The React frontend (built with Vite, TypeScript, and TailwindCSS).
- **/server**: The Node.js/Express backend API and MongoDB models.

## Technology Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router DOM
- Axios

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for Authentication
- Stripe API (Subscriptions & Direct Checkout)
- Cloudinary (Image Uploads)
- Nodemailer (Automated Emails)

## Prerequisites

- Node.js (v18+)
- MongoDB (Atlas or Local)
- Stripe Account (for payment processing)
- Cloudinary Account (for image uploads)

## Getting Started

### 1. Backend Setup

Navigate to the `server` directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory (use `.env.example` as a template):

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRICE_ID_MONTHLY=your_stripe_monthly_price_id
STRIPE_PRICE_ID_YEARLY=your_stripe_yearly_price_id
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
EMAIL_FROM=ImpactScore <your_email>
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

### 2. Frontend Setup

Navigate to the `client` directory and install dependencies:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

### 3. Admin Initialization

To create an initial admin account, run the seed script:

```bash
cd server
node create-admin.js
```

You can then log into the admin dashboard at `http://localhost:5173/login` using the generated credentials.

## Deployment

### Backend (Render, Heroku, or DigitalOcean)
1. Set the build command to `npm install`
2. Set the start command to `npm start`
3. Ensure all environment variables from your `.env` are configured in the host settings.

### Frontend (Vercel, Netlify)
1. Set the build command to `npm run build`
2. Set the output directory to `dist`
3. Set the `VITE_API_URL` environment variable to point to your live backend URL.

## License

All rights reserved.
