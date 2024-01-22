import { Context } from 'koa'
import { KoaController, Get, Controller } from 'koa-joi-controllers'
import { routeConfig, z } from 'koa-swagger-decorator'
import { success } from 'lib/response'
import { getTxList } from 'service'

@Controller('')
export class TxController extends KoaController {
  @routeConfig({
    method: 'get',
    path: '/txs',
    summary: 'Get txs',
    tags: ['Tx'],
    operationId: 'getTxs',
    request: {
      query: z.object({
        height: z.number().optional(),
        limit: z
          .number()
          .default(20)
          .refine((value) => [10, 20, 100, 500].includes(value), {
            message: 'Invalid limit value',
          }),
        offset: z.number().optional().default(0),
        descending: z.boolean().optional().default(false),
      }),
    },
  })
  @Get('/txs')
  async getTxs(ctx: Context): Promise<void> {
    const txList = await getTxList(ctx.query as any)
    success(ctx, txList)
  }
}
