import { TradfriClient } from "node-tradfri-client";
import { getConnection } from "./getConnection";
import { startTransitions } from "./startTransitions";

getConnection().then((client: TradfriClient) => {
  console.log("Got connection");
  startTransitions(client);
  setInterval(() => startTransitions(client), 60000);
});
