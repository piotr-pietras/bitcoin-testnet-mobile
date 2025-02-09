import { AddressType, Blockchain, Net } from "@/types/global";
import { networks, payments } from "bitcoinjs-lib";
import ecc from "@bitcoinerlab/secp256k1";
// import * as ecc from "tiny-secp256k1";
// import * as ecc from "@bitcoin-js/tiny-secp256k1-asmjs";
import ECPairFactory, { ECPairInterface } from "ecpair";

export class AccountBTC {
  blockchain: Blockchain = "BTC";
  net: Net;
  type: AddressType;
  static decimals = 8;
  address: string;
  ecPair: ECPairInterface;

  constructor(privKey: Uint8Array, net: Net, type: AddressType) {
    this.net = net;
    this.type = type;
    const network = this.net === "MAIN" ? networks.bitcoin : networks.testnet;

    const ECPair = ECPairFactory(ecc);
    this.ecPair = ECPair.fromPrivateKey(Buffer.from(privKey), { network });

    if (type === "p2pkh") {
      const p2pkh = payments.p2pkh({
        network,
        pubkey: Buffer.from(this.ecPair.publicKey),
      });
      if (!p2pkh.address) throw new Error("Address is not defined correctly.");
      this.address = p2pkh.address;
      return;
    }

    if (type === "p2wpkh") {
      const p2wpkh = payments.p2wpkh({
        network,
        pubkey: Buffer.from(this.ecPair.publicKey),
      });
      if (!p2wpkh.address) throw new Error("Address is not defined correctly.");
      this.address = p2wpkh.address;
      return;
    }

    throw new Error("Address is not defined correctly.");
  }

  public async initizalize() {
    return this;
  }

  public validator(msghash: Uint8Array, signature: Uint8Array): boolean {
    return this.ecPair.verify(Buffer.from(msghash), Buffer.from(signature));
  }
}
