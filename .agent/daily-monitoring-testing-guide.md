# Daily Monitoring - Testing Guide

## 🧪 How to Test the Feature

### Prerequisites
- ✅ Backend server running on `http://localhost:5000`
- ✅ Frontend running on `http://localhost:5173`
- ✅ User logged in (valid JWT token)

---

## Step-by-Step Testing

### 1. Navigate to Daily Monitoring Page
```
URL: http://localhost:5173/daily-monitoring
```

### 2. Fill Out the Forms

#### Sleep Form
- Drag the slider to set hours (0-12)
- Click an emoji to rate sleep quality (1-5)

#### Water Form
- Click + or - buttons to adjust water intake
- Visual indicator shows fill level

#### Meal Form
- Toggle Taken/Skipped for each meal:
  - Breakfast
  - Lunch
  - Dinner

#### Mood Form
- Select mood emoji (1-5 scale)
- Optionally add notes in textarea

#### Vitals Form
- Enter Blood Sugar (mg/dL)
- Enter Blood Pressure (format: 120/80)
- Enter Weight (kg)

#### Symptoms Form
- Drag severity slider (0-5)
- Optionally describe symptoms

### 3. Submit
- Click "Save Today's Check-In" button
- Button shows "Saving..." during submission
- On success: Alert + redirect to dashboard
- On error: Error message displayed

---

## 🔍 Backend Verification

### Check MongoDB
```javascript
// In MongoDB Compass or shell
db.dailymonitorings.find({ userId: "YOUR_USER_ID" }).sort({ date: -1 })
```

### Test API Endpoints Directly

#### Create Entry
```bash
curl -X POST http://localhost:5000/api/daily-monitoring/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "date": "2025-11-22T00:00:00.000Z",
    "sleep": { "hours": 7, "quality": 4 },
    "water": { "liters": 8 },
    "meals": { "breakfast": true, "lunch": true, "dinner": false },
    "mood": { "score": 4, "note": "Good day" },
    "vitals": { "sugar": 110, "bpHigh": 120, "bpLow": 80, "weight": 75 },
    "symptoms": { "severity": 2, "note": "Minor headache" }
  }'
```

#### Get History
```bash
curl http://localhost:5000/api/daily-monitoring/history?limit=10 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Today's Entry
```bash
curl http://localhost:5000/api/daily-monitoring/today \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🐛 Common Issues & Solutions

### Issue: "Error saving log"
**Solution**: Check if backend server is running and MongoDB is connected

### Issue: Redirect to login
**Solution**: User session expired, login again

### Issue: BP validation error
**Solution**: Ensure BP format is "XXX/XX" (e.g., 120/80)

### Issue: Data not saving
**Solution**: Check browser console for errors, verify JWT token is valid

---

## ✅ Expected Behavior

1. **Form Interaction**: All inputs should be responsive and update state
2. **Validation**: Numbers should be properly parsed
3. **Loading State**: Button shows "Saving..." during submission
4. **Success**: Alert shows "Daily Log Saved Successfully!"
5. **Navigation**: Auto-redirect to /dashboard after success
6. **Error Handling**: Clear error messages if something fails

---

## 📊 Sample Test Data

```javascript
{
  sleep: { hours: 7.5, quality: 4 },
  water: { liters: 8 },
  meals: { breakfast: true, lunch: true, dinner: true },
  mood: { score: 5, note: "Excellent day!" },
  vitals: { sugar: 95, bpHigh: 118, bpLow: 78, weight: 72.5 },
  symptoms: { severity: 0, note: "No symptoms" }
}
```

---

## 🎯 Success Criteria

- ✅ All form components render correctly
- ✅ State updates on user interaction
- ✅ Data submits successfully to backend
- ✅ Entry saved in MongoDB
- ✅ User redirected to dashboard
- ✅ No console errors
- ✅ Proper error handling on failures

Happy Testing! 🚀
