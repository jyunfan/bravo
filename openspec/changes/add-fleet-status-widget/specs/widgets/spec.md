## ADDED Requirements

### Requirement: Fleet Status Widget
The system SHALL provide a widget that displays the status of all drones in the fleet, allowing operators to monitor fleet status at a glance.

#### Scenario: Displaying all drones in fleet
- **WHEN** the fleet status widget is displayed
- **THEN** the widget shows all drones from the fleet
- **THEN** each drone entry displays the drone name and model
- **THEN** each drone entry displays a status indicator with color coding
- **THEN** each drone entry displays a battery level, and geolocation

#### Scenario: Status indicator color coding
- **WHEN** a drone has status 'available'
- **THEN** the status indicator displays in green
- **WHEN** a drone has status 'in-mission'
- **THEN** the status indicator displays in yellow
- **WHEN** a drone has status 'maintenance'
- **THEN** the status indicator displays in red
- **WHEN** a drone has status 'offline'
- **THEN** the status indicator displays in gray

#### Scenario: Widget integration
- **WHEN** the fleet status widget is added to the dashboard
- **THEN** the widget is draggable and resizable like other widgets
- **THEN** the widget position and size persist in localStorage
- **THEN** the widget can be closed like other widgets

#### Scenario: Empty fleet handling
- **WHEN** the fleet has no drones
- **THEN** the widget displays an appropriate message indicating no drones are available
- **THEN** the widget does not crash or display errors

#### Scenario: Large fleet scrolling
- **WHEN** the fleet has more drones than can fit in the widget height
- **THEN** the widget content becomes scrollable
- **THEN** all drones remain accessible through scrolling

