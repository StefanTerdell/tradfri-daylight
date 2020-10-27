import { TradfriClient } from "node-tradfri-client";
import { getSunrise } from "sunrise-sunset-js";
import { getConnection } from "./getConnection";
import * as OPTIONS from "./options.json"

getConnection().then((client: TradfriClient) => {
  console.log("Got connection");
  startTransitions(client);
  setInterval(() => startTransitions(client), 60000);
});

const startTransitions = async (client: TradfriClient) => {
  const midnight = new Date().setHours(0,0,0,0) / 60000
  const now = new Date().setSeconds(0,0) / 60000 - midnight
  const sunrise = getSunrise(OPTIONS.longitude, OPTIONS.latitude).setSeconds(0,0) / 60000 - midnight
  const sunset = getSunrise(OPTIONS.longitude, OPTIONS.latitude).setSeconds(0,0) / 60000 - midnight;

  console.log(now, sunrise - OPTIONS.sunrise.relativeStartTime * 60)
  await client.observeDevices()

  for (const device of Object.values(client.devices)) {
    if ((OPTIONS.include.length && !OPTIONS.include.includes(device.name)) ||
      OPTIONS.exclude.includes(device.name)) {
      continue;
    }

    if (device.lightList) {
      if (now === sunrise - OPTIONS.sunrise.relativeStartTime * 60) {
        client.operateLight(
          device,
          { 
            colorTemperature: OPTIONS.sunrise.colorTemperatureTarget, 
            dimmer: 
              sunrise -  OPTIONS.sunrise.relativeStartTime * 60 < OPTIONS.wakeUp.startClockHour * 60 
                ? OPTIONS.sunrise.dimmerTarget 
                : undefined,
            transitionTime: (OPTIONS.sunrise.relativeCompleteTime - OPTIONS.sunrise.relativeStartTime) * 3600
          }
        );
      } else if (now === OPTIONS.wakeUp.startClockHour * 60) {
        client.operateLight(
          device,
          {
            colorTemperature: 
              OPTIONS.wakeUp.startClockHour * 60 < sunrise - OPTIONS.sunrise.relativeStartTime * 60 
                ? OPTIONS.wakeUp.colorTemperatureTarget 
                : undefined,
            dimmer: OPTIONS.wakeUp.dimmerTarget,
            transitionTime: (OPTIONS.wakeUp.completeClockHour - OPTIONS.wakeUp.startClockHour) * 3600
          }
        )
      } else if (now === sunset - OPTIONS.sunset.relativeStartTime * 60 && sunset - OPTIONS.sunset.relativeStartTime * 60 < OPTIONS.sleep.startClockHour * 60) {
        client.operateLight(
          device,
          {
            colorTemperature: OPTIONS.sunset.colorTemperatureTarget,
            dimmer: OPTIONS.sunset.dimmerTarget,
            transitionTime: (OPTIONS.sunset.relativeCompleteTime - OPTIONS.sunset.relativeStartTime) * 3600
          }
        )
      } else if (now === OPTIONS.sleep.startClockHour * 60) {
        client.operateLight(
          device,
          {
            colorTemperature: OPTIONS.sleep.colorTemperatureTarget,
            dimmer: OPTIONS.sleep.dimmerTarget,
            transitionTime: (OPTIONS.sleep.completeClockHour - OPTIONS.sleep.startClockHour) * 3600
          }
        )
      }
    }
  }
}