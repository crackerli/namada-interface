export type IBCConfigItem = {
  chainId: string;
  alias: string;
};

type IBCConfigType = {
  development: IBCConfigItem[];
  production: IBCConfigItem[];
};

/**
 * Specify any IBC-enabled chains below per environment. Match the following
 * definitions to settings in .env:
 */
const IBCConfig: IBCConfigType = {
  development: [
    {
      chainId: "anoma-test.569195096d4a940e5ee",
      alias: "Namada - Instance 1",
    },
    {
      chainId: "anoma-test.aa4a0f246ca97b6a903",
      alias: "Namada - Instance 2",
    },
    {
      chainId: "gaia",
      alias: "Cosmos (Gaia)",
    },
  ],
  production: [],
};

export default IBCConfig;
