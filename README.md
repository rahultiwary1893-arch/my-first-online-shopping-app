# Simple Shop — Mobile (Expo) + Backend

What it is
- Mobile app: Expo / React Native
- Backend: Node + Express + SQLite
- Guest checkout (mocked): app posts order to backend; backend saves order to SQLite.

Quick setup

1) Backend
- cd backend
- npm install
- npm run seed   # creates shop.db and seeds products
- npm start      # server runs on http://localhost:4000

2) Mobile app (Expo)
- cd mobile
- npm install
- npx expo start
- Open in an emulator or Expo Go on a device.

Important note about API URL
- The mobile app uses `mobile/api.js` with API_BASE set to `http://localhost:4000/api`.
- For real devices or some emulators you must change this to your machine IP:
  - e.g. "http://192.168.1.12:4000/api"
  - Android emulator (AVD) can use `http://10.0.2.2:4000/api`
  - iOS simulator typically can use `http://localhost:4000/api`

What it does
- Lists seeded products from backend
- Add/remove/update quantities in cart (persisted with AsyncStorage)
- Checkout calls backend POST /api/checkout to save an order (mocked payment)
- You can fetch saved orders using GET /api/orders/:id

Next steps you might want
- Add simple order confirmation screen with order lookup
- Replace mocked checkout with a real provider (Stripe) later
- Add authentication / order history per user
- Improve validation and error handling
