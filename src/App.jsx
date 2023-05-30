import { useState, createContext } from "react";
import "./App.css";
import Map from "./components/Map";
import SearchBar from "./components/SearchBar";
import Result from "./components/Result";

export const AppContext = createContext();

function App() {
  const [lng, setLng] = useState(3.3792);
  const [lat, setLat] = useState(6.5244);
  const [userIp, setUserIp] = useState("");
  const [location, setLocation] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [isp, setISP] = useState("");

  return (
    <div>
      <AppContext.Provider
        value={{
          lng,
          setLng,
          lat,
          setLat,
          userIp,
          setUserIp,
          location,
          setLocation,
          timeZone,
          setTimeZone,
          isp,
          setISP,
        }}
      >
        <div className="search-area">
          <SearchBar />
          <Result />
        </div>
        <Map />
      </AppContext.Provider>
    </div>
  );
}

export default App;