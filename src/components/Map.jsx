import { useRef, useEffect, useState, useContext } from "react";
import mapboxgl from "mapbox-gl";
import { AppContext } from "../App";

mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX;

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom, setZoom] = useState(7);
  const { lng, setLng, lat, setLat, userIp, setLocation, setTimeZone, setISP } =
    useContext(AppContext);

  const getAddress = async () => {
    const resp = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${
        import.meta.env.VITE_GEO_IPIFY
      }&ipAddress=${userIp}`
    );
    const data = await resp.json();
    setLng(data.location.lng);
    setLat(data.location.lat);
    setISP(data.isp);
    setTimeZone(`UTC${data.location.timezone}`);
    setLocation(`${data.location.country}, ${data.location.city}`);
  };

  useEffect(() => {
    getAddress();
  }, [userIp]);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
    const marker = new mapboxgl.Marker({ color: "red" })
      .setLngLat([lng, lat])
      .addTo(map.current);
  }, [lng, lat, userIp]);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.setCenter([lng, lat]);
    const marker = new mapboxgl.Marker({ color: "red" })
      .setLngLat([lng, lat])
      .addTo(map.current);
  }, [lng, lat, userIp]);

  return (
    <div className="map__wrapper">
      <div className="map__bar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container"></div>
    </div>
  );
}
