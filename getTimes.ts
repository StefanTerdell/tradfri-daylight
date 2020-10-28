import { getSunrise } from "sunrise-sunset-js";
import * as OPTIONS from "./options.json";

/**
 * Returns all relevant times as minutes into the current day
 */
export const getTimes = () => {
  const midnight = new Date().setHours(0, 0, 0, 0) / 60000;
  const now = new Date().setSeconds(0, 0) / 60000 - midnight;
  const actualSunrise =
    getSunrise(OPTIONS.longitude, OPTIONS.latitude).setSeconds(0, 0) / 60000 -
    midnight;
  const sunrise = {
    start: Math.round(actualSunrise - OPTIONS.sunrise.relativeStartTime) * 60,
    duration:
      Math.round(
        OPTIONS.sunrise.relativeCompleteTime - OPTIONS.sunrise.relativeStartTime
      ) * 60,
  };
  const actualSunset =
    getSunrise(OPTIONS.longitude, OPTIONS.latitude).setSeconds(0, 0) / 60000 -
    midnight;
  const sunset = {
    start: Math.round(actualSunset - OPTIONS.sunset.relativeStartTime) * 60,
    duration:
      Math.round(
        OPTIONS.sunset.relativeCompleteTime - OPTIONS.sunset.relativeStartTime
      ) * 60,
  };
  const wakeup = {
    start: Math.round(OPTIONS.wakeup.startClockHour * 60),
    duration:
      Math.round(
        OPTIONS.wakeup.completeClockHour - OPTIONS.wakeup.startClockHour
      ) * 60,
  };
  const sleep = {
    start: Math.round(OPTIONS.sleep.startClockHour * 60),
    duration:
      Math.round(
        OPTIONS.sleep.completeClockHour - OPTIONS.sleep.startClockHour
      ) * 60,
  };
  return { now, sunrise, sunset, wakeup, sleep };
};
