/**
 * MapContainer Component
 * 
 * MapLibre GL map integration with controls, drone markers, mission waypoints, and mission editor
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {MapboxOverlay} from '@deck.gl/mapbox';
import {ScatterplotLayer, LineLayer, TextLayer} from '@deck.gl/layers';
import { useFleet } from '../../contexts/FleetContext';
import { processMissionsForVisualization, waypointToDeckGLPosition, MISSION_CONSTRAINTS } from '../../utils/missionUtils';
import { WaypointEditor } from '../MissionEditor';
import { generateWaypointId, sortWaypointsBySequence } from '../../utils/missionUtils';
import type { Waypoint } from '../../types/mission';

interface MapContainerProps {
  className?: string;
}

type EditMode = 'none' | 'new' | 'edit';

export function MapContainer({ className = '' }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const deckOverlayRef = useRef<MapboxOverlay | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Edit mode state
  const [editMode, setEditMode] = useState<EditMode>('none');
  const [editingMissionId, setEditingMissionId] = useState<string | null>(null);
  const [draftWaypoints, setDraftWaypoints] = useState<Waypoint[]>([]);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  
  // Mission metadata for new missions
  const [newMissionName, setNewMissionName] = useState<string>('');
  const [newMissionPriority, setNewMissionPriority] = useState<number>(5);
  
  const fleet = useFleet();
  
  // Process saved missions for visualization (excluding mission being edited)
  const savedMissions = fleet.state.missions.filter(m => m.id !== editingMissionId);
  const { waypointData, lineData, textData } = processMissionsForVisualization(savedMissions);
  
  // Process draft waypoints for preview
  const getPreviewData = useCallback(() => {
    if (draftWaypoints.length === 0) {
      return { waypointData: [], lineData: [], textData: [] };
    }
    
    const sortedWaypoints = sortWaypointsBySequence(draftWaypoints);
    const previewColor = editMode === 'new' ? [255, 140, 0, 180] : [128, 128, 128, 180]; // Orange for new, gray for edit
    const previewLineColor = editMode === 'new' ? [255, 140, 0, 150] : [128, 128, 128, 150];
    
    const previewWaypointData = sortedWaypoints.map(waypoint => ({
      position: waypointToDeckGLPosition(waypoint),
      radius: 10,
      color: previewColor,
      waypointId: waypoint.id,
      sequence: waypoint.sequence,
      altitude: waypoint.coordinates.altitude,
      isPreview: true
    }));
    
    const previewLineData: any[] = [];
    for (let i = 0; i < sortedWaypoints.length - 1; i++) {
      const current = sortedWaypoints[i];
      const next = sortedWaypoints[i + 1];
      
      previewLineData.push({
        sourcePosition: waypointToDeckGLPosition(current),
        targetPosition: waypointToDeckGLPosition(next),
        color: previewLineColor,
        width: 4,
        isPreview: true
      });
    }
    
    const previewTextData = sortedWaypoints.map(waypoint => ({
      position: waypointToDeckGLPosition(waypoint),
      text: `${waypoint.sequence}`,
      color: [255, 255, 255, 255],
      size: 14,
      waypointId: waypoint.id
    }));
    
    return { waypointData: previewWaypointData, lineData: previewLineData, textData: previewTextData };
  }, [draftWaypoints, editMode]);
  
  const previewData = getPreviewData();
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      //style: 'https://demotiles.maplibre.org/style.json',
      //style: 'https://api.maptiler.com/maps/hybrid/style.json?key=kSVQtZ7ooA4Sxv379Qgq',
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [121.4248, 25.1794], // Default center
      zoom: 11,
      attributionControl: false
    });

    // Handle map load
    map.current.on('load', () => {
      setIsMapLoaded(true);
      
      // Add navigation controls after map loads
      if (map.current) {
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        
        const deckOverlay = new MapboxOverlay({
          interleaved: true,
          layers: []
        });
        
        deckOverlayRef.current = deckOverlay;
        map.current.addControl(deckOverlay);
      }
      
      // Trigger resize after map loads to ensure proper dimensions
      setTimeout(() => {
        if (map.current) {
          map.current.resize();
        }
      }, 100);
    });

    // Handle map resize
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  // Update deck.gl layers when data changes
  useEffect(() => {
    if (!deckOverlayRef.current || !isMapLoaded) return;
    
    const allLayers = [
      // Saved mission waypoint lines (paths)
      new LineLayer({
        id: 'mission-lines',
        data: lineData,
        getSourcePosition: d => d.sourcePosition,
        getTargetPosition: d => d.targetPosition,
        getColor: d => d.color,
        getWidth: d => d.width,
        widthUnits: 'pixels',
        pickable: true,
        beforeId: 'watername_ocean'
      }),
      // Saved mission waypoints (circles)
      new ScatterplotLayer({
        id: 'mission-waypoints',
        data: waypointData,
        getPosition: d => d.position,
        getFillColor: d => d.color,
        getRadius: d => d.radius,
        radiusUnits: 'pixels',
        pickable: true,
        beforeId: 'watername_ocean'
      }),
      // Saved waypoint sequence numbers
      new TextLayer({
        id: 'waypoint-labels',
        data: textData,
        getPosition: d => d.position,
        getText: d => d.text,
        getColor: d => d.color,
        getSize: d => d.size,
        sizeUnits: 'pixels',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        beforeId: 'watername_ocean'
      }),
      // Preview waypoint lines (if editing)
      ...(previewData.lineData.length > 0 ? [
        new LineLayer({
          id: 'preview-lines',
          data: previewData.lineData,
          getSourcePosition: d => d.sourcePosition,
          getTargetPosition: d => d.targetPosition,
          getColor: d => d.color,
          getWidth: d => d.width,
          widthUnits: 'pixels',
          pickable: false,
          beforeId: 'watername_ocean'
        })
      ] : []),
      // Preview waypoints (if editing)
      ...(previewData.waypointData.length > 0 ? [
        new ScatterplotLayer({
          id: 'preview-waypoints',
          data: previewData.waypointData,
          getPosition: d => d.position,
          getFillColor: d => d.color,
          getRadius: d => d.radius,
          radiusUnits: 'pixels',
          pickable: true,
          onClick: (info) => {
            if (info.object && editMode !== 'none') {
              const waypointId = info.object.waypointId;
              const waypoint = draftWaypoints.find(w => w.id === waypointId);
              if (waypoint) {
                setSelectedWaypoint(waypoint);
              }
            }
          },
          beforeId: 'watername_ocean'
        })
      ] : []),
      // Preview waypoint labels (if editing)
      ...(previewData.textData.length > 0 ? [
        new TextLayer({
          id: 'preview-labels',
          data: previewData.textData,
          getPosition: d => d.position,
          getText: d => d.text,
          getColor: d => d.color,
          getSize: d => d.size,
          sizeUnits: 'pixels',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          beforeId: 'watername_ocean'
        })
      ] : [])
    ];
    
    if (deckOverlayRef.current) {
      deckOverlayRef.current.setProps({ layers: allLayers });
    }
  }, [waypointData, lineData, textData, previewData, isMapLoaded, draftWaypoints, editMode]);
  
  // Handle map clicks in edit mode
  useEffect(() => {
    if (!map.current || !isMapLoaded || editMode === 'none') return;
    
    const handleClick = (e: maplibregl.MapMouseEvent) => {
      
      // Add new waypoint at clicked location
      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;
      
      // Check maximum waypoint limit
      if (draftWaypoints.length >= MISSION_CONSTRAINTS.maxWaypoints) {
        setValidationMessage(`Maximum ${MISSION_CONSTRAINTS.maxWaypoints} waypoints allowed`);
        setTimeout(() => setValidationMessage(null), 3000);
        return;
      }
      
      // Add new waypoint with default altitude
      const newWaypoint: Waypoint = {
        id: generateWaypointId(),
        coordinates: {
          latitude: lat,
          longitude: lng,
          altitude: 50 // Default altitude
        },
        sequence: draftWaypoints.length + 1
      };
      
      setDraftWaypoints([...draftWaypoints, newWaypoint]);
      setValidationMessage(null);
    };
    
    map.current.on('click', handleClick);
    
    return () => {
      if (map.current) {
        map.current.off('click', handleClick);
      }
    };
  }, [map.current, isMapLoaded, editMode, draftWaypoints]);
  
  // Start editing new mission
  const handleNewMission = () => {
    setEditMode('new');
    setEditingMissionId(null);
    setDraftWaypoints([]);
    setSelectedWaypoint(null);
    setNewMissionName('');
    setNewMissionPriority(5);
    setValidationMessage(null);
  };
  
  // Start editing existing mission
  // TODO: This function can be called from BulletinPanel or other components to enable editing
  // Currently unused but kept for future integration with mission list UI
  /*
  const handleEditMission = (missionId: string) => {
    const mission = fleet.getMissionById(missionId);
    if (!mission) return;
    
    setEditMode('edit');
    setEditingMissionId(missionId);
    setDraftWaypoints([...mission.waypoints]);
    setSelectedWaypoint(null);
    setValidationMessage(null);
  };
  */
  
  // Save mission
  const handleSave = async () => {
    if (draftWaypoints.length < MISSION_CONSTRAINTS.minWaypoints) {
      setValidationMessage(`At least ${MISSION_CONSTRAINTS.minWaypoints} waypoint required`);
      setTimeout(() => setValidationMessage(null), 3000);
      return;
    }
    
    if (editMode === 'new') {
      if (!newMissionName.trim()) {
        setValidationMessage('Mission name is required');
        setTimeout(() => setValidationMessage(null), 3000);
        return;
      }
      
      await fleet.addMission({
        name: newMissionName,
        waypoints: draftWaypoints.map(w => ({
          coordinates: w.coordinates,
          sequence: w.sequence
        })),
        priority: newMissionPriority
      });
    } else if (editMode === 'edit' && editingMissionId) {
      await fleet.updateMission(editingMissionId, {
        waypoints: draftWaypoints.map(w => ({
          coordinates: w.coordinates,
          sequence: w.sequence
        }))
      });
    }
    
    handleCancel();
  };
  
  // Cancel editing
  const handleCancel = () => {
    setEditMode('none');
    setEditingMissionId(null);
    setDraftWaypoints([]);
    setSelectedWaypoint(null);
    setNewMissionName('');
    setNewMissionPriority(5);
    setValidationMessage(null);
  };
  
  // Handle waypoint save from editor
  const handleWaypointSave = (updatedWaypoint: Waypoint) => {
    setDraftWaypoints(draftWaypoints.map(w => 
      w.id === updatedWaypoint.id ? updatedWaypoint : w
    ));
    
    // Renumber sequences
    const sorted = sortWaypointsBySequence(draftWaypoints.map(w => 
      w.id === updatedWaypoint.id ? updatedWaypoint : w
    ));
    const renumbered = sorted.map((w, idx) => ({ ...w, sequence: idx + 1 }));
    setDraftWaypoints(renumbered);
    
    setSelectedWaypoint(null);
  };
  
  // Handle waypoint delete
  const handleWaypointDelete = (waypointId: string) => {
    const filtered = draftWaypoints.filter(w => w.id !== waypointId);
    // Renumber sequences
    const renumbered = filtered.map((w, idx) => ({ ...w, sequence: idx + 1 }));
    setDraftWaypoints(renumbered);
    setSelectedWaypoint(null);
  };
  
  return (
    <div className={`w-full h-full ${className}`} style={{ height: '100vh', position: 'relative' }}>
      <div ref={mapContainer} className="w-full h-full" style={{ height: '100%' }} />
      
      {/* Hide Mission Status Legend */}
      {false && isMapLoaded && editMode === 'none' && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Mission Status</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(0, 123, 255)' }}></div>
              <span className="text-gray-700">Planned</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(40, 167, 69)' }}></div>
              <span className="text-gray-700">Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(108, 117, 125)' }}></div>
              <span className="text-gray-700">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(220, 53, 69)' }}></div>
              <span className="text-gray-700">Failed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(255, 193, 7)' }}></div>
              <span className="text-gray-700">Cancelled</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Click on waypoints to view mission details. Numbers show waypoint sequence.
            </p>
          </div>
        </div>
      )}
      
      {/* Hide Editor Controls */}
      {false && isMapLoaded && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
          {editMode === 'none' ? (
            <div className="space-y-2">
              <button
                onClick={handleNewMission}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                New Mission
              </button>
            </div>
          ) : (
            <div className="space-y-3 min-w-[200px]">
              {/* Edit Mode Banner */}
              <div className={`p-2 rounded text-xs font-semibold text-center ${editMode === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                {editMode === 'new' ? 'Creating New Mission' : 'Editing Mission'}
              </div>
              
              {/* Mission Name (for new missions) */}
              {editMode === 'new' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mission Name
                  </label>
                  <input
                    type="text"
                    value={newMissionName}
                    onChange={(e) => setNewMissionName(e.target.value)}
                    placeholder="Enter mission name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              )}
              
              {/* Mission Priority (for new missions) */}
              {editMode === 'new' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority (1-10)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newMissionPriority}
                    onChange={(e) => setNewMissionPriority(parseInt(e.target.value, 10) || 5)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              )}
              
              {/* Waypoint Count */}
              <div className="text-sm text-gray-600">
                Waypoints: {draftWaypoints.length} / {MISSION_CONSTRAINTS.maxWaypoints}
              </div>
              
              {/* Instructions */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Click on map to add waypoints</p>
                <p>• Click waypoints to edit</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                >
                  Cancel
                </button>
              </div>
              
            </div>
          )}
        </div>
      )}
      
      {/* Validation Message */}
      {validationMessage && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-20">
          {validationMessage}
        </div>
      )}
      
      {/* Waypoint Editor */}
      {selectedWaypoint && (
        <WaypointEditor
          waypoint={selectedWaypoint}
          onSave={handleWaypointSave}
          onDelete={handleWaypointDelete}
          onClose={() => setSelectedWaypoint(null)}
        />
      )}
      
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
