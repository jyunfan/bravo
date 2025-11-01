## Why
Operators need a visual interface to create and edit missions by clicking on the map to add waypoints, rather than manually entering coordinates. This enables intuitive mission planning with immediate visual feedback of the planned flight path.

## What Changes
- Visual map-based mission editor integrated with MapContainer
- Click-to-add waypoint functionality on the map
- Real-time preview of mission path during editing
- Waypoint property editor (altitude, sequence)
- Explicit save/cancel workflow for mission editing
- Edit mode toggle to enable/disable editor interactions

## Impact
- Affected specs: `mission-management`
- Affected code: 
  - `src/components/MapContainer/MapContainer.tsx` - Add editor interactions and preview layers
  - `src/components/MissionEditor/` - New editor component (if needed) or editor controls
  - `src/contexts/FleetContext.tsx` - May extend with temporary edit state
  - Mission validation and utilities remain unchanged

