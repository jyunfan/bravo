import { FleetProvider } from './contexts/FleetContext.tsx'
import { MapContainer } from './components/MapContainer'
import { WidgetManager } from './components/widgets/WidgetManager'
import './App.css'

function App() {
  return (
    <div>
      <FleetProvider>
        <MapContainer />
        <WidgetManager />
      </FleetProvider>
    </div>
  );
}

export default App;
