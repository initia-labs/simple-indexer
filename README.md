# Simple Indexer

This is a simple indexer for initia.

# Project setup

### 1. Clone

```bash
$ git clone https://github.com/initia-labs/simple-indexer.git
```

### 2. Install packages

```bash
npm install
```

### 3. Setup the database

Simple-indexer requires PostgreSQL as a backend database and [TypeORM](https://github.com/typeorm/typeorm) as an ORM.

### 4. Configure Environment Variables

| Name           | Description           | Default                  |
| -------------- | --------------------- | ------------------------ |
| SERVER_PORT    | Server port           | 3000                     |
| START_HEIGHT   | Indexing start height | 1                        |
| LOG_LEVEL      | Log level             |                          |
| RPC_URL        | RPC URL               | 'http://localhost:26657' |
| THROTTLE_TTL   | api throttle ttl      |                          |
| THROTTLE_LIMIT | api throttle limit    |                          |

> We use [dotenv](https://github.com/motdotla/dotenv) for managing environment variable for development. See [sample of .env](.env_sample)

# How to run

### Development

```bash
npm run dev
```

### Production

```bash
npm run start
```

# API documentation

- Access UI from: `http://localhost:3000/swagger/`
