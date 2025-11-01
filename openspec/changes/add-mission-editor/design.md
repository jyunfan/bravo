## Context
The MapContainer currently displays saved missions with waypoints using deck.gl. Users need to create and edit missions through a visual interface on the map rather than manually entering coordinates. The editor must integrate seamlessly with the existing map visualization and mission management system.

## Goals / Non-Goals
- Goals: 
  - Visual waypoint placement via map clicks
  - Real-time preview of mission path during editing
  - Edit individual waypoint properties (altitude, sequence)
  - Delete waypoints during editing
  - Explicit save/cancel workflow
  - Maximum 50 waypoints per mission (enforced during editing)
  
- Non-Goals:
  - Drag-and-drop waypoint reordering
  - Undo/redo functionality
  - Mission templates or copying
  - Collision detection or no-fly zones
  - Auto-save functionality
  - Flight time/distance calculations

## Decisions
- Decision: Integrate editor directly into MapContainer rather than separate modal
  - Rationale: Provides seamless visual editing experience with immediate feedback
  - Alternative: Separate modal/panel - rejected due to disconnect from map visualization

- Decision: Use temporary state for unsaved waypoints, commit via FleetContext on save
  - Rationale: Keeps separation of concerns, allows cancellation without side effects
  - Alternative: Direct FleetContext updates - rejected due to inability to cancel easily

- Decision: Preview layer uses distinct styling (lower opacity, dashed lines) to differentiate from saved missions
  - Rationale: Clear visual distinction prevents confusion between draft and saved missions
  - Alternative: Same styling with indicator - rejected as less clear

- Decision: Default altitude for new waypoints set to reasonable value (e.g., 50m), editable via property panel
  - Rationale: Provides sensible defaults while allowing customization
  - Alternative: Prompt for altitude on each click - rejected as too disruptive

- Decision: Support waypoint deletion during editing via context menu or delete button
  - Rationale: Essential for mission editing workflow, allows users to remove unwanted waypoints
  - Alternative: No deletion - rejected as too limiting for editing capabilities

- Decision: Enforce maximum 50 waypoints per mission during editing with immediate validation feedback
  - Rationale: Aligns with existing MISSION_CONSTRAINTS.maxWaypoints validation, prevents excessive mission complexity
  - Alternative: No limit - rejected due to existing validation constraints and performance considerations

## Risks / Trade-offs
- Risk: Click handlers for editor may interfere with map pan/zoom
  - Mitigation: Use edit mode toggle to enable/disable editor interactions
  
- Risk: Too many preview layers may impact performance
  - Mitigation: Single preview layer for all editing, optimize deck.gl layer updates
  
- Risk: Unsaved changes lost if user navigates away
  - Trade-off: Acceptable given explicit save/cancel workflow requirement

## Migration Plan
- No migration needed - this is additive functionality
- Existing missions remain unchanged
- Existing mission creation/update APIs in FleetContext continue to work


