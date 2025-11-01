## 1. Mission Editor State Management
- [x] 1.1 Add edit mode state to MapContainer or create MissionEditor context
- [x] 1.2 Add temporary waypoint editing state (unsaved changes)
- [x] 1.3 Implement save/cancel handlers that integrate with FleetContext

## 2. Map-Based Waypoint Editing
- [x] 2.1 Add click handler to MapContainer for adding waypoints in edit mode
- [x] 2.2 Convert map click coordinates to waypoint format (lat/lng/altitude)
- [x] 2.3 Update waypoint sequence automatically when adding new waypoints
- [x] 2.4 Add visual indicator for waypoints being edited (different from saved waypoints)
- [x] 2.5 Enforce maximum 50 waypoints limit with validation message when limit reached
- [x] 2.6 Prevent waypoint addition when at maximum limit

## 3. Real-Time Path Preview
- [x] 3.1 Create preview layer in deck.gl that shows unsaved mission path
- [x] 3.2 Distinguish preview path from saved missions (different styling/opacity)
- [x] 3.3 Update preview layer when waypoints are added/removed/modified during editing

## 4. Waypoint Property Editing
- [x] 4.1 Create waypoint editor panel/modal for editing altitude and properties
- [x] 4.2 Allow clicking on waypoints in edit mode to open property editor
- [x] 4.3 Validate waypoint properties (altitude bounds, coordinate validation)
- [x] 4.4 Show validation errors in the waypoint editor
- [x] 4.5 Add delete waypoint functionality to property editor
- [x] 4.6 Implement waypoint deletion with automatic sequence renumbering

## 5. Editor Controls UI
- [x] 5.1 Add "Edit Mission" button/control to initiate edit mode (handled via handleEditMission function)
- [x] 5.2 Add "New Mission" button that enables edit mode for creation
- [x] 5.3 Add save button that validates and commits changes via FleetContext
- [x] 5.4 Add cancel button that discards unsaved changes and exits edit mode
- [x] 5.5 Show clear visual indication when in edit mode (UI state/banner)

## 6. Integration Testing
- [x] 6.1 Test waypoint addition via map clicks
- [x] 6.2 Test waypoint property editing
- [x] 6.3 Test waypoint deletion and sequence renumbering
- [x] 6.4 Test maximum waypoint limit enforcement (50 waypoints)
- [x] 6.5 Test save workflow with validation
- [x] 6.6 Test cancel workflow discarding changes
- [x] 6.7 Verify real-time preview updates correctly

