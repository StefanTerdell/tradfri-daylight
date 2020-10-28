import { TradfriClient } from "node-tradfri-client";
import { getTimes } from "./getTimes";
import * as OPTIONS from "./options.json";

export const startTransitions = async (client: TradfriClient) => {
  const { now, sunset, sunrise, wakeup, sleep } = getTimes();
  await client.observeDevices();
  for (const device of Object.values(client.devices).filter(
    (device) => device.lightList
  )) {
    if (
      (OPTIONS.include.length && !OPTIONS.include.includes(device.name)) ||
      OPTIONS.exclude.includes(device.name)
    ) {
      continue;
    }
    switch (now) {
      case wakeup.start:
        console.log(`Starting wakeup program at ${new Date().toString()}`);
        client.operateLight(device, {
          colorTemperature:
            wakeup.start < sunrise.start
              ? OPTIONS.wakeup.colorTemperatureTarget
              : undefined,
          dimmer: OPTIONS.wakeup.dimmerTarget,
          transitionTime: wakeup.duration * 60,
        });
        break;
      case sunrise.start:
        console.log(`Starting sunrise program at ${new Date().toString()}`);
        client.operateLight(device, {
          colorTemperature: OPTIONS.sunrise.colorTemperatureTarget,
          dimmer:
            sunrise.start < wakeup.start
              ? OPTIONS.sunrise.dimmerTarget
              : undefined,
          transitionTime: sunrise.duration * 60,
        });
        break;
      case sunset.start:
        if (sunset.start < sleep.start) {
          console.log(`Starting sunset program at ${new Date().toString()}`);
          client.operateLight(device, {
            colorTemperature: OPTIONS.sunset.colorTemperatureTarget,
            dimmer: OPTIONS.sunset.dimmerTarget,
            transitionTime: sunset.duration * 60,
          });
        } else {
          console.log(
            `Skipping sunset program at ${new Date().toString()} due to sleep program having started`
          );
        }
        break;
      case sleep.start:
        console.log(`Starting sleep program at ${new Date().toString()}`);
        client.operateLight(device, {
          colorTemperature: OPTIONS.sleep.colorTemperatureTarget,
          dimmer: OPTIONS.sleep.dimmerTarget,
          transitionTime: sleep.duration * 60,
        });
        break;
    }
  }
};
