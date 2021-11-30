export const THE_GRAPH_URL = "https://explorer.celo.org/graphiql";
export const EPOCH_INTERVAL = 2200;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 13.14;

export const TOKEN_DECIMALS = 9;

interface IPoolGraphURLS {
  [index: string]: string;
}

export const POOL_GRAPH_URLS: IPoolGraphURLS = {
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  1: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
};

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  44787: {
    CUSD_ADDRESS: "0x3a0ea4e0806805527c750ab9b34382642448468d", // duplicate
    TELO_ADDRESS: "",
    CEUR_ADDRESS: "0x32974c7335e649932b5766c5ae15595afc269160",
    STAKING_ADDRESS: "",
    STAKING_HELPER_ADDRESS: "",
    STELO_ADDRESS: "",
    WSTELO_ADDRESS: "",
    DISTRIBUTOR_ADDRESS: "",
    BONDINGCALC_ADDRESS: "",
    CIRCULATING_SUPPLY_ADDRESS: "",
    TREASURY_ADDRESS: "",
    REDEEM_HELPER_ADDRESS: "",
    PT_TOKEN_ADDRESS: "", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
    PT_PRIZE_POOL_ADDRESS: "", // NEW
    PT_PRIZE_STRATEGY_ADDRESS: "", // NEW
  },
  42220: {
    // CUSD_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f", // duplicate
    // TELO_ADDRESS: "0x383518188c0c6d7730d91b2c03a03c837814a899",
    // STAKING_ADDRESS: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a", // The new staking contract
    // STAKING_HELPER_ADDRESS: "0xc8c436271f9a6f10a5b80c8b8ed7d0e8f37a612d", // Helper contract used for Staking only
    // STELO_ADDRESS: "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F",
    // WSTELO_ADDRESS: "0xca76543cf381ebbb277be79574059e32108e3e65",
    // PRESALE_ADDRESS: "0xcBb60264fe0AC96B0EFa0145A9709A825afa17D8",
    // ATELO_ADDRESS: "0x24ecfd535675f36ba1ab9c5d39b50dc097b0792e",
    // MIGRATE_ADDRESS: "0xC7f56EC779cB9e60afA116d73F3708761197dB3d",
    // DISTRIBUTOR_ADDRESS: "0xbe731507810C8747C3E01E62c676b1cA6F93242f",
    // BONDINGCALC_ADDRESS: "0xcaaa6a2d4b26067a391e7b7d65c16bb2d5fa571a",
    // CIRCULATING_SUPPLY_ADDRESS: "0x0efff9199aa1ac3c3e34e957567c1be8bf295034",
    // TREASURY_ADDRESS: "0x31f8cc382c9898b273eff4e0b7626a6987c846e8",
    // CRUCIBLE_TELO_LUSD: "0x2230ad29920D61A535759678191094b74271f373",
    // LQTY: "0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d",
    // MIST: "0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab",
    // REDEEM_HELPER_ADDRESS: "0xE1e83825613DE12E8F0502Da939523558f0B819E",
    // FUSE_6_STELO: "0x59bd6774c22486d9f4fab2d448dce4f892a9ae25", // Tetranode's Locker
    // FUSE_18_STELO: "0x6eDa4b59BaC787933A4A21b65672539ceF6ec97b", // Telesto Pool Party
    // FUSE_36_STELO: "0x252d447c54F33e033AD04048baEAdE7628cB1274", // Ceuroimalist Money Market
    // PT_TOKEN_ADDRESS: "0x0E930b8610229D74Da0A174626138Deb732cE6e9", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
    // PT_PRIZE_POOL_ADDRESS: "0xEaB695A8F5a44f583003A8bC97d677880D528248", // NEW
    // PT_PRIZE_STRATEGY_ADDRESS: "0xf3d253257167c935f8C62A02AEaeBB24c9c5012a", // NEW
  },
};
