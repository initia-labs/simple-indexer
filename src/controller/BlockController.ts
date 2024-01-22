import { Context } from 'koa'
import { KoaController, Get, Controller } from 'koa-joi-controllers'
import { routeConfig, z } from 'koa-swagger-decorator'
import { success } from 'lib/response'
import { getBlockList } from 'service'

@Controller('')
export class BlockController extends KoaController {
  @routeConfig({
    method: 'get',
    path: '/blocks',
    summary: 'Get blocks',
    tags: ['Block'],
    operationId: 'getBlocks',
    request: {
      query: z.object({
        height: z.number(),
        limit: z
          .number()
          .default(20)
          .refine((value) => [10, 20, 100, 500].includes(value), {
            message: 'Invalid limit value',
          }),
        offset: z.number().optional().default(0),
      }),
    },
  })
  @Get('/blocks')
  async getBlocks(cblock: Context): Promise<void> {
    const blockList = await getBlockList(cblock.query as any)
    success(cblock, blockList)
  }
}
