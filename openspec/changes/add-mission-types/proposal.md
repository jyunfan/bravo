## Why
The drone fleet management system needs to support mission planning and execution capabilities. Currently, the system only tracks drone status but lacks the ability to define missions with waypoints, which is essential for autonomous flight operations and route planning.

## What Changes
- Add mission type definitions with waypoint support
- Create mission status tracking (planned, active, completed, failed)
- Define waypoint data structure with coordinates and actions
- Add mission assignment to drone entities
- Support mission validation and constraints

## Impact
- Affected specs: mission-management
- Affected code: src/types/drone.ts, src/types/mission.ts (new), src/contexts/FleetContext.tsx
- New capability: Mission planning and waypoint management
