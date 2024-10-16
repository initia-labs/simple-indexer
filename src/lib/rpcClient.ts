import Axios, { AxiosInstance } from 'axios'
import { Responses } from '@cosmjs/tendermint-rpc/build/comet38/adaptor/responses'

import * as http from 'http'
import * as https from 'https'
import { JsonRpcSuccessResponse } from '@cosmjs/json-rpc'
import { AxiosHeaders } from 'axios'

// Use custom rpc client instead of comet38Client to set keepAlive option
export class RPCClient {
  public axios: AxiosInstance
  public baseUri: string
  constructor(rpcUri: string) {
    this.axios = Axios.create({
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      timeout: 60000,
      headers: {
        Accept: 'application/json',
      },
    })
    this.baseUri = rpcUri
  }

  public async blockResults(height: number) {
    const rawResponse: JsonRpcSuccessResponse = await this.get(
      'block_results',
      {
        height,
      }
    )
    return Responses.decodeBlockResults(rawResponse)
  }

  public async queryLatestHeight() {
    const rawResponse: JsonRpcSuccessResponse = await this.get('abci_info')

    const abciInfo = Responses.decodeAbciInfo(rawResponse)

    if (!abciInfo.lastBlockHeight) {
      throw Error('Can not get last block height')
    }
    const height = abciInfo.lastBlockHeight
    return Number(height)
  }

  public async block(height: number) {
    const rawResponse: JsonRpcSuccessResponse = await this.get('block', {
      height,
    })

    return Responses.decodeBlock(rawResponse)
  }

  private computeEndpoint(endpoint: string) {
    const url = new URL(this.baseUri)

    url.pathname === '/'
      ? (url.pathname = endpoint)
      : (url.pathname += endpoint)

    return url.toString()
  }

  private get(endpoint: string, params: APIParams = {}) {
    const url = this.computeEndpoint(endpoint)
    return this.axios
      .get(url, { params, headers: new AxiosHeaders() })
      .then((d) => d.data)
  }
}

type APIParams = Record<string, string | number | null | undefined>
