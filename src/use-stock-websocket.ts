import { useEffect, useRef } from "react";
import { CandleStickData } from "./use-stock-candlestick-chart";

export const useStockWebsocket = ({
  refresh,
}: {
  refresh: CandleStickData["refresh"];
}) => {
  const ws = useRef<null | WebSocket>(null);

  useEffect(() => {
    ws.current = new WebSocket("wss://ws.finnhub.io?token=c9fi3e2ad3iampagi18g");
    ws.current.onopen = () => {
      if (ws.current) {
        ws.current.send(
          JSON.stringify({ type: "subscribe", symbol: "BINANCE:BTCUSDT" })
        );
      }
    };
    ws.current.onclose = () => console.log("ws closed");

    var unsubscribe = function (symbol: string) {
      if (ws.current?.readyState === 1)
        ws.current.send(JSON.stringify({ type: "unsubscribe", symbol: symbol }));
    };

    return () => unsubscribe("BINANCE:BTCUSDT");
  }, []);

  useEffect(() => {
    const handler = (event: any) => {
      console.debug("Message from server ", JSON.parse(event.data));

      const serverData = JSON.parse(event.data);

      if (serverData.type === "trade") {
        const mappedData = serverData.data.map((d: any) => ({
          price: d.p,
          timestamp: d.t,
        }));

        console.debug("WANNA CALL REFRESH", refresh);
        refresh(mappedData);
      }
    }

    ws.current?.addEventListener("message", handler);

    return () => {
      ws.current?.removeEventListener("message", handler);
    }
    }, [refresh]);
};
