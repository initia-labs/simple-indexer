import { BlockEntity, getDB } from 'orm'

export interface GetBlockListParam {
  height?: number
  offset?: number
  limit: number
}

interface GetBlockListResponse {
  count?: number
  next?: number
  limit: number
  blocks: BlockEntity[]
}

export async function getBlockList(
  param: GetBlockListParam
): Promise<GetBlockListResponse> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    const offset = Number(param.offset) ?? 0
    const limit = Number(param.limit)

    const blockQb = queryRunner.manager.createQueryBuilder(BlockEntity, 'block')

    if (param.height) {
      blockQb.andWhere('block.height = :height', { height: param.height })
    }

    const count = await blockQb.getCount()

    const blocks = await blockQb
      .skip(offset * limit)
      .take(limit)
      .getMany()

    let next: number | undefined

    if (count > (offset + 1) * limit) {
      next = offset + 1
    }

    return {
      limit: param.limit,
      next,
      blocks,
    }
  } finally {
    await queryRunner.release()
  }
}
