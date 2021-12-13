import { useEffect, useState } from "react";
import {
  networks,
  changeCurrentNetwork,
  currentNetwork,
} from "../../constants/addresses";

export const SelectChainDropdown = () => {
  const [selectValue, setSelectValue] = useState(currentNetwork);

  useEffect(() => {
    changeCurrentNetwork(selectValue);
    console.log(currentNetwork);
  }, [selectValue]);

  return (
    <select
      id="networkSelect"
      onChange={(e) => {
        setSelectValue(e.target.value);
      }}
      value={selectValue}
      className="absolute top-4 right-4"
    >
      {networks.map((network) => {
        return (
          <option key={network} value={network}>
            {network}
          </option>
        );
      })}
    </select>
  );
};