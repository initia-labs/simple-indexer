import { LCDClient } from '@initia/initia.js'
import dotenv from 'dotenv'

dotenv.config()

const { SERVER_PORT, MONITOR_INTERVAL, LCD_URL, RPC_URL } = process.env

export const config = {
  SERVER_PORT: SERVER_PORT ? parseInt(SERVER_PORT) : 3000,
  MONITOR_INTERVAL: MONITOR_INTERVAL ? parseInt(MONITOR_INTERVAL) : 100,
  LCD_URL: LCD_URL ? LCD_URL.split(',') : ['http://localhost:1317'],
  RPC_URL: RPC_URL ? RPC_URL.split(',') : ['http://localhost:26657'],
  lcd: new LCDClient(
    LCD_URL ? LCD_URL.split(',')[0] : 'http://localhost:1317',
    {
      gasPrices: '0.15uinit',
      gasAdjustment: '1.75',
    }
  ),
}
