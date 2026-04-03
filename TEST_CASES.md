# API Test Cases
## Project: Fraud Enrichment Pipeline – Fraud Prevention Gateway

### Tester
Saloni Sharma

---

## Test Case 1: Valid Transaction Request

API Endpoint: /fraud/check  
Method: POST

Input:
{
  "userId": "123",
  "transactionId": "txn001",
  "amount": 5000
}

Expected Result:
Request should be processed successfully and return fraud evaluation result.

---

## Test Case 2: Missing User ID

API Endpoint: /fraud/check  
Method: POST

Input:
{
  "transactionId": "txn002",
  "amount": 5000
}

Expected Result:
System should return validation error.

---

## Test Case 3: Invalid Transaction ID

API Endpoint: /fraud/check  
Method: POST

Input:
{
  "userId": "123",
  "transactionId": "",
  "amount": 5000
}

Expected Result:
System should return invalid transaction ID error.

---

## Test Case 4: Large Transaction Amount

API Endpoint: /fraud/check  
Method: POST

Input:
{
  "userId": "123",
  "transactionId": "txn004",
  "amount": 1000000
}

Expected Result:
System should flag transaction as suspicious.
