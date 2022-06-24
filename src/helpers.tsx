import { MINUTE, NUMBER_OF_BUCKETS } from "./constants";
import {
  Bucket,
  Buckets,
  CandleStick,
  TimeScale,
  TimeScaleMs,
  Trade,
} from "./use-stock-candlestick-chart";

export function truncateTrades(timeframe: number, trades: Trade[]) {
  const cutOff = Date.now() - timeframe;
  return trades.filter((trade: Trade) => trade.timestamp >= cutOff);
}

export function timeScaleToMs(timeScale: TimeScale): number {
  return parseInt(timeScale) * MINUTE;
}

export function bucketKeyForTrade(
  trade: Trade,
  timeScaleMs: TimeScaleMs
): number {
  return Math.floor(trade.timestamp / timeScaleMs) * timeScaleMs;
}

export function truncateBuckets(
  buckets: Buckets,
  numberOfBuckets: number = NUMBER_OF_BUCKETS
) {
  const keys = Object.keys(buckets).sort(
    (a, b) => parseInt(b, 10) - parseInt(a, 10)
  );

  if (keys.length > numberOfBuckets) {
    keys
      .splice(numberOfBuckets)
      .forEach((key) => delete buckets[parseInt(key, 10)]);
  }
}

export function updateBucketFromTrade(
  bucket: Bucket | undefined,
  trade: Trade
) {
  if (!bucket) {
    return {
      close: { ...trade },
      open: { ...trade },
      high: trade.price,
      low: trade.price,
    };
  }

  return {
    close: trade.timestamp > bucket.close.timestamp ? { ...trade } : bucket.close,
    open: trade.timestamp < bucket.open.timestamp ? { ...trade } : bucket.open,
    high: trade.price > bucket.high ? trade.price : bucket.high,
    low: trade.price < bucket.low ? trade.price : bucket.low,
  };
}

export function candlestickFromBucket(bucket: Bucket): CandleStick {
  return {
    open: bucket.open.price,
    close: bucket.close.price,
    high: bucket.high,
    low: bucket.low,
  };
}
