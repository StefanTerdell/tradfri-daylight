import Conf from "conf";
import { TradfriClient, discoverGateway } from "node-tradfri-client";

const conf = new Conf<Record<string, string>>();

const getConnection = async () => {
  const gateway = await discoverGateway();
  if (!gateway) {
    console.error("No gateway found on network");
    process.exit(1);
  }
  const tradfri = new TradfriClient(gateway.host);
  if (!conf.has("security.identity") || !conf.has("security.psk")) {
    let securityCode = process.env.IKEASECURITY;
    if (securityCode === "" || securityCode === undefined) {
      console.log(
        "Please set the IKEASECURITY env variable to the code on the back of the gateway"
      );
      process.exit(1);
    }
    console.log("Getting identity from security code");
    const { identity, psk } = await tradfri.authenticate(securityCode);
    conf.set("security", { identity, psk });
  }
  console.log("Securely connecting to gateway");
  await tradfri.connect(
    conf.get("security.identity"),
    conf.get("security.psk")
  );
  process.on("SIGINT", function () {
    process.exit();
  });
  process.on("exit", function () {
    console.log("Closing Tradfri connection");
    tradfri.destroy();
  });
  return tradfri;
};

export { getConnection };
