import { Controller, Get, Param, Query } from '@nestjs/common'
import { IndexerService } from './indexer.service'
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger'

import { BlockEntity, DepositEntity, TxEntity } from 'orm'

@Controller('')
export class IndexerController {
  constructor(private readonly indexerService: IndexerService) {}

  @Get('tx/:txhash')
  @ApiTags('Indexer')
  @ApiOperation({ summary: 'Get Tx' })
  public async getTx(
    @Param('txhash') txhash: string
  ): Promise<TxEntity | null> {
    return this.indexerService.getTx(txhash)
  }

  @Get('block/:height')
  @ApiTags('Indexer')
  @ApiOperation({ summary: 'Get Block' })
  public async getBlock(
    @Param('height') height: number
  ): Promise<BlockEntity | null> {
    return this.indexerService.getBlock(height)
  }

  @Get('deposit_event')
  @ApiTags('Indexer')
  @ApiOperation({ summary: 'Get Block' })
  @ApiQuery({
    name: 'limit',
    required: true,
    description: 'limit',
  })
  @ApiQuery({
    name: 'offset',
    required: true,
    description: 'offset',
  })
  public async getDepsoit(
    @Query('limit') limit: number,
    @Query('offset') offset: number
  ): Promise<DepositEntity[]> {
    return this.indexerService.getDepositEvents(limit, offset)
  }
}
