import { SubscribeUpdateTransaction as GeyserTrx } from "@triton-one/yellowstone-grpc";
import { GeyserClient } from "./geyser";
import { ShrederClient } from "./shreder";
import bs58 from "bs58";
import { SubscribeUpdateTransaction as ShrederTrx } from "@shreder_xyz/grpc-client";

type TrxTimestamp = {
  shrederTimestamp?: number;
  geyserTimestamp?: number;
};
export class Benchmark {
  private signatureMap = new Map<string, TrxTimestamp>();
  constructor(
    private readonly geyserClient: GeyserClient,
    private readonly shrederClient: ShrederClient
  ) {}

  public async perform(time: number) {
    this.geyserClient.onTransaction((trx) => this.onGeyserTransaction(trx));
    this.shrederClient.onTransaction((trx) => this.onShrederTransaction(trx));
    console.log("Starting geyser...");
    this.geyserClient.start();
    console.log("Starting shreder...");
    this.shrederClient.start();
    await new Promise<void>((res) =>
      setTimeout(() => {
        this.geyserClient.stop();
        this.shrederClient.stop();
        res();
      }, time)
    );
  }

  public printReport() {
    let totalTimeDiff = 0;
    let totalTrxAmount = 0;
    this.signatureMap.forEach((time) => {
      if (time.geyserTimestamp && time.shrederTimestamp) {
        const diff = time.geyserTimestamp - time.shrederTimestamp;
        totalTimeDiff += diff;
        totalTrxAmount++;
        return;
      }
    });
    console.log(
      `\n***RESULT***\nAvg Time diff: ${totalTimeDiff / totalTrxAmount}`
    );
  }

  private onGeyserTransaction(trx: GeyserTrx) {
    if (!trx.transaction) {
      return;
    }
    const timestamp = Date.now();
    const signature = bs58.encode(trx.transaction.signature);
    console.log("Geyser got trx: ", signature);
    if (this.signatureMap.has(signature)) {
      const trxTimestamp = this.signatureMap.get(signature)!;
      if (trxTimestamp.geyserTimestamp) {
        // already tracked
        return;
      }
      trxTimestamp.geyserTimestamp = timestamp;
      console.log(
        `Trx time diff for ${signature} is ${
          trxTimestamp.geyserTimestamp - trxTimestamp.shrederTimestamp!
        }`,
        signature
      );
    } else {
      this.signatureMap.set(signature, {
        geyserTimestamp: timestamp,
      });
    }
  }

  private onShrederTransaction(trx: ShrederTrx) {
    if (!trx.transaction) {
      return;
    }
    const timestamp = Date.now();
    const signature = bs58.encode(trx.transaction.signatures[0]);
    console.log("Shreder got trx: ", signature);
    if (this.signatureMap.has(signature)) {
      const trxTimestamp = this.signatureMap.get(signature)!;
      if (trxTimestamp.shrederTimestamp) {
        // already tracked
        return;
      }
      trxTimestamp.shrederTimestamp = timestamp;
      console.log(
        `Trx time diff for ${signature} is ${
          trxTimestamp.geyserTimestamp! - trxTimestamp.shrederTimestamp
        }`,
        signature
      );
    } else {
      this.signatureMap.set(signature, {
        shrederTimestamp: timestamp,
      });
    }
  }
}
