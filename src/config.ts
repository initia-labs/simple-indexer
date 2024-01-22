import { LCDClient } from '@initia/initia.js'
import dotenv from 'dotenv'

dotenv.config()

const { SERVER_PORT, L1_LCD_URL, L1_RPC_URL } = process.env

export const config = {
  SERVER_PORT: SERVER_PORT ? parseInt(SERVER_PORT) : 6000,
  L1_LCD_URL: L1_LCD_URL ? L1_LCD_URL.split(',') : ['http://localhost:1317'],
  L1_RPC_URL: L1_RPC_URL ? L1_RPC_URL.split(',') : ['http://localhost:26657'],
  l1lcd: new LCDClient(
    L1_LCD_URL ? L1_LCD_URL.split(',')[0] : 'http://localhost:1317',
    {
      gasPrices: '0.15uinit',
      gasAdjustment: '1.75',
    }
  ),
}

export const INTERVAL_MONITOR = 100
