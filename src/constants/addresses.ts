import { NetworkId } from "src/constants";

export type AddressMap = Partial<Record<NetworkId, string>>;

export const STAKING_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x7263372b9ff6E619d8774aEB046cE313677E2Ec7",
  [NetworkId.MAINNET]: "0xB63cac384247597756545b500253ff8E607a8020",
};

export const BOND_DEPOSITORY_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0xAda3336fcD233Ff0Eb39BeA0b1a7784E43aD4B00",
  [NetworkId.MAINNET]: "0x9025046c6fb25Fb39e720d97a8FD881ED69a1Ef6",
};

export const OP_BOND_DEPOSITORY_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x0C9D01FbD07cC2fD3e09bD953bb65698351AF05D",
  [NetworkId.MAINNET]: "0x22AE99D07584A2AE1af748De573c83f1B9Cdb4c0",
};

export const DAO_TREASURY_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x6e36b2f9f2BcC273f090ff049952Fa4B5Cc67567",
  [NetworkId.MAINNET]: "0x245cc372C84B3645Bf0Ffe6538620B04a217988B",
};

export const OHM_DAI_LP_ADDRESSES = {
  [NetworkId.MAINNET]: "0x055475920a8c93CfFb64d039A8205F7AcC7722d3",
};

export const OHM_DAI_BALANCER_LP_ADDRESSES = {
  [NetworkId.MAINNET]: "0x76fcf0e8c7ff37a47a799fa2cd4c13cde0d981c9",
  [NetworkId.TESTNET_GOERLI]: "",
};

export const WBTC_ADDRESSES = {
  [NetworkId.MAINNET]: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
};

export const UST_ADDRESSES = {
  [NetworkId.MAINNET]: "0xa693B19d2931d498c5B318dF961919BB4aee87a5",
};

export const FRAX_ADDRESSES = {
  [NetworkId.MAINNET]: "0x853d955aCEf822Db058eb8505911ED77F175b99e",
};

export const LUSD_ADDRESSES = {
  [NetworkId.MAINNET]: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
};

export const DAI_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x41e38e70a36150D08A8c97aEC194321b5eB545A5",
  [NetworkId.MAINNET]: "0x6b175474e89094c44da98b954eedeac495271d0f",
};

export const WETH_ADDRESSES = {
  [NetworkId.MAINNET]: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
};

export const GOHM_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0xC1863141dc1861122d5410fB5973951c82871d98",
  [NetworkId.MAINNET]: "0x0ab87046fBb341D058F17CBC4c1133F25a20a52f",
  [NetworkId.ARBITRUM]: "0x8D9bA570D6cb60C7e3e0F31343Efe75AB8E65FB1",
  [NetworkId.AVALANCHE]: "0x321e7092a180bb43555132ec53aaa65a5bf84251",
  [NetworkId.AVALANCHE_TESTNET]: "0x115E5979435c89eF38fB87C2D7Fc3BCA09053c54",
  [NetworkId.POLYGON]: "0xd8cA34fd379d9ca3C6Ee3b3905678320F5b45195",
  [NetworkId.FANTOM]: "0x91fa20244fb509e8289ca630e5db3e9166233fdc",
  [NetworkId.OPTIMISM]: "0x0b5740c6b4a97f90eF2F0220651Cca420B868FfB",
  [NetworkId.BOBA]: "0xd22C0a4Af486C7FA08e282E9eB5f30F9AaA62C95",
};

export const WSOHM_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x98002335F094340BB8B21c8b7CC35F0792282651",
  [NetworkId.MAINNET]: "0xca76543cf381ebbb277be79574059e32108e3e65",
  [NetworkId.ARBITRUM]: "0x739ca6D71365a08f584c8FC4e1029045Fa8ABC4B",
  [NetworkId.AVALANCHE]: "0x8cd309e14575203535ef120b5b0ab4dded0c2073",
  [NetworkId.AVALANCHE_TESTNET]: "0x8e8ffc8d41Ee4A915A1FB3940b1beAB0c2Cd5bB0",
};

export const OHM_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x0595328847AF962F951a4f8F8eE9A3Bf261e4f6b",
  [NetworkId.MAINNET]: "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
  [NetworkId.ARBITRUM]: "0xf0cb2dc0db5e6c66B9a70Ac27B06b878da017028",
  [NetworkId.ARBITRUM_GOERLI]: "0x69da0a4ace14c0befe906f18881a35670e7568ac",
};

export const V1_OHM_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x5f99F707470E81784eA064377b302Ff111b5a95A",
  [NetworkId.MAINNET]: "0x383518188c0c6d7730d91b2c03a03c837814a899",
};

export const SOHM_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x4EFe119F4949319f2Acb12efD615a7B63896482B",
  [NetworkId.MAINNET]: "0x04906695D6D12CF5459975d7C3C03356E4Ccd460",
};

export const V1_SOHM_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x018C3877ef779fb977E7700BFDF08B6f63BD07B8",
  [NetworkId.MAINNET]: "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F",
};

export const MIGRATOR_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x33c7278a7C0Ea98d75B2CCb87506aC3fD494dC83",
  [NetworkId.MAINNET]: "0x184f3FAd8618a6F458C16bae63F70C426fE784B3",
  [NetworkId.ARBITRUM]: "0x1e7902a8b0adbf81042b5e30bdfa281f0b928d6d",
  [NetworkId.AVALANCHE]: "0xB10209BFbb37d38EC1B5F0c964e489564e223ea7",
  [NetworkId.AVALANCHE_TESTNET]: "0x9050D25977F8A19CDD5599A28bC5f55d39fb6105",
};

export const GOHM_TOKEMAK_ADDRESSES = {
  [NetworkId.MAINNET]: "0x41f6a95bacf9bc43704c4a4902ba5473a8b00263",
};

export const FUSE_POOL_6_ADDRESSES = {
  [NetworkId.MAINNET]: "0x59bd6774c22486d9f4fab2d448dce4f892a9ae25",
};

export const FUSE_POOL_18_ADDRESSES = {
  [NetworkId.MAINNET]: "0x6eDa4b59BaC787933A4A21b65672539ceF6ec97b",
};

export const FUSE_POOL_36_ADDRESSES = {
  [NetworkId.MAINNET]: "0x252d447c54F33e033AD04048baEAdE7628cB1274",
};

export const ZAP_ADDRESSES = {
  [NetworkId.MAINNET]: "0x6F5CC3EDEa92AB52b75bad50Bcf4C6daa781B87e",
  [NetworkId.TESTNET_GOERLI]: "",
};

export const PT_PRIZE_POOL_ADDRESSES = {
  [NetworkId.MAINNET]: "0xEaB695A8F5a44f583003A8bC97d677880D528248",
};

export const FIATDAO_WSOHM_ADDRESSES = {
  [NetworkId.MAINNET]: "0xe98ae8cD25CDC06562c29231Db339d17D02Fd486",
};

export const BALANCER_VAULT_ADDRESSSES = {
  [NetworkId.MAINNET]: "0xba12222222228d8ba445958a75a0704d566bf2c8",
};

export const RANGE_OPERATOR_ADDRESSES = {
  [NetworkId.MAINNET]: "0x0374c001204eF5e7E4F5362A5A2430CB6c219326",
  [NetworkId.TESTNET_GOERLI]: "0x255467F1ca090Cd0Ed20014DC957E942d846843b",
};

export const RANGE_ADDRESSES = {
  [NetworkId.MAINNET]: "0xb212D9584cfc56EFf1117F412Fe0bBdc53673954",
  [NetworkId.TESTNET_GOERLI]: "0x446f06f8Df7d5f627B073c6349b948B95c1f9185",
};

export const RANGE_PRICE_ADDRESSES = {
  [NetworkId.MAINNET]: "0xd6C4D723fdadCf0D171eF9A2a3Bfa870675b282f",
  [NetworkId.TESTNET_GOERLI]: "0xD9ace3Be2d80006EF4D90A2D35D861a5C9F98252",
};

export const DEV_FAUCET = {
  [NetworkId.TESTNET_GOERLI]: "0x405940141AeE885347ef4C47d933eF4cA6A674D8",
};

export const BOND_AGGREGATOR_ADDRESSES = {
  [NetworkId.MAINNET]: "0x007A66A2a13415DB3613C1a4dd1C942A285902d1",
  [NetworkId.TESTNET_GOERLI]: "0x007A66A2a13415DB3613C1a4dd1C942A285902d1",
};

export const BOND_FIXED_EXPIRY_TELLER_ADDRESSES = {
  [NetworkId.MAINNET]: "0x007FE7c498A2Cf30971ad8f2cbC36bd14Ac51156",
  [NetworkId.TESTNET_GOERLI]: "0x007FE7c498A2Cf30971ad8f2cbC36bd14Ac51156",
};

export const BOND_FIXED_TERM_TELLER_ADDRESSES = {
  [NetworkId.MAINNET]: "0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6",
  [NetworkId.TESTNET_GOERLI]: "0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6",
};

export const DISTRIBUTOR_ADDRESSES = {
  [NetworkId.MAINNET]: "0x27e606fdb5C922F8213dC588A434BF7583697866",
  [NetworkId.TESTNET_GOERLI]: "0x2716a1451BDE2B011f0D10ad6599e411d54Ec491",
};

export const V1_STAKING_HELPER_ADDRESSES = {
  [NetworkId.MAINNET]: "0xd542f531d8444C35378adCDD1317172B19556cd7",
  [NetworkId.TESTNET_GOERLI]: "",
};

export const V1_STAKING_ADDRESSES = {
  [NetworkId.MAINNET]: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a",
  [NetworkId.TESTNET_GOERLI]: "0x2868546dB0850fE969de651395887F18e66A2d26",
};

export const LIQUIDITY_REGISTRY_ADDRESSES = {
  [NetworkId.MAINNET]: "0x375E06C694B5E50aF8be8FB03495A612eA3e2275",
  [NetworkId.TESTNET_GOERLI]: "0x24963bEA5a156E3dAb8aBA4FCB8a2dBE8c1Aaa14",
};

export const ZERO_EX_EXCHANGE_PROXY_ADDRESSES = {
  [NetworkId.MAINNET]: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
  [NetworkId.TESTNET_GOERLI]: "0xF91bB752490473B8342a3E964E855b9f9a2A668e",
};

/** the testnet abi is different than the mainnet */
export const CROSS_CHAIN_BRIDGE_ADDRESSES = {
  [NetworkId.MAINNET]: "0x45e563c39cddba8699a90078f42353a57509543a",
  [NetworkId.ARBITRUM]: "0x20B3834091f038Ce04D8686FAC99CA44A0FB285c",
  [NetworkId.TESTNET_GOERLI]: "0xefffab0Aa61828c4af926E039ee754e3edE10dAc",
  [NetworkId.ARBITRUM_GOERLI]: "0xB01432c01A9128e3d1d70583eA873477B2a1f5e1",
};
/** the testnet abi is different than the mainnet */
export const CROSS_CHAIN_BRIDGE_ADDRESSES_TESTNET = {
  [NetworkId.MAINNET]: "",
  [NetworkId.ARBITRUM]: "",
  [NetworkId.TESTNET_GOERLI]: "0xefffab0Aa61828c4af926E039ee754e3edE10dAc",
  [NetworkId.ARBITRUM_GOERLI]: "0xB01432c01A9128e3d1d70583eA873477B2a1f5e1",
};

/** for cross-chain */
export const MINTER_ADDRESSES = {
  [NetworkId.MAINNET]: "0xa90bFe53217da78D900749eb6Ef513ee5b6a491e",
  [NetworkId.ARBITRUM]: "0x8f6406eDbFA393e327822D4A08BcF15503570D87",
  [NetworkId.TESTNET_GOERLI]: "0xefffab0Aa61828c4af926E039ee754e3edE10dAc",
  [NetworkId.ARBITRUM_GOERLI]: "0x78f84998c73655ac2da0aa1e1270f6cb985a343e",
};

/** for display purposes */
export const BRIDGE_CHAINS = {
  [NetworkId.MAINNET]: {
    name: "Ethereum",
    token: "MAINNET",
  },
  [NetworkId.ARBITRUM]: {
    name: "Arbitrum",
    token: "ARBITRUM",
  },
  [NetworkId.TESTNET_GOERLI]: {
    name: "Goerli",
    token: "MAINNET",
  },
  [NetworkId.ARBITRUM_GOERLI]: {
    name: "Arbitrum Goerli",
    token: "ARBITRUM",
  },
};

export const BRIDGEABLE_CHAINS = {
  [NetworkId.MAINNET]: {
    defaultRecChain: NetworkId.ARBITRUM,
    availableChains: [NetworkId.ARBITRUM],
  },
  [NetworkId.ARBITRUM]: {
    defaultRecChain: NetworkId.MAINNET,
    availableChains: [NetworkId.MAINNET],
  },
  [NetworkId.TESTNET_GOERLI]: {
    defaultRecChain: NetworkId.ARBITRUM_GOERLI,
    availableChains: [NetworkId.ARBITRUM_GOERLI],
  },
  [NetworkId.ARBITRUM_GOERLI]: {
    defaultRecChain: NetworkId.TESTNET_GOERLI,
    availableChains: [NetworkId.TESTNET_GOERLI],
  },
};

export const COOLER_CLEARING_HOUSE_V1_ADDRESSES = {
  [NetworkId.MAINNET]: "0xD6A6E8d9e82534bD65821142fcCd91ec9cF31880",
  [NetworkId.TESTNET_GOERLI]: "0x075441d52ff9aedcbe9177d70895c0ad4775a50e", // prev: "0x70fF4ceECe06175EC9D536DCD9264185cE7790Ce",
};

export const COOLER_CLEARING_HOUSE_V2_ADDRESSES = {
  [NetworkId.MAINNET]: "0xE6343ad0675C9b8D3f32679ae6aDbA0766A2ab4c",
  [NetworkId.TESTNET_GOERLI]: "0xbfe14B5950a530A5CE572Cd2FaC6d44c718A3C47",
};
