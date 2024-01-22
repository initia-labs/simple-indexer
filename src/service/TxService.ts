import { TxEntity, getDB } from 'orm'

export interface GetTxListParam {
  height?: number
  offset?: number
  limit: number
}

interface GetTxListResponse {
  count?: number
  next?: number
  limit: number
  txs: TxEntity[]
}

export async function getTxList(
  param: GetTxListParam
): Promise<GetTxListResponse> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    const offset = Number(param.offset) ?? 0
    const limit = Number(param.limit)

    const txQb = queryRunner.manager.createQueryBuilder(TxEntity, 'tx')

    if (param.height) {
      txQb.andWhere('tx.height = :height', { height: param.height })
    }

    const count = await txQb.getCount()

    const txs = await txQb
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
      txs,
    }
  } finally {
    await queryRunner.release()
  }
}
