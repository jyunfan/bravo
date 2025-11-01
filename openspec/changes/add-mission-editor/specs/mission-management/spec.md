## ADDED Requirements

### Requirement: Visual Map-Based Mission Editor
The system SHALL provide a visual mission editor that allows users to create and edit missions by clicking on the map to add waypoints, with real-time preview of the mission path during editing.

#### Scenario: Creating a new mission with map clicks
- **WHEN** user activates "New Mission" mode
- **THEN** the map enters edit mode and displays an editor indicator
- **WHEN** user clicks on the map
- **THEN** a new waypoint is added at the clicked location with default altitude
- **WHEN** user clicks additional locations
- **THEN** waypoints are added in sequence order and connected with a preview path line
- **WHEN** user clicks save
- **THEN** the mission is validated, saved via FleetContext, and edit mode exits

#### Scenario: Editing existing mission waypoints
- **WHEN** user activates "Edit Mission" for an existing mission
- **THEN** the map enters edit mode showing the mission's current waypoints
- **WHEN** user clicks on the map to add a new waypoint
- **THEN** a new waypoint is added to the mission with preview path updated
- **WHEN** user clicks on an existing waypoint
- **THEN** a waypoint property editor opens allowing altitude and sequence modification
- **WHEN** user modifies waypoint properties and saves
- **THEN** preview updates to reflect changes
- **WHEN** user clicks save button
- **THEN** changes are validated and committed via FleetContext updateMission

#### Scenario: Cancelling mission editing
- **WHEN** user is in edit mode with unsaved changes
- **WHEN** user clicks cancel
- **THEN** all unsaved waypoint changes are discarded
- **THEN** edit mode exits and map returns to normal display
- **THEN** no changes are persisted to FleetContext

#### Scenario: Real-time preview during editing
- **WHEN** user is in edit mode
- **THEN** a preview layer displays all waypoints and connecting paths with distinct styling
- **WHEN** user adds, removes, or modifies waypoints
- **THEN** the preview layer updates immediately to reflect current draft state
- **WHEN** user saves or cancels
- **THEN** preview layer is removed and saved missions display normally

#### Scenario: Deleting waypoints during editing
- **WHEN** user is in edit mode with waypoints
- **WHEN** user selects a waypoint and chooses delete option
- **THEN** the waypoint is removed from the draft mission
- **THEN** remaining waypoint sequences are automatically renumbered
- **THEN** preview path updates to reflect deletion
- **WHEN** user saves
- **THEN** deleted waypoint is not included in saved mission

#### Scenario: Maximum waypoint limit enforcement
- **WHEN** user is in edit mode with 50 waypoints
- **WHEN** user attempts to add another waypoint via map click
- **THEN** system prevents waypoint addition and displays validation message indicating 50 waypoint maximum
- **WHEN** user deletes a waypoint
- **THEN** waypoint count decreases below 50 and user can add new waypoints again

### Requirement: Waypoint Property Editor
The system SHALL allow users to edit individual waypoint properties including altitude and sequence number during mission editing.

#### Scenario: Editing waypoint altitude
- **WHEN** user clicks on a waypoint during edit mode
- **THEN** a waypoint property editor panel opens
- **WHEN** user modifies the altitude value
- **THEN** validation runs to ensure altitude is within bounds (0-10000m)
- **WHEN** altitude is invalid
- **THEN** validation error is displayed
- **WHEN** altitude is valid and user confirms
- **THEN** preview updates to reflect new altitude and editor closes

#### Scenario: Editing waypoint sequence
- **WHEN** user modifies waypoint sequence number in property editor
- **THEN** sequence validation ensures no duplicates
- **WHEN** user confirms sequence change
- **THEN** waypoints reorder and preview path updates to reflect new sequence

#### Scenario: Deleting waypoint from property editor
- **WHEN** user opens waypoint property editor during edit mode
- **THEN** editor displays delete option
- **WHEN** user clicks delete
- **THEN** waypoint is removed from draft mission and sequences are renumbered
- **THEN** preview updates immediately and property editor closes

## MODIFIED Requirements

### Requirement: The system SHALL provide comprehensive type definitions for drone missions including waypoints, status tracking, and mission metadata.
The system SHALL provide comprehensive type definitions for drone missions including waypoints, status tracking, and mission metadata. The system SHALL support visual creation and editing of missions through map-based interactions.

#### Scenario: User creates a new mission
- **WHEN** user creates a new mission via visual editor or programmatic API
- **THEN** system validates waypoint coordinates and mission parameters
- **THEN** mission can be created either through map-based visual editor or traditional form-based entry

#### Scenario: Mission is assigned to a drone
- **WHEN** mission is assigned to a drone
- **THEN** system updates mission status to active and drone status to in-mission

