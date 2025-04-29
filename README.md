# Shreder x Geyser Benchmark

Shreder is the fastest way to get block updates and receive transaction data on Solana.
It allows you to receive streaming data with Solana network transactions in real-time (0 block).

At its core, Shreder is a shred streaming service.
We bypass Solana’s standard mechanisms (like Turbine) and stream raw transaction data directly to your app.  Solana nodes (RPC or Validator) are not required.
This is the fastest possible way to receive real-time block data.

## Description

This repository helps you to benchmark your Geyser gRPC service against Shreder by evaluating incoming transaction timestamps.

## Getting Started

Follow these instructions to set up the project on your local machine.

### Prerequisites

Before you begin, make sure you have the following installed:

- [Git](https://git-scm.com/) for cloning the repository
- [Node.js](https://nodejs.org/) for building the project

### Usage
1. **Clone the repository**

    ```bash
    git clone https://github.com/shrederxyz/shreder-benchmark.git
    ```

2.  **Install dependencies**

    In root of the project run the following command:
    ```bash
    npm install
    ```

3. **Configure the project**

    Copy .env-example to .env file and fill following variables:
    ```sh
    GEYSER_HOST_URL # you geyser provider host url
    GEYSER_API_KEY # you geyser provider api key
    SHREDER_HOST_URL # Shreder host url provided by the Shreder team 
    BENCHMARK_TIME # time of benchmarking
    ```

4. **Run script**

    To run benchmark:
    ```bush
    npm run start
    ```
    You will get result in the following format:
    ``` sh
    Avg Time diff: 120 # in ms. How Shreder faster than your geyser provider
    ```

Shreder website: https://shreder.xyz/
Discord: https://discord.gg/8qEGZKPVDV
X: https://x.com/ShrederXyz
Medium: https://medium.com/@shrederxyz
