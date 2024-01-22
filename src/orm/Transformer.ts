import { Coins } from '@initia/initia.js'

export class CoinsTrasnformer {
  to(value: Coins): Coins.Data | null {
    if (value === null) {
      return null
    }
    return value.toData()
  }

  from(value: Coins.Data | null): Coins | null {
    if (value === null) {
      return null
    }
    return Coins.fromData(value)
  }
}
