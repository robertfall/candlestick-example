import { MutableRefObject, useCallback, useRef, useState } from "react";
import { NUMBER_OF_BUCKETS } from "./constants";
import {
  bucketKeyForTrade,
  candlestickFromBucket,
  timeScaleToMs,
  truncateBuckets,
  updateBucketFromTrade,
} from "./helpers";

export type TimeScale = "1m" | "2m" | "10m";
export type TimeScaleMs = number;
export type Timestamp = number;

export interface Trade {
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

interface TimestampPrice {
  price: number;
  timestamp: Timestamp;
}

export interface Bucket {
  open: TimestampPrice;
  close: TimestampPrice;
  high: number;
  low: number;
}

export type Buckets = { [id: Timestamp]: Bucket };
export type CandleStickData = {
  data: Array<CandleStick>;
  refresh: (trades: Array<Trade>) => void;
};

export function useCandlestickChart(timeScale: TimeScale): CandleStickData {
  /*
   ** Implement your solution here
   */
  const timeScaleMs = timeScaleToMs(timeScale);
  const buckets: MutableRefObject<Buckets> = useRef<Buckets>({});
  const [data, setData] = useState<Array<CandleStick>>([]);

  const refresh = useCallback(
    (trades: Trade[]) => {
      trades.forEach((trade) => {
        const bucketKey = bucketKeyForTrade(trade, timeScaleMs);
        const existingBucket = buckets.current[bucketKey];
        buckets.current[bucketKey] = updateBucketFromTrade(existingBucket, trade);
      });
      truncateBuckets(buckets.current, NUMBER_OF_BUCKETS);
      setData(Object.values(buckets.current).map(candlestickFromBucket));
    },
    [timeScaleMs, buckets]
  );

  return {
    data,
    refresh,
  };
}
