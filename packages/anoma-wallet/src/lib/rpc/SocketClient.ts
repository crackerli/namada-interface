import { toBase64 } from "@cosmjs/encoding";
import { WebsocketClient } from "@cosmjs/tendermint-rpc";
import RpcClientBase from "./RpcClientBase";
import { createJsonRpcRequest } from "utils/helpers";
import { TxResponse } from "../../constants";
import {
  BroadcastSyncResponse,
  NewBlockEvents,
  SubscriptionEvents,
} from "./types";

class SocketClient extends RpcClientBase {
  private _client: WebsocketClient | null = null;

  public connect(): void {
    this._client = new WebsocketClient(this.endpoint, (e: Error) => {
      throw new Error(e.message);
    });
  }

  public disconnect(): void {
    this._client?.disconnect();
    if (this._client) {
      this._client = null;
    }
  }

  public get client(): WebsocketClient | null {
    return this._client;
  }

  public async broadcastTx(tx: Uint8Array): Promise<BroadcastSyncResponse> {
    if (!this._client) {
      this.connect();
    }

    return new Promise((resolve, reject) => {
      this.client
        ?.execute(
          createJsonRpcRequest("broadcast_tx_sync", { tx: toBase64(tx) })
        )
        .then((response: BroadcastSyncResponse) => {
          this.disconnect();
          return resolve(response);
        })
        .catch((e) => {
          return reject(e);
        });
    });
  }

  public subscribeNewBlock(hash: string): Promise<NewBlockEvents> {
    if (!this._client) {
      this.connect();
    }

    const queries = [`tm.event='NewBlock'`, `${TxResponse.Hash}='${hash}'`];

    return new Promise((resolve, reject) => {
      this.client
        ?.listen(
          createJsonRpcRequest("subscribe", {
            query: queries.join(" AND "),
          })
        )
        .addListener({
          next: (subEvent) => {
            const { events }: { events: NewBlockEvents } =
              subEvent as SubscriptionEvents;
            this.disconnect();
            return resolve(events);
          },
          error: (e) => {
            return reject(e);
          },
        });
    });
  }
}

export default SocketClient;
