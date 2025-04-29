import Client, {
  CommitmentLevel,
  SubscribeRequest,
  SubscribeUpdate,
  SubscribeUpdateTransaction,
} from "@triton-one/yellowstone-grpc";
import { ClientDuplexStream } from "@grpc/grpc-js";

type OnTransactionCallback = (data: SubscribeUpdateTransaction) => void;

export class GeyserClient {
  private client: Client;
  private stream?: ClientDuplexStream<SubscribeRequest, SubscribeUpdate>;
  private onTransactionCallback?: OnTransactionCallback;

  constructor(url: string, token?: string) {
    this.client = new Client(url, token, {});
  }

  public onTransaction(onTransactionCallback: OnTransactionCallback) {
    this.onTransactionCallback = onTransactionCallback;
  }

  public async start() {
    this.stream = await this.client.subscribe();
    const request = this.createRequest();
    await this.sendSubscribeRequest(this.stream, request);
    this.stream.on("data", (data: SubscribeUpdate) => {
      if (this.onTransactionCallback && data.transaction) {
        this.onTransactionCallback(data.transaction);
      }
    });
    return this.handleStreamEvents(this.stream).catch((error) =>
      console.log(error)
    );
  }

  public stop() {
    this.stream?.removeAllListeners();
    this.stream?.end();
  }

  private createRequest(): SubscribeRequest {
    return {
      accounts: {},
      blocks: {},
      blocksMeta: {},
      entry: {},
      slots: {},
      transactionsStatus: {},
      accountsDataSlice: [],
      transactions: {
        pumpfun: {
          accountInclude: [],
          accountExclude: [],
          accountRequired: ["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"],
        },
      },
      commitment: CommitmentLevel.PROCESSED,
    };
  }

  private async sendSubscribeRequest(
    stream: ClientDuplexStream<SubscribeRequest, SubscribeUpdate>,
    request: SubscribeRequest
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const status = stream.write(request, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private async handleStreamEvents(
    stream: ClientDuplexStream<SubscribeRequest, SubscribeUpdate>
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      stream.on("error", (error: Error) => {
        console.error("Stream error:", error);
        reject(error);
        stream.end();
      });
      stream.on("end", () => {
        console.log("Stream ended");
        resolve();
      });
      stream.on("close", () => {
        console.log("Stream closed");
        resolve();
      });
    });
  }
}
