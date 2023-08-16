import { BI, Cell, helpers, Indexer } from '@ckb-lumos/lumos';
import { FromInfo } from '@ckb-lumos/common-scripts';
import { Address, Script } from '@ckb-lumos/base';
import { BIish } from '@ckb-lumos/bi';
import { getSporeConfig, SporeConfig } from '../../../config';
import { assetTransactionSkeletonSize } from '../../../helpers';
import { injectCapacityAndPayFee, setCellAbsoluteCapacityMargin } from '../../../helpers';
import { injectNewSporeOutput, injectSporeIds, SporeDataProps } from '../../joints/spore';

export async function createSpore(props: {
  data: SporeDataProps;
  toLock: Script;
  fromInfos: FromInfo[];
  config?: SporeConfig;
  changeAddress?: Address;
  capacityMargin?: BIish;
  maxTransactionSize?: number | false;
  updateOutput?(cell: Cell): Cell;
}): Promise<{
  txSkeleton: helpers.TransactionSkeletonType;
  outputIndex: number;
  cluster?: {
    inputIndex: number;
    outputIndex: number;
  };
}> {
  // Env
  const config = props.config ?? getSporeConfig();
  const indexer = new Indexer(config.ckbIndexerUrl, config.ckbNodeUrl);
  const capacityMargin = BI.from(props.capacityMargin ?? 1_0000_0000);
  const maxTransactionSize = props.maxTransactionSize ?? config.maxTransactionSize ?? false;

  // Get TransactionSkeleton
  let txSkeleton = helpers.TransactionSkeleton({
    cellProvider: indexer,
  });

  // Create and inject a new spore cell, also inject cluster if exists
  const injectNewSporeResult = await injectNewSporeOutput({
    data: props.data,
    toLock: props.toLock,
    updateOutput(cell) {
      if (capacityMargin.gt(0)) {
        cell = setCellAbsoluteCapacityMargin(cell, capacityMargin);
      }
      if (props.updateOutput instanceof Function) {
        cell = props.updateOutput(cell);
      }
      return cell;
    },
    txSkeleton,
    config,
  });
  txSkeleton = injectNewSporeResult.txSkeleton;

  // Inject needed capacity and pay fee
  const injectCapacityAndPayFeeResult = await injectCapacityAndPayFee({
    txSkeleton,
    changeAddress: props.changeAddress,
    fromInfos: props.fromInfos,
    fee: BI.from(0),
    config,
  });
  txSkeleton = injectCapacityAndPayFeeResult.txSkeleton;

  // Generate and inject spore id
  txSkeleton = injectSporeIds({
    outputIndices: [injectNewSporeResult.outputIndex],
    txSkeleton,
    config,
  });

  // Make sure the tx size is in range (if needed)
  if (typeof maxTransactionSize === 'number') {
    assetTransactionSkeletonSize(txSkeleton, void 0, maxTransactionSize);
  }

  return {
    txSkeleton,
    outputIndex: injectNewSporeResult.outputIndex,
    cluster: injectNewSporeResult.cluster,
  };
}
