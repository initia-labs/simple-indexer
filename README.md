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
| Name                    | Description                                    | Default                               |
|-------------------------|------------------------------------------------|---------------------------------------|
| SERVER_PORT             | Server port                                    | 3000                                  |
| MONITOR_INTERVAL        | Monitor interval                               | 100                                   |
| LCD_URL                 | LCD URL                                        | 'http://localhost:1317'               |
| RPC_URL                 | RPC URL                                        | 'http://localhost:26657'              |

> We use [dotenv](https://github.com/motdotla/dotenv) for managing environment variable for development. See [sample of .env](.env_sample)

# How to run

### Developement
```bash
npm run dev
```

### Production
```bash
npm run start
```

# API documentation
- Access UI from: `http://localhost:3000/swagger/`
