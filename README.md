## Relevant Context

![Candlestick](https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Candlestick_chart_scheme_01-en.svg/1280px-Candlestick_chart_scheme_01-en.svg.png)

Candlesticks are shapes in the above form used to represent financial data.
They can be green or red.
They aggregate many trades in a time bucket (5 minutes, 10minutes), and:

- "Low" represents the lowest trade in the time bucket
- "High" represents the highest price in the time bucket
- "Open" represents the price of the first trade in the time bucket
- "Close" represents the price of the last trade in the time bucket

The candlestick will be red if the "Close" price was lower than the "Open", gren otherwise.


We have an app that receives websocket real time Bitcoin trades prices through a WebSocket connection, and aims to represent in real time candlesticks of this data.

We map the trades to a very simple object `Trade`

```
interface Trade {
    price: number
    timestamp: number
}
```

Our main React component App.tsx stores a variable in its internal state called `candleSticks`, this variable contains the `CandleStick` objects rendered at any point in time in the screen:

```
export interface CandleStick {
    close: PointY;
    open: PointY;
    low: PointY;
    high: PointY;
}
```

`PointY` is a number from 0 to 100. We asume that the Y-Axis represents values from 0 to 100.
Regardless of the time bucket setting, the maximum number of candlesticks we will want to show is 15.

## Exercise

Modify the hook `useCandlestickChart` so that always returns the list of 15 candlesticks to render in the screen.

The hooks gets initialized with a `timeScale`, and provides the called component with a `refresh` function, that receives new trades. The hook should be memory efficient.

tip: Discard older data that is not used anymore for plotting the last 15 candlesticks.