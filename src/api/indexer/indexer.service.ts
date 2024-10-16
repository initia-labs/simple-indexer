import { Injectable } from '@nestjs/common'
import { BlockEntity, DepositEntity, TxEntity, getDB } from 'orm'

@Injectable()
export class IndexerService {
  async getTx(txhash: string): Promise<TxEntity | null> {
    const repo = getDB()[0].getRepository(TxEntity)

    return repo.findOne({
      where: { txhash },
    })
  }

  async getBlock(height: number): Promise<BlockEntity | null> {
    const repo = getDB()[0].getRepository(BlockEntity)

    return repo.findOne({
      where: { height },
    })
  }

  async getDepositEvents(
    limit: number,
    offset: number
  ): Promise<DepositEntity[]> {
    const repo = getDB()[0].getRepository(DepositEntity)

    return repo.find({
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    })
  }
}
