# AWS DynamoDB + JWT + Docker Tutorial Project

A Node.js/Express application demonstrating AWS DynamoDB integration, JWT-based authentication with cookie storage, and Docker containerization.

## 🚀 Features

- **Two DynamoDB tables**
  - `UserCredentials` — used for login and sign-up (keyed by email)
  - `UserTable` (user info) — accessible only after authentication
- **JWT Authentication**
  - Passwords hashed with `bcrypt`
  - JWT issued on login/signup and stored in an HTTP-only cookie
  - Custom `authMiddleware.js` verifies the token and protects routes
- **CRUD on DynamoDB** — authenticated users can create and manage entries via the `/dynamodb` routes
- **Dockerized** — includes a `Dockerfile` for containerized deployment
- **EJS views** with Bootstrap and SweetAlert2 for a simple login/signup/dashboard UI

## 🛠 Tech Stack

- Node.js, Express, EJS
- AWS SDK (`aws-sdk`) — DynamoDB DocumentClient, S3 client configured
- JWT (`jsonwebtoken`) + `bcrypt` for password hashing
- Docker (Node 16 base image)
- Bootstrap, jQuery, SweetAlert2

## 📂 Project Structure

```
Aws_DynamoDb_Jwt_Docker/
├── routes/
│   ├── auth.js          # Login / signup against UserCredentials table
│   ├── dynamodb.js       # Protected CRUD routes for UserTable (JWT-guarded)
│   ├── index.js
│   └── users.js
├── views/
│   ├── login.ejs, signup.ejs
│   ├── dynamodb.ejs      # Dashboard for authenticated DynamoDB operations
│   └── index.ejs
├── aws-config.js         # AWS SDK configuration (DynamoDB + S3 clients)
├── authMiddleware.js     # JWT verification middleware
├── setupTable.js         # Reference script for creating a DynamoDB table via SDK
├── Dockerfile
└── ENV_EXAMPLE.txt
```

## 🔑 Authentication Flow

1. User signs up or logs in via `/auth/login` — credentials checked against the `UserCredentials` DynamoDB table, password verified with `bcrypt`
2. On success, a JWT is generated and stored in an HTTP-only cookie
3. Protected routes under `/dynamodb` use `authMiddleware.js` to verify the token from the cookie (or `Authorization` header) before allowing access
4. Logout clears the cookie

## ▶️ Getting Started

### Prerequisites
- Node.js
- An AWS account with a DynamoDB table set up (see `document/DynamoDBPermission.md` for the required IAM policy)
- Docker (optional, for containerized run)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/devrimsavas/Aws_DynamoDb_Jwt_Docker.git
   cd Aws_DynamoDb_Jwt_Docker
   ```
2. **Configure environment variables** — copy `ENV_EXAMPLE.txt` to `.env`:
   ```env
   AWS_REGION=eu-north-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   TOKEN_SECRET=your_jwt_secret
   ```
3. **Create the DynamoDB tables** in the AWS Console (or adapt `setupTable.js`), with `email` as the partition key
4. **Install dependencies and run**
   ```bash
   npm install
   npm start
   ```

### Run with Docker

```bash
docker build -t aws-dynamodb-jwt .
docker run -p 3000:3000 --env-file .env aws-dynamodb-jwt
```

## 📝 Notes

This is a learning project built to practice integrating a NoSQL AWS database (DynamoDB) with a custom JWT authentication layer, and packaging the result as a Docker container. AWS credentials should always be managed via environment variables or a secrets manager — never committed to source control.
