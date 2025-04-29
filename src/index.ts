import "dotenv/config";

import { Benchmark } from "./benchmark";
import { GeyserClient } from "./geyser";
import { ShrederClient } from "./shreder";

const geyserHost = process.env.GEYSER_HOST_URL;
const geyserApiKey = process.env.GEYSER_API_KEY;
const shrederHost = process.env.SHREDER_HOST_URL;
const benchmarkTime = Number(process.env.BENCHMARK_TIME ?? 60_000);

async function main() {
  if (!geyserHost) {
    console.error("No geyser host defined");
    return;
  }
  if (!geyserApiKey) {
    console.error("No geyser api key defined");
    return;
  }

  if (!shrederHost) {
    console.error("No shreder host defined");
    return;
  }
  const geyserClient = new GeyserClient(geyserHost, geyserApiKey);
  const shrederClient = new ShrederClient(shrederHost);
  const benchmark = new Benchmark(geyserClient, shrederClient);

  await benchmark.perform(benchmarkTime);
  benchmark.printReport();
}

main();
