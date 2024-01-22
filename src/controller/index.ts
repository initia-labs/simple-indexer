import { KoaController } from 'koa-joi-controllers'
import { TxController } from './TxController'
import { BlockController } from './BlockController'

const controllers = [TxController, BlockController]
  .map((prototype) => {
    const controller = new prototype()
    return controller
  })
  .filter(Boolean) as KoaController[]

export default controllers
