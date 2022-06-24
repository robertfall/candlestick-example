import { MINUTE, SECOND } from "./constants";
import {
  timeScaleToMs,
  bucketKeyForTrade,
  truncateBuckets,
  updateBucketFromTrade,
} from "./helpers";
import {
  Bucket,
  Buckets,
  TimeScale,
  TimeScaleMs,
  Timestamp,
  Trade,
} from "./use-stock-candlestick-chart";

const timeframe = 15 * MINUTE;

describe("timeScaleToMs", () => {
  it("returns the correct ms value for a TimeScale", () => {
    const oneMinute = 60000;
    expect(timeScaleToMs("1m")).toBe(oneMinute);
    expect(timeScaleToMs("2m")).toBe(2 * oneMinute);
    expect(timeScaleToMs("10m")).toBe(10 * oneMinute);
  });
});

describe("bucketKeyForTimestamp", () => {
  let now: number,
    trade1: Trade,
    trade2: Trade,
    timeScaleMs: TimeScaleMs,
    numberOfBuckets: number;
  beforeAll(() => {
    now = 19 * MINUTE;
    numberOfBuckets = 15;
    timeScaleMs = timeScaleToMs("1m");
    trade1 = { price: 12345, timestamp: now - 5 * SECOND };
    trade2 = { price: 12345, timestamp: now - 65 * SECOND };
  });

  it("returns the correct bucket key for given timestamp and timeScale", () => {
    expect(bucketKeyForTrade(trade1, timeScaleMs)).toEqual(18 * MINUTE);
    expect(bucketKeyForTrade(trade2, timeScaleMs)).toEqual(17 * MINUTE);
  });
});

describe("truncateBuckets", () => {
  let buckets: Buckets;
  beforeEach(() => {
    buckets = {
      1: {
        open: { timestamp: 0, price: 0 },
        close: { timestamp: 0, price: 0 },
        high: 0,
        low: 0,
      },
      2: {
        open: { timestamp: 0, price: 0 },
        close: { timestamp: 0, price: 0 },
        high: 0,
        low: 0,
      },
      3: {
        open: { timestamp: 0, price: 0 },
        close: { timestamp: 0, price: 0 },
        high: 0,
        low: 0,
      },
    };
  });

  describe("when there are fewer than the specified number of buckets", () => {
    it("does nothing", () => {
      truncateBuckets(buckets, 4);
      expect(Object.keys(buckets).map((x) => parseInt(x, 10))).toEqual([
        1, 2, 3,
      ]);
    });
  });

  describe("when there are more than the specified number of buckets", () => {
    it("removes the oldest buckets", () => {
      truncateBuckets(buckets, 2);
      expect(Object.keys(buckets).map((x) => parseInt(x, 10))).toEqual([2, 3]);
    });
  });
});

describe("updateBucketWithTrade", () => {
  describe("when bucket is undefined", () => {
    it("sets all values to the trade values", () => {
      const trade = { price: 12345, timestamp: 60000 };

      expect(updateBucketFromTrade(undefined, trade)).toEqual({
        open: { timestamp: trade.timestamp, price: trade.price },
        close: { timestamp: trade.timestamp, price: trade.price },
        high: trade.price,
        low: trade.price,
      });
    });
  });

  describe("when bucket exists", () => {
    let bucket: Bucket = {
      open: { timestamp: 60000, price: 222 },
      close: { timestamp: 120000, price: 888 },
      high: 999,
      low: 111,
    };

    describe("when trade is more recent than close", () => {
      it("updates the close price and timestamp", () => {
        expect(
          updateBucketFromTrade(bucket, { timestamp: 120001, price: 889 })
        ).toEqual({
          ...bucket,
          close: { timestamp: 120001, price: 889 },
        });
      });
    });
    describe("when trade is earlier than open", () => {
      expect(
        updateBucketFromTrade(bucket, { timestamp: 59999, price: 221 })
      ).toEqual({
        ...bucket,
        open: { timestamp: 59999, price: 221 },
      });
    });

    describe("when trade price is higher than high", () => {
      expect(
        updateBucketFromTrade(bucket, { timestamp: 65000, price: 1000 })
      ).toEqual({
        ...bucket,
        high: 1000,
      });
    });

    describe("when trade price is lower than low", () => {
      expect(
        updateBucketFromTrade(bucket, { timestamp: 65000, price: 100 })
      ).toEqual({
        ...bucket,
        low: 100,
      });
    });

    describe("when trade is unremarkable", () => {
      expect(
        updateBucketFromTrade(bucket, { timestamp: 65000, price: 333 })
      ).toEqual({
        ...bucket,
      });
    });
  });
});
