# Fan Wallet

A self-custodial fan payment platform prototype (frontend-only demo, no real crypto/backend yet).

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL it prints — usually **http://localhost:5173**

That's it. Data (wallet, balance, transactions, tickets, splits) is saved in your
browser's localStorage, so it'll still be there next time you open the app in the
same browser.

## Reset your data

Open the browser dev tools console on the app's tab and run:

```js
localStorage.removeItem("fanwallet:v1:state")
```

then refresh the page.

## Build for production

```bash
npm run build
npm run preview   # serves the production build locally to check it
```

The `dist/` folder that `npm run build` produces is what you'd deploy (e.g. to
Vercel, Netlify, or any static host).

## Notes

- This is a **frontend prototype**: wallet creation, sending, and receiving are
  simulated in the browser. It does not use real cryptography or a real backend,
  and does not integrate the actual Tether Wallet Development Kit yet.
- No backend/database is included. Everything lives in the browser's localStorage.
