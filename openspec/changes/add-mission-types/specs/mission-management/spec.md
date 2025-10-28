## ADDED Requirements

### Requirement: Mission Type Definition
The system SHALL provide comprehensive type definitions for drone missions including waypoints, status tracking, and mission metadata.

#### Scenario: Mission creation with waypoints
- **WHEN** user creates a new mission
- **THEN** system validates waypoint coordinates and mission parameters

#### Scenario: Mission status tracking
- **WHEN** mission is assigned to a drone
- **THEN** system updates mission status to active and drone status to in-mission

### Requirement: Waypoint Management
The system SHALL support waypoint definitions with geographic coordinates, altitude, and optional actions.

#### Scenario: Waypoint validation
- **WHEN** user adds waypoint with invalid coordinates
- **THEN** system rejects waypoint and provides validation error

#### Scenario: Waypoint action execution
- **WHEN** drone reaches waypoint with action
- **THEN** system executes specified action (photo, sensor reading, etc.)

### Requirement: Mission Assignment
The system SHALL allow missions to be assigned to available drones and track mission progress.

#### Scenario: Mission assignment to drone
- **WHEN** mission is assigned to available drone
- **THEN** drone status changes to in-mission and mission status changes to active

#### Scenario: Mission completion tracking
- **WHEN** drone completes all waypoints
- **THEN** mission status changes to completed and drone status returns to available
