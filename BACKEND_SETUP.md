# Backend Connection Setup Guide

## Step 1: Create .env file in your frontend (ggadmin folder)

Create a file named `.env` in the root of your ggadmin folder with:

```
REACT_APP_API_URL=http://localhost:5000
```

**Note:** Change the port `5000` to match your backend port if different.

---

## Step 2: Update CORS in your backend

Open `C:\Users\Macharia\Documents\GGbackend\server.js` and update the CORS configuration:

### Find this code (around line 22-27):
```javascript
app.use(
  cors({
    origin: "https://mockgg4.vercel.app", // your frontend domain
    credentials: true,
  })
);
```

### Replace it with:
```javascript
app.use(
  cors({
    origin: ["https://mockgg4.vercel.app", "http://localhost:3001", "http://localhost:3000"], 
    credentials: true,
  })
);
```

This allows your local frontend (running on port 3001 or 3000) to connect to the backend.

---

## Step 3: Start your backend server

1. Open a terminal in `C:\Users\Macharia\Documents\GGbackend`
2. Run: `npm start` or `node server.js`
3. Make sure it's running on the correct port (check console output)

---

## Step 4: Test the connection

1. Your frontend is already running on http://localhost:3001
2. Go to the "Add" page
3. Fill in the form and submit
4. If everything is connected properly, you'll see a success message!

---

## Troubleshooting

### If you get CORS errors:
- Make sure you updated the backend CORS settings (Step 2)
- Restart your backend server after updating

### If you get "Failed to add product" error:
- Check that your backend is running
- Verify the port in `.env` matches your backend port
- Check the browser console (F12) for detailed error messages

### If images don't display in the List page:
- Make sure your backend `Uploads` folder exists
- Check that images are being saved in the Uploads folder

---

## How it works

1. **Add Product**: Form data is sent to `http://localhost:5000/api/food/add`
2. **List Products**: Data is fetched from `http://localhost:5000/api/food/list`
3. **Delete Product**: Delete request sent to `http://localhost:5000/api/food/remove`
4. **Images**: Served from `http://localhost:5000/images/[filename]`

---

## Features Implemented

✅ Add products with image upload
✅ Automatic "KSH" prefix for prices
✅ List all products with beautiful cards
✅ Delete products with confirmation
✅ Image preview on upload
✅ Loading states and animations
✅ Toast notifications for success/errors
✅ Fully responsive design

