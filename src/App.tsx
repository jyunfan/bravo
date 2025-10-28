import { FleetProvider } from './contexts/FleetContext.tsx'
import { MapContainer } from './components/MapContainer'
import { WidgetManager } from './components/widgets/WidgetManager'
import { BulletinPanel } from './components/BulletinPanel/BulletinPanel.tsx'
import './App.css'

import {Map, useControl} from 'react-map-gl/maplibre';
import {MapboxOverlay} from '@deck.gl/mapbox';
import type {DeckProps} from '@deck.gl/core';
import {ScatterplotLayer} from '@deck.gl/layers';

function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

function App() {
  /*
  const layers = [
    new ScatterplotLayer({
      id: 'deckgl-circle',
      data: [
        {position: [0.45, 51.47]}
      ],
      getPosition: d => d.position,
      getFillColor: [255, 0, 0, 100],
      getRadius: 1000,
      beforeId: 'watername_ocean' // In interleaved mode render the layer under map labels
    })
  ];

  return (
    <Map
      initialViewState={{
        longitude: 0.45,
        latitude: 51.47,
        zoom: 11
      }}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    >
      <DeckGLOverlay layers={layers} />
    </Map>
  );
  */
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
