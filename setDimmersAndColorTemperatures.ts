import { TradfriClient } from "node-tradfri-client";
import { getDimmerAndColorTemperature } from "./getDimmerAndColorTemperature";
import * as OPTIONS from "./options.json";

const formatTime = (d: Date) => {
  const withLeadingZero = (n) => (n < 10 ? `0${n}` : `${n}`);
  return `${withLeadingZero(d.getHours())}:${withLeadingZero(
    d.getMinutes()
  )}:${withLeadingZero(d.getSeconds())}`;
};

const setDimmersAndTemperatures = async (
  client: TradfriClient
): Promise<void> => {
  return client.observeDevices().then(() => {
    const now = new Date();
    const { dimmer, colorTemperature } = getDimmerAndColorTemperature(
      now.getTime()
    );
    for (const device of Object.values(client.devices)) {
      if (
        (OPTIONS.include.length && !OPTIONS.include.includes(device.name)) ||
        (OPTIONS.exclude.length && OPTIONS.exclude.includes(device.name))
      ) {
        continue;
      }
      if (device.lightList) {
        client.operateLight(
          device,
          { colorTemperature: colorTemperature, dimmer: dimmer },
          false
        );
      }
    }
    console.log(
      `${formatTime(
        now
      )}: set dimmers to ${dimmer} & color temperature to ${colorTemperature}`
    );
  });
};

export { setDimmersAndTemperatures };
