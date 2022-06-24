import { useMemo, useState } from "react";

type TimeScale = "1m" | "2m" | "10m";

interface Trade {
  price: number;
  timestamp: number;
}

type PointY = number;

export interface CandleStick {
  close: PointY;
  open: PointY;
  low: PointY;
  high: PointY;
}

export type CandleStickData = {
  data: Array<CandleStick>;
  refresh: (trades: Array<Trade>) => void;
};
export function useCandlestickChart(timeScale: TimeScale): CandleStickData {
  /*
   ** Implement your solution here
   */


  return {
    data: [],
    refresh: () => {}
  }
}
