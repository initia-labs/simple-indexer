import dotenv from 'dotenv'

dotenv.config()

const { SERVER_PORT, START_HEIGHT, RPC_URL, LOG_LEVEL } = process.env

export const config = {
  logLevel: LOG_LEVEL ? LOG_LEVEL : 'info',
  serverPort: SERVER_PORT ? parseInt(SERVER_PORT) : 3000,
  rpcUrl: RPC_URL ?? 'http://localhost:26657',
  startHeight: START_HEIGHT ? parseInt(START_HEIGHT) : 1,
}
