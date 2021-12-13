import MetaMaskButton from "../components/ConnectMetamaskButton/indes"
import { useEthContext } from "../context/EthereumContext"
import { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import axios from "axios";
import { currentChainInfo } from "../constants/addresses";
import NFTTile from "../components/NFTTile";
import { SelectChainDropdown } from "../components/SelectChainDropdown";
import { time } from "console";

type NftItem = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export default function Home() {
  const { accounts, provider, currentAcc } = useEthContext();
  const [nfts, setNfts] = useState<Array<NftItem>>();
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  useEffect(() => {
    if (!currentAcc) {
      return;
    }

    fetchNftByOwner();
  }, [currentAcc]);

  const fetchNftByOwner = async () => {
    const { data }: any = await axios.get(
      currentChainInfo.apiDomain + "/protocol/v0.1/ethereum/nft/items/byOwner",
      {
        params: {
          owner: currentAcc,
        },
      }
    );

    setIsLoading(false);

    let fetchedItems: Array<NftItem> = data.items.map((item) => {
      return {
        id: item.id,
        name: item.meta.name,
        imageUrl: item.meta.image?.url.ORIGINAL,
        description: item.meta.description,
      };
    });

    setNfts(fetchedItems);
    console.log(fetchedItems);
  };

  const handleConnectWallet = async () => {
    await provider.request({ method: `eth_requestAccounts` });
  };

  const handleSelectNft = () => {};

  return (
    <div className="flex items-center p-4 min-h-screen w-full justify-center bg-yellow-400 relative">
      <SelectChainDropdown />
      <main>
        {!currentAcc && (
          <MetaMaskButton onClick={handleConnectWallet} accounts={accounts} />
        )}

        {currentAcc && isLoading && (
          <div className="w-full h-full flex items-center justify-start flex-col">
            <Loader type="TailSpin" color="#000" height={50} width={50} />
            <p className="mt-10">Loading your NFTs...</p>
          </div>
        )}

        {currentAcc && !isLoading && (
          <div className="w-full h-full flex items-center justify-start flex-wrap">
            {nfts && nfts.length > 0
              ? nfts.map((nft) => {
                  return (
                    <NFTTile
                      name={nft.name}
                      id={nft.id}
                      imgSrc={nft.imageUrl}
                      key={nft.id}
                    />
                  );
                })
              : "It seems that you don't have any NFTs yet :)"}
          </div>
        )}
      </main>
    </div>
  );
}
