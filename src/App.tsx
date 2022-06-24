import React, { useCallback, useEffect, useState } from "react";
import { Box, Container, Grid, styled } from "@mui/material";
import { useCandlestickChart } from "./use-stock-candlestick-chart";
import { Layer, Rect, Stage } from "react-konva";
import { CandleStick } from "./candlestick";
import { testCandleSticks } from "./test-candlesticks";
import { useStockWebsocket } from "./use-stock-websocket";
import { Chart } from "./chart";

function App() {
  // Uncomment this line and work on implementing useCandlestickChart
  // data should be an array of all candleSticks objects we want to show in the
  // screen at every render
  // const { data: candleSticks, refresh } = useCandlestickChart("1m");
  const { data: candleSticks, refresh } = useCandlestickChart("1m");
  // Uncomment this line and comment out line 17 to start receiving live events
  // useStockWebsocket({ refresh });

  return (
    <Container>
      <Box
        mt={6}
        style={{
          border: "1px solid black",
        }}
      >
        <Stage width={600} height={400}>
          <Layer>
            {testCandleSticks.map((candleStick, i) => (
              <CandleStick x={i * 30} candleData={candleStick} />
            ))}
          </Layer>
        </Stage>
        <Chart data={candleSticks} />
      </Box>
    </Container>
  );
}

export default App;
