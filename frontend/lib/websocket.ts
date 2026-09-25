"use client";

type MessageHandler = (data: any) => void;

export class KDSWebSocketClient {
  private socket: WebSocket | null = null;
  private url: string;
  private onMessageCallback: MessageHandler | null = null;

  constructor(topic: string) {
    // Connects to /api/v1/ws/staff?topic=... with HTTP-only cookie per AD-9
    const protocol = typeof window !== "undefined" && window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = typeof window !== "undefined" ? window.location.host : "localhost:8080";
    this.url = `${protocol}//${host}/api/v1/ws/staff?topic=${encodeURIComponent(topic)}`;
  }

  public connect(onMessage: MessageHandler) {
    this.onMessageCallback = onMessage;
    if (typeof window === "undefined") return;

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (this.onMessageCallback) {
            this.onMessageCallback(parsed);
          }
        } catch (err) {
          console.warn("websocket: failed to parse incoming WS message", err);
        }
      };

      this.socket.onclose = () => {
        // Auto-reconnect on disconnect
        setTimeout(() => this.connect(onMessage), 3000);
      };
    } catch (err) {
      console.warn("websocket: connection error", err);
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
