## 1. Create FleetStatusWidget Component
- [x] 1.1 Create `FleetStatusWidget.tsx` component file
- [x] 1.2 Implement widget to display list of all drones from FleetContext
- [x] 1.3 Add status indicators with color coding for each status type
- [x] 1.4 Display drone name and model for each entry
- [x] 1.5 Style widget with appropriate spacing and layout
- [x] 1.6 Handle empty fleet state gracefully
- [x] 1.7 Add battery level display for each drone
- [x] 1.8 Add geolocation (GPS) display for each drone

## 2. Integrate with WidgetManager
- [x] 2.1 Add 'fleet-status' widget type to WidgetManager renderWidget switch
- [x] 2.2 Import FleetStatusWidget in WidgetManager
- [x] 2.3 Add default fleet-status widget configuration (optional, or let users add manually)

## 3. Widget Styling and UX
- [x] 3.1 Ensure widget matches existing widget design patterns
- [x] 3.2 Make widget scrollable if drone list exceeds widget height
- [x] 3.3 Add appropriate spacing and visual hierarchy
- [x] 3.4 Ensure status colors are accessible and consistent with existing UI

## 4. Testing
- [x] 4.1 Test widget displays all drones correctly
- [x] 4.2 Test status indicators show correct colors for each status
- [x] 4.3 Test widget with empty fleet
- [x] 4.4 Test widget with large fleet (scrolling behavior)
- [x] 4.5 Test widget is draggable and resizable
- [x] 4.6 Test widget persists position/size in localStorage

