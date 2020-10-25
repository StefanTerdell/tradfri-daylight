import { getSunrise, getSunset } from "sunrise-sunset-js";
import * as OPTIONS from "./options.json";

const inverseLinearInterpolation = (a, b, i) => (i - a) / (b - a);

const range = (min, max, i) => min + i * (max - min) * 0.01;

const dimByDaytime = (epoc: number): number => {
  const fromHour = (hours: number) => new Date().setHours(hours, 0, 0, 0);
  const fadeIn = fromHour(OPTIONS.fadeInAt);
  const fullyLit = fromHour(OPTIONS.fullyLitAt);
  const fadeOut = fromHour(OPTIONS.fadeOutAt);
  const fullyDimmed = fromHour(OPTIONS.fullyDimmedAt);
  const i: number =
    epoc < fadeIn
      ? 0
      : epoc < fullyLit
      ? inverseLinearInterpolation(fadeIn, fullyLit, epoc)
      : epoc < fadeOut
      ? 1
      : epoc < fullyDimmed
      ? 1 - inverseLinearInterpolation(fadeOut, fullyDimmed, epoc)
      : 0;

  return Math.round(i * 100);
};

const temperatureBySun = (epoc: number): number => {
  const sunrise = getSunrise(56.6350434, 16.5602567).getTime();
  const sunset = getSunset(56.6350434, 16.5602567).getTime();

  const morning = sunrise + OPTIONS.morningHours * 3600000;
  const twilight = sunset - OPTIONS.twilightHours * 3600000;
  const i =
    (epoc < sunrise
      ? 1
      : epoc < morning
      ? 1 - inverseLinearInterpolation(sunrise, morning, epoc)
      : epoc < twilight
      ? 0
      : epoc < sunset
      ? inverseLinearInterpolation(twilight, sunset, epoc)
      : 1) * 100;

  return Math.round(range(0, OPTIONS.temperatureMaxBySun, i));
};

const getDimmerAndColorTemperature = (epoc: number) => {
  const dimmerRaw = dimByDaytime(epoc);
  const colorTemperature = range(
    OPTIONS.temperatureMin,
    OPTIONS.temperatureMax,
    range(0, 100 - OPTIONS.temperatureMaxBySun, 100 - dimmerRaw) +
      temperatureBySun(epoc)
  );
  const dimmer = range(OPTIONS.dimmerMin, OPTIONS.dimmerMax, dimmerRaw);
  return { dimmer, colorTemperature };
};

export { getDimmerAndColorTemperature };
