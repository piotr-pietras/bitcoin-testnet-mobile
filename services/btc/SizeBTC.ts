import { UTXO } from "@/types/global";
import {
  OP_RETURN_HEADER_SIZE,
  OP_RETURN_MAX_SIZE,
  P2PKH_INPUT_SIZE,
  P2PKH_OUTPUT_SIZE,
  P2WPKH_INPUT_SIZE,
  P2WPKH_OUTPUT_SIZE,
} from "./constsBTC";

export class SizeBTC {
  private static calcTxSizeP2pkh = (inLength: number, outLength: number) => {
    const overhead = 11;
    return overhead + P2PKH_INPUT_SIZE * inLength + P2PKH_OUTPUT_SIZE * outLength;
  };

  private static calcTxSizeP2wpkh(inLength: number, outLength: number) {
    const overhead = 11;
    return overhead + P2WPKH_INPUT_SIZE * inLength + P2WPKH_OUTPUT_SIZE * outLength;
  }

  private static calcTxSizeOpReturn(opReturnData: string) {
    return Buffer.from(opReturnData, "utf8").byteLength + OP_RETURN_HEADER_SIZE;
  }

  static isOpReturnDataTooLarge(opReturnData: string) {
    return Buffer.from(opReturnData, "utf8").byteLength > OP_RETURN_MAX_SIZE;
  }

  static calcSendAllAmount(
    type: "p2pkh" | "p2wpkh",
    utxos: UTXO[],
    feeRate: number,
    opReturnData?: string
  ) {
    const size = this.calcTxSize(type, utxos.length, 1, opReturnData);
    return utxos.reduce((p, c) => p + c.value, 0) - size * feeRate;
  }

  static calcTxSize(
    type: "p2pkh" | "p2wpkh",
    inLength: number,
    outLength: number,
    opReturnData?: string
  ) {
    let size = 0;
    if (type === "p2pkh") {
      size = this.calcTxSizeP2pkh(inLength, outLength);
    } else if (type === "p2wpkh") {
      size = this.calcTxSizeP2wpkh(inLength, outLength);
    }

    if (opReturnData) size += this.calcTxSizeOpReturn(opReturnData);

    return size;
  }
}
