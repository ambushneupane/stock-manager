# Stock Manager API

A full-featured backend API to track, manage, and analyze stock investments with JWT-based authentication.

---

## Authentication

All endpoints require authentication with a JWT.  
Add the following header in all requests:

```bash
-H "Authorization: Bearer <your_token>"
```

---

##  Stock Operations

###  Add Stock

Add a new stock to your portfolio.

```bash
curl -X POST http://localhost:3000/api/stocks/add \
-H "Authorization: Bearer <your_token>" \
-H "Content-Type: application/json" \
-d '{"name": "NABIL", "price": 550, "units": 100}'
```

###  Update Stock

Update stock price or units using its ID.

```bash
curl -X PATCH http://localhost:3000/api/stocks/update/<stock_id> \
-H "Authorization: Bearer <your_token>" \
-H "Content-Type: application/json" \
-d '{"price": 600, "units": 150}'
```

### Delete Stock

Delete a stock by its ID.

```bash
curl -X DELETE http://localhost:3000/api/stocks/delete/<stock_id> \
-H "Authorization: Bearer <your_token>"
```

###  View All Stocks

Get all current stocks for the user.

```bash
curl -X GET http://localhost:3000/api/stocks/all \
-H "Authorization: Bearer <your_token>"
```

---

##  Selling Stocks

###  Sell Stock

Sell units of a stock.

```bash
curl -X POST http://localhost:3000/api/stocks/sell \
-H "Authorization: Bearer <your_token>" \
-H "Content-Type: application/json" \
-d '{"stockId": "<stock_id>", "unitsSold": 50, "price": 600}'
```

###  Sell History

Get history of all sell transactions.

```bash
curl -X GET http://localhost:3000/api/stocks/sell-history \
-H "Authorization: Bearer <your_token>"
```

### Sell Summary

Get total units sold, revenue, and net gain/loss.

```bash
curl -X GET http://localhost:3000/api/stocks/sell-summary \
-H "Authorization: Bearer <your_token>"
```

---

##  Summary & Export

###  Portfolio Summary

View portfolio stats like total investment, value, and profit/loss.

```bash
curl -X GET http://localhost:3000/api/stocks/summary \
-H "Authorization: Bearer <your_token>"
```

###  Export to CSV

Download current stock data in CSV format.

```bash
curl -X GET http://localhost:3000/api/stocks/export/current-stocks/csv \
-H "Authorization: Bearer <your_token>" --output stocks.csv
```

# User Authentication API – README

## 1. Register User
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
curl -X POST http://localhost:3000/api/users/register \
-H "Content-Type: application/json" \
-d '{"username":"john","email":"john@example.com","password":"123456"}'
```

## 2. Login User
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
curl -X POST http://localhost:3000/api/users/login \
-H "Content-Type: application/json" \
-d '{"email":"john@example.com","password":"123456"}'
```

## 3. Forgot Password
- **Endpoint:** `POST /api/users/forgot-password`
- **Request Body:**
```json
{
  "email": "youremail@example.com"
}
```
- **Curl Example:**
```bash
curl -X POST http://localhost:3000/api/users/forgot-password \
-H "Content-Type: application/json" \
-d '{"email":"john@example.com"}'
```

## 4. Reset Password
- **Endpoint:** `POST /api/users/reset-password/:token`
- **Request Body:**
```json
{
  "password": "newpassword"
}
```
- **Curl Example:**
```bash
curl -X POST http://localhost:3000/api/users/reset-password/<token> \
-H "Content-Type: application/json" \
-d '{"password":"newpassword"}'
```
