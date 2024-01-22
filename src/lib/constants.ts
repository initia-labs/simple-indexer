export const INIT_BECH32_REGEX = /^init1(?:[a-z0-9]){38}/
export const INIT_HEX_REGEX = /0x(?:[a-f1-9][a-f0-9]*){1,64}/
export const INIT_ACCOUNT_REGEX = new RegExp(
  INIT_BECH32_REGEX.source + '|' + INIT_HEX_REGEX.source
)
export const INIT_OPERATOR_ADD_REGEX = /^initvaloper1[a-z0-9]{38}$/
export const BASE_64_REGEX =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
export const CHAIN_ID_REGEX = /^[a-zA-Z0-9-]{1,32}$/
