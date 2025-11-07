## Why
Operators need a quick overview of all drones in the fleet to monitor their status at a glance. Currently, the only widget available shows telemetry for a single drone, requiring operators to manually check each drone individually. A fleet status widget will provide a consolidated view of all drones with their current status, enabling faster fleet monitoring and decision-making.

## What Changes
- New `FleetStatusWidget` component that displays all drones in the fleet
- Widget shows drone name, model, and status for each drone
- Status indicators with color coding (available, in-mission, maintenance, offline)
- Integration with `WidgetManager` to support the new widget type
- Widget is draggable and resizable like other widgets
- Optional: Click on a drone in the widget to select it (future enhancement)

## Impact
- Affected specs: `widgets` (new capability)
- Affected code:
  - `src/components/widgets/FleetStatusWidget.tsx` - New widget component
  - `src/components/widgets/WidgetManager.tsx` - Add fleet-status widget type support
  - `src/contexts/FleetContext.tsx` - Used to access fleet data (no changes needed)

