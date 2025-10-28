## 1. Type Definitions
- [x] 1.1 Create mission.ts type file with Mission interface
- [x] 1.2 Define Waypoint interface with coordinates and actions
- [x] 1.3 Add MissionStatus enum (planned, active, completed, failed, cancelled)
- [x] 1.4 Create MissionType enum (surveillance, delivery, inspection, custom)

## 2. Mission Management
- [x] 2.1 Add mission assignment to Drone interface
- [x] 2.2 Create mission validation utilities
- [x] 2.3 Add waypoint validation (coordinate bounds, action types)
- [x] 2.4 Implement mission duration calculation

## 3. Integration
- [x] 3.1 Update FleetContext to include mission state
- [x] 3.2 Add mission-related actions to fleet reducer
- [x] 3.3 Update drone status to reflect mission state
- [x] 3.4 Add mission filtering to fleet stats

## 4. Testing
- [ ] 4.1 Write unit tests for mission type definitions
- [ ] 4.2 Test waypoint validation logic
- [ ] 4.3 Test mission assignment scenarios
- [ ] 4.4 Add integration tests for mission state management
