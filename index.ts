import { TradfriClient } from "node-tradfri-client";
import { getConnection } from "./getConnection";
import { setDimmersAndTemperatures } from "./setDimmersAndColorTemperatures";

getConnection().then((client: TradfriClient) => {
  console.log("Got connection");
  setDimmersAndTemperatures(client);
  setInterval(() => setDimmersAndTemperatures(client), 60000);
});
