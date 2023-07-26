import { bytes, BytesLike, molecule } from '@ckb-lumos/codec';
import { blockchain } from '@ckb-lumos/base';
import { bufferToRawText } from '../helpers';

export const SporeData = molecule.table(
  {
    contentType: blockchain.Bytes,
    content: blockchain.Bytes,
    clusterId: blockchain.BytesOpt,
  },
  ['contentType', 'content', 'clusterId'],
);

export interface RawSporeData {
  contentType: string;
  content: Parameters<typeof SporeData.pack>[0]['content'];
  clusterId: Parameters<typeof SporeData.pack>[0]['clusterId'];
}

export function packRawSporeData(packable: RawSporeData) {
  return SporeData.pack({
    contentType: bytes.bytifyRawString(packable.contentType),
    content: packable.content,
    clusterId: packable.clusterId,
  });
}

export function unpackToRawSporeData(unpackable: BytesLike): RawSporeData {
  const unpacked = SporeData.unpack(unpackable);
  return {
    contentType: bufferToRawText(unpacked.contentType),
    content: unpacked.content,
    clusterId: unpacked.clusterId,
  };
}