import { FleetProvider } from './contexts/FleetContext.tsx'
import { MapContainer } from './components/MapContainer'
import { WidgetManager } from './components/widgets/WidgetManager'
import { BulletinPanel } from './components/BulletinPanel/BulletinPanel.tsx'
import './App.css'

function App() {
  return (
    <div>
      <FleetProvider>
        <div className="flex">
        <BulletinPanel className="flex-shrink-0" />
        <MapContainer />
        <WidgetManager />
        </div>
      </FleetProvider>
    </div>
  );
}

export default App;
