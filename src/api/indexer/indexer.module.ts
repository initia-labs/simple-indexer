import { Module } from '@nestjs/common'
import { IndexerController } from './indexer.controller'
import { IndexerService } from './indexer.service'

@Module({
  providers: [IndexerService],
  controllers: [IndexerController],
})
export class IndexerModule {}
