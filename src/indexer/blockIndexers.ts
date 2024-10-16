import { BlockResponse } from '@cosmjs/tendermint-rpc/build/comet38'
import { BlockEntity } from 'orm'
import { EntityManager } from 'typeorm'

// save tx
export async function saveBlock(manager: EntityManager, block: BlockResponse) {
  const repo = manager.getRepository(BlockEntity)

  const blockEntity: BlockEntity = {
    height: block.block.header.height,
    version: block.block.header.version,
    hash: Buffer.from(block.block.header.appHash).toString('base64'),
    time: new Date(block.block.header.time.toISOString()),
    last_block_id: block.block.header.lastBlockId
      ? {
          hash: Buffer.from(block.block.header.lastBlockId.hash).toString(
            'base64'
          ),
          parts: {
            total: block.block.header.lastBlockId.parts.total,
            hash: Buffer.from(
              block.block.header.lastBlockId.parts.hash
            ).toString('base64'),
          },
        }
      : null,
    last_commit_hash: Buffer.from(block.block.header.lastCommitHash).toString(
      'base64'
    ),
    data_hash: Buffer.from(block.block.header.dataHash).toString('base64'),
    validators_hash: Buffer.from(block.block.header.validatorsHash).toString(
      'base64'
    ),
    next_validators_hash: Buffer.from(
      block.block.header.nextValidatorsHash
    ).toString('base64'),
    consensus_hash: Buffer.from(block.block.header.consensusHash).toString(
      'base64'
    ),
    app_hash: Buffer.from(block.block.header.appHash).toString('base64'),
    last_results_hash: Buffer.from(block.block.header.lastResultsHash).toString(
      'base64'
    ),
    evidence_hash: Buffer.from(block.block.header.evidenceHash).toString(
      'base64'
    ),
    proposer_address: Buffer.from(block.block.header.proposerAddress).toString(
      'base64'
    ),
  }
  await repo.save(blockEntity)
}
