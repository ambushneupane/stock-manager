# Stock Manager API

A full-featured backend API to track, manage, and analyze stock investments with JWT-based authentication.

## Base URL

```
https://stock-manager-1-80ih.onrender.com
```

---

## 1. User Authentication

### Register User

Create a new user account.

- **Endpoint:** `POST /api/users/register`
- **Request Body:**
```json
{
  "username": "yourname",
  "email": "youremail@example.com",
  "password": "yourpassword"
}
```
- **Curl Example:**
```bash
curl -X POST https://stock-manager-1-80ih.onrender.com/api/users/register \
-H "Content-Type: application/json" \
-d '{"username":"john","email":"john@example.com","password":"123456"}'
```

### Login User

Authenticate user and receive JWT.

- **Endpoint:** `POST /api/users/login`
- **Request Body:**
```json
{
  "email": "youremail@example.com",
  "password": "yourpassword"
}
```
- **Curl Example:**
```bash
curl -X POST https://stock-manager-1-80ih.onrender.com/api/users/login \
-H "Content-Type: application/json" \
-d '{"email":"john@example.com","password":"123456"}'
```

---

## 2. Stock Operations

> All routes below require JWT Authentication. Add the header:  
`-H "Authorization: Bearer <your_token>"`

### Add Stock

```bash
curl -X POST https://stock-manager-1-80ih.onrender.com/api/stocks/add \
-H "Authorization: Bearer <your_token>" \
-H "Content-Type: application/json" \
-d '{"name": "NABIL", "price": 550, "units": 100}'
```

### Update Stock

```bash
curl -X PATCH https://stock-manager-1-80ih.onrender.com/api/stocks/update/<stock_id> \
-H "Authorization: Bearer <your_token>" \
-H "Content-Type: application/json" \
-d '{"price": 600, "units": 150}'
```

### Delete Stock

```bash
curl -X DELETE https://stock-manager-1-80ih.onrender.com/api/stocks/delete/<stock_id> \
-H "Authorization: Bearer <your_token>"
```

### View All Stocks

```bash
curl -X GET https://stock-manager-1-80ih.onrender.com/api/stocks/all \
-H "Authorization: Bearer <your_token>"
```

---

## 3. Selling Stocks

### Sell Stock

```bash
curl -X POST https://stock-manager-1-80ih.onrender.com/api/stocks/sell \
-H "Authorization: Bearer <your_token>" \
-H "Content-Type: application/json" \
-d '{"stockId": "<stock_id>", "unitsSold": 50, "price": 600}'
```

### Sell History

```bash
curl -X GET https://stock-manager-1-80ih.onrender.com/api/stocks/sell-history \
-H "Authorization: Bearer <your_token>"
```

### Sell Summary

```bash
curl -X GET https://stock-manager-1-80ih.onrender.com/api/stocks/sell-summary \
-H "Authorization: Bearer <your_token>"
```

---

## 4. Portfolio Summary & Export

### Portfolio Summary

```bash
curl -X GET https://stock-manager-1-80ih.onrender.com/api/stocks/summary \
-H "Authorization: Bearer <your_token>"
```

### Export to CSV

```bash
curl -X GET https://stock-manager-1-80ih.onrender.com/api/stocks/export/current-stocks/csv \
-H "Authorization: Bearer <your_token>" --output stocks.csv
```
