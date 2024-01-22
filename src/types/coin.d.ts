interface DenomMap {
  [denom: string]: string
}

type DenomMapByValidator = { [validator: string]: DenomMap }
