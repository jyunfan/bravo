import { useState } from 'react'
import { Rnd } from 'react-rnd'
import { MapContainer } from './components/MapContainer'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <MapContainer/>
    </div>
  );
}

export default App;
