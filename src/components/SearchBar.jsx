import React, { useContext, useEffect, useState } from "react";
import iconArrow from "../assets/images/icon-arrow.svg";
import { AppContext } from "../App";

export default function SearchBar() {
  const { setUserIp } = useContext(AppContext);
  const [searchIP, setSearchIP] = useState("");

  async function getIPAddress() {
    try {
      const response = await fetch("https://api.ipify.org/?format=json");
      const data = await response.json();
      const ipAddress = data.ip;
      setUserIp(ipAddress);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    getIPAddress();
  }, []);

  function formatIPAddress(ipAddress) {
    const formattedIP = ipAddress.replace(/[^\d.]/g, "");
    return formattedIP;
  }

  function handleInputChange(e) {
    const inputValue = e.target.value;
    const formattedValue = formatIPAddress(inputValue);
    setSearchIP(formattedValue);
  }

  function handleUserSearchIp() {
    setUserIp(searchIP);
    // setSearchIP("");
  }

  function handleKeyDown(e) {
    if (e.key === "Backspace" && searchIP.length === 1) {
      setSearchIP("");
    }
  }

  return (
    <div className="search__input--emul">
      <input
        type="search"
        className="search__input"
        autoFocus
        maxLength={15}
        value={searchIP}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <a href="./"></a>
      <button
        className="search__button"
        onClick={() => {
          handleUserSearchIp();
        }}
      >
        <img src={iconArrow} alt="Search" />
      </button>
    </div>
  );
}
