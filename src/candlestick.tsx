import { Rect } from "react-konva";
import { CandleStick as ICandleStick } from "./use-stock-candlestick-chart";

const CONTAINER_HEIGHT = 400;
const BAR_WIDTH = 30;

const BTC_MAX = 30;
const BTC_MIN = 0;

function normalizeY(num: number) {
  return (num * 100) / (BTC_MAX - BTC_MIN);
}

export const CandleStick = (props: { candleData: ICandleStick; x: number }) => {
  const bodyMax = Math.max(props.candleData.close, props.candleData.open);
  const bodyMin = Math.min(props.candleData.close, props.candleData.open);
  const color =
    props.candleData.close < props.candleData.open ? "red" : "green";

  const rectDimensions = {
    width: BAR_WIDTH,
    x: props.x,
    y: CONTAINER_HEIGHT - normalizeY(bodyMax - BTC_MIN),
    height: normalizeY(bodyMax - BTC_MIN) - normalizeY(bodyMin - BTC_MIN),
  };

  const lineDimensions = {
    width: 2,
    x: props.x + BAR_WIDTH / 2 - 2,
    y: CONTAINER_HEIGHT - normalizeY(props.candleData.high - BTC_MIN),
    // (29600 - 25000) * 100 / 40000
    height:
      normalizeY(props.candleData.high - BTC_MIN) -
      normalizeY(props.candleData.low - BTC_MIN),
  };

  return (
    <>
      <Rect fill={color} {...rectDimensions} />
      <Rect fill={color} {...lineDimensions} />
    </>
  );
};
