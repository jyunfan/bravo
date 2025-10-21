import { MapContainer } from './components/MapContainer'
import './App.css'
import { DroneTelemetryWidget } from './components/widgets/DroneTelemetryWidget';
import { Rnd } from 'react-rnd'

function App() {
  return (
    <div>
      <MapContainer/>
      <Rnd
        default={{
          x: 0,
          y: 0,
          width: 320,
          height: 200,
        }}
      >
        <DroneTelemetryWidget />
      </Rnd>
    </div>

  );
}

export default App;
