import { useState, useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet/hooks'
import markerIcon from './assets/icon-location.svg'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
// import './styles/app.scss'

function App() {

  const [userInput, setUserInput] = useState('')
  const [userCoordinates, setUserCoordinates] = useState([52.4275, -1.84287])
  const [userData, setUserData] = useState({
    IP: '192.212.174.101',
    city: 'Brooklyn',
    region: 'NY',
    postalCode: '10001',
    timezone: '-05:00',
    isp: 'SpaceX Starlink'
  })
  const [placeholderText, setPlaceholderText] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const input = useRef(null)
  const btn = useRef(null)

  let address = `${userData.city}, ${userData.region} ${userData.postalCode}`
  let inputParam = 'ipAddress'

  window.addEventListener('load', placeholderTextFunc)
  window.addEventListener('resize', placeholderTextFunc)

  useEffect(() => {
    fetchData(true)
  }, [])

  function customIcon() {
    return L.icon({
      iconUrl: `${markerIcon}`,
      iconSize: [46, 56]
    })
  }

  function fetchData(firstLoad) {
    let url = ''
    if (firstLoad) {
      url = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_FS0dVlmLF0F0PfD53SRZkOs8HzT4P'
    } else {
      url = `https://geo.ipify.org/api/v2/country,city?apiKey=at_FS0dVlmLF0F0PfD53SRZkOs8HzT4P${inputParam}=${userInput}`
    }
    fetch(url)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.status);
      })
      .then(data => {
        setUserCoordinates([data.location.lat, data.location.lng])
        setUserData({
          IP: data.ip,
          city: data.location.city,
          region: data.location.region,
          postalCode: data.location.postalCode,
          timezone: data.location.timezone,
          isp: data.isp
        })
      })
      .catch(() => {
        let param = inputParam === 'domain' ? inputParam : 'IP address'
        setErrMsg(`${param} not found`)
        setUserInput('')
        setPlaceholderText('')
      })
  }

  function placeholderTextFunc() {
    if (window.innerWidth < 500) {
      setPlaceholderText('')
      setErrMsg('')
    } else {
      setPlaceholderText('Search for any IP address or domain')
      setErrMsg('')
    }
  }

  function onChange(e) {
    setErrMsg('')
    setUserInput(e.target.value)
  }

  function submitIP(e) {
    e.preventDefault()
    if (!e.target.checkValidity()) {
      if (e.target[0].validity.valueMissing) {
        if (window.innerWidth < 500) {
          setPlaceholderText('')
          setErrMsg('required')
        } else {
          setPlaceholderText('')
          setErrMsg('Enter an IP address or domain name')
        }
      }
      return
    }
    ipOrDom(userInput)
      ? inputParam = 'ipAddress'
      : inputParam = 'domain'
    fetchData(false)
  }

  // ip address returns true : domain name returns false
  function ipOrDom(str) {
    const regex = new RegExp('[0-9]+')
    let input = str.split('.').join().replaceAll(',', '')
    return regex.test(input)
  }

  function onFocus() {
    setErrMsg('')
  }

  function MyComponent() {
    const map = useMap()
    map.panTo(new L.LatLng(userCoordinates[0], userCoordinates[1]))
    map.setZoom(14)
    return null
  }

  return (
    <main>
      <section>
        <h1>IP Address Tracker</h1>
        <form noValidate onSubmit={(e) => submitIP(e)}>
          <span
            onClick={() => input.current.focus()}>{errMsg}</span>
          <label htmlFor="input">IP address</label>
          <input
            type="text"
            value={userInput}
            placeholder={placeholderText}
            onChange={(e) => onChange(e)}
            onFocus={onFocus}
            id='input'
            required
            ref={input}
            className={errMsg ? 'err' : null}
            autoFocus />
          <button
            onClick={() => btn.current.focus()}
            ref={btn}
            aria-label='Submit'></button>
        </form>
        <dl className='outputContainer'>
          <div><dt>IP ADDRESS</dt><dd>{userData.IP}</dd></div>
          <div><dt>LOCATION</dt><dd>{address}</dd></div>
          <div><dt>TIMEZONE</dt><dd>{`UTC ${userData.timezone}`}</dd></div>
          <div><dt>ISP</dt><dd>{userData.isp}</dd></div>
        </dl>
      </section>
      <MapContainer center={[userCoordinates[0], userCoordinates[1]]}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <MyComponent />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[userCoordinates[0], userCoordinates[1]]}
          icon={customIcon()}
          keyboard={false}
        >
        </Marker>
      </MapContainer>
    </main>
  )
}

export default App
