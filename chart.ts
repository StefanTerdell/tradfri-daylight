import { getDimmerAndColorTemperature } from "./getDimmerAndColorTemperature";
import * as asciiChart from "asciichart";

(() => {
  const dimmerValues: number[] = [];
  const colorTemperatureValues: number[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      const time = new Date().setHours(hour, minute, 0, 0);
      const { dimmer, colorTemperature } = getDimmerAndColorTemperature(time);
      dimmerValues.push(dimmer);
      colorTemperatureValues.push(colorTemperature);
    }
  }

  console.log("Dimmers:");
  console.log(asciiChart.plot(dimmerValues, { height: 6 }));
  console.log("Color Temperatures:");
  console.log(asciiChart.plot(colorTemperatureValues, { height: 6 }));
  console.log(
    "       00:00|                              06:00|                              12:00|                              18:00|                              24:00|"
  );
})();
