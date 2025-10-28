/**
 * Fleet Management Context
 * 
 * React Context for managing drone fleet state across components
 */

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { FleetState, Drone, DroneRegistrationData, DroneUpdateData, FleetFilters, FleetStats } from '../types';
import type { Mission, MissionCreationData, MissionUpdateData } from '../types';
import { mockDrones, mockMissions } from '../utils/mockData.ts';
import { generateMissionId, canAssignMissionToDrone, generateWaypointId } from '../utils/missionUtils';

// Action types for the reducer
type FleetAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_DRONES'; payload: Drone[] }
  | { type: 'ADD_DRONE'; payload: Drone }
  | { type: 'UPDATE_DRONE'; payload: { id: string; updates: DroneUpdateData } }
  | { type: 'REMOVE_DRONE'; payload: string }
  | { type: 'SELECT_DRONE'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: FleetFilters }
  // Mission actions
  | { type: 'LOAD_MISSIONS'; payload: Mission[] }
  | { type: 'ADD_MISSION'; payload: Mission }
  | { type: 'UPDATE_MISSION'; payload: { id: string; updates: MissionUpdateData } }
  | { type: 'REMOVE_MISSION'; payload: string }
  | { type: 'SELECT_MISSION'; payload: string | null }
  | { type: 'ASSIGN_MISSION'; payload: { missionId: string; droneId: string } }
  | { type: 'UPDATE_MISSION_STATUS'; payload: { missionId: string; status: Mission['status'] } };

// Initial state
const initialState: FleetState = {
  drones: [],
  missions: [],
  selectedDroneId: null,
  selectedMissionId: null,
  isLoading: false,
  error: null,
};

// Reducer function
function fleetReducer(state: FleetState, action: FleetAction): FleetState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'LOAD_DRONES':
      return { ...state, drones: action.payload, isLoading: false, error: null };
    
    case 'ADD_DRONE':
      return {
        ...state,
        drones: [...state.drones, action.payload],
        error: null,
      };
    
    case 'UPDATE_DRONE':
      return {
        ...state,
        drones: state.drones.map(drone =>
          drone.id === action.payload.id
            ? { 
                ...drone, 
                ...action.payload.updates,
                capabilities: { ...drone.capabilities, ...action.payload.updates.capabilities },
                updatedAt: new Date().toISOString() 
              }
            : drone
        ),
        error: null,
      };
    
    case 'REMOVE_DRONE':
      return {
        ...state,
        drones: state.drones.filter(drone => drone.id !== action.payload),
        selectedDroneId: state.selectedDroneId === action.payload ? null : state.selectedDroneId,
        error: null,
      };
    
    case 'SELECT_DRONE':
      return { ...state, selectedDroneId: action.payload };
    
    case 'SET_FILTERS':
      // Filters are handled in the component level, not in state
      return state;
    
    // Mission cases
    case 'LOAD_MISSIONS':
      return { ...state, missions: action.payload, isLoading: false, error: null };
    
    case 'ADD_MISSION':
      return {
        ...state,
        missions: [...state.missions, action.payload],
        error: null,
      };
    
    case 'UPDATE_MISSION':
      return {
        ...state,
        missions: state.missions.map(mission =>
          mission.id === action.payload.id
            ? { 
                ...mission, 
                ...Object.fromEntries(
                  Object.entries(action.payload.updates).filter(([key]) => key !== 'waypoints')
                ),
                ...(action.payload.updates.waypoints ? {
                  waypoints: action.payload.updates.waypoints.map(waypoint => ({
                    ...waypoint,
                    id: generateWaypointId(),
                  }))
                } : {}),
                updatedAt: new Date().toISOString() 
              }
            : mission
        ),
        error: null,
      };
    
    case 'REMOVE_MISSION':
      return {
        ...state,
        missions: state.missions.filter(mission => mission.id !== action.payload),
        selectedMissionId: state.selectedMissionId === action.payload ? null : state.selectedMissionId,
        error: null,
      };
    
    case 'SELECT_MISSION':
      return { ...state, selectedMissionId: action.payload };
    
    case 'ASSIGN_MISSION':
      const { missionId, droneId } = action.payload;
      return {
        ...state,
        missions: state.missions.map(mission =>
          mission.id === missionId
            ? { ...mission, assignedDroneId: droneId, updatedAt: new Date().toISOString() }
            : mission
        ),
        drones: state.drones.map(drone =>
          drone.id === droneId
            ? { ...drone, currentMissionId: missionId, status: 'in-mission', updatedAt: new Date().toISOString() }
            : drone
        ),
        error: null,
      };
    
    case 'UPDATE_MISSION_STATUS':
      const { missionId: mId, status } = action.payload;
      const updatedMissions = state.missions.map(mission =>
        mission.id === mId
          ? { 
              ...mission, 
              status,
              updatedAt: new Date().toISOString(),
              ...(status === 'active' && !mission.startedAt && { startedAt: new Date().toISOString() }),
              ...(['completed', 'failed', 'cancelled'].includes(status) && !mission.completedAt && { completedAt: new Date().toISOString() })
            }
          : mission
      );
      
      // Update drone status if mission is completed/failed/cancelled
      const updatedDrones = state.drones.map(drone => {
        const mission = updatedMissions.find(m => m.id === drone.currentMissionId);
        if (mission && ['completed', 'failed', 'cancelled'].includes(mission.status)) {
          return { ...drone, currentMissionId: undefined, status: 'available' as const, updatedAt: new Date().toISOString() };
        }
        return drone;
      });
      
      return {
        ...state,
        missions: updatedMissions,
        drones: updatedDrones,
        error: null,
      };
    
    default:
      return state;
  }
}

// Context type
interface FleetContextType {
  state: FleetState;
  // Drone actions
  addDrone: (droneData: DroneRegistrationData) => Promise<void>;
  updateDrone: (id: string, updates: DroneUpdateData) => Promise<void>;
  removeDrone: (id: string) => Promise<void>;
  selectDrone: (id: string | null) => void;
  loadDrones: () => Promise<void>;
  // Mission actions
  addMission: (missionData: MissionCreationData) => Promise<void>;
  updateMission: (id: string, updates: MissionUpdateData) => Promise<void>;
  removeMission: (id: string) => Promise<void>;
  selectMission: (id: string | null) => void;
  loadMissions: () => Promise<void>;
  assignMission: (missionId: string, droneId: string) => Promise<void>;
  updateMissionStatus: (missionId: string, status: Mission['status']) => Promise<void>;
  // Computed values
  getDroneById: (id: string) => Drone | undefined;
  getMissionById: (id: string) => Mission | undefined;
  getFilteredDrones: (filters: FleetFilters) => Drone[];
  getFleetStats: () => FleetStats;
}

// Create context
const FleetContext = createContext<FleetContextType | undefined>(undefined);

// Provider component
interface FleetProviderProps {
  children: ReactNode;
}

export function FleetProvider({ children }: FleetProviderProps) {
  const [state, dispatch] = useReducer(fleetReducer, initialState);

  // Load drones and missions from localStorage on mount
  useEffect(() => {
    loadDrones();
    loadMissions();
  }, []);

  // Load drones from localStorage or use mock data
  const loadDrones = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const savedDrones = localStorage.getItem('drone-fleet');
      if (savedDrones) {
        const drones = JSON.parse(savedDrones);
        dispatch({ type: 'LOAD_DRONES', payload: drones });
      } else {
        // Use mock data for initial load
        dispatch({ type: 'LOAD_DRONES', payload: mockDrones });
        // Save mock data to localStorage
        localStorage.setItem('drone-fleet', JSON.stringify(mockDrones));
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load drone fleet data' });
    }
  };

  // Add a new drone
  const addDrone = async (droneData: DroneRegistrationData): Promise<void> => {
    try {
      const newDrone: Drone = {
        id: `drone-${Date.now()}`,
        ...droneData,
        status: 'available',
        registeredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_DRONE', payload: newDrone });
      
      // Save to localStorage
      const updatedDrones = [...state.drones, newDrone];
      localStorage.setItem('drone-fleet', JSON.stringify(updatedDrones));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add drone' });
    }
  };

  // Update an existing drone
  const updateDrone = async (id: string, updates: DroneUpdateData): Promise<void> => {
    try {
      dispatch({ type: 'UPDATE_DRONE', payload: { id, updates } });
      
      // Save to localStorage
      const updatedDrones = state.drones.map(drone =>
        drone.id === id
          ? { 
              ...drone, 
              ...updates,
              capabilities: { ...drone.capabilities, ...updates.capabilities },
              updatedAt: new Date().toISOString() 
            }
          : drone
      );
      localStorage.setItem('drone-fleet', JSON.stringify(updatedDrones));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update drone' });
    }
  };

  // Remove a drone
  const removeDrone = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'REMOVE_DRONE', payload: id });
      
      // Save to localStorage
      const updatedDrones = state.drones.filter(drone => drone.id !== id);
      localStorage.setItem('drone-fleet', JSON.stringify(updatedDrones));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove drone' });
    }
  };

  // Select a drone
  const selectDrone = (id: string | null): void => {
    dispatch({ type: 'SELECT_DRONE', payload: id });
  };

  // Mission methods
  const loadMissions = async (): Promise<void> => {
    try {
      const savedMissions = localStorage.getItem('drone-missions');
      if (savedMissions) {
        const missions = JSON.parse(savedMissions);
        dispatch({ type: 'LOAD_MISSIONS', payload: missions });
      } else {
        // Use mock data for initial load
        dispatch({ type: 'LOAD_MISSIONS', payload: mockMissions });
        // Save mock data to localStorage
        localStorage.setItem('drone-missions', JSON.stringify(mockMissions));
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load mission data' });
    }
  };

  const addMission = async (missionData: MissionCreationData): Promise<void> => {
    try {
      // Generate IDs for waypoints
      const waypointsWithIds = missionData.waypoints.map(waypoint => ({
        ...waypoint,
        id: generateWaypointId(),
      }));

      const newMission: Mission = {
        id: generateMissionId(),
        ...missionData,
        waypoints: waypointsWithIds,
        status: 'planned',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_MISSION', payload: newMission });
      
      // Save to localStorage
      const updatedMissions = [...state.missions, newMission];
      localStorage.setItem('drone-missions', JSON.stringify(updatedMissions));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add mission' });
    }
  };

  const updateMission = async (id: string, updates: MissionUpdateData): Promise<void> => {
    try {
      // Generate IDs for waypoints if they're being updated
      const processedUpdates = {
        ...updates,
        ...(updates.waypoints && {
          waypoints: updates.waypoints.map(waypoint => ({
            ...waypoint,
            id: generateWaypointId(),
          }))
        })
      };

      dispatch({ type: 'UPDATE_MISSION', payload: { id, updates: processedUpdates } });
      
      // Save to localStorage
      const updatedMissions = state.missions.map(mission =>
        mission.id === id
          ? { 
              ...mission, 
              ...processedUpdates,
              updatedAt: new Date().toISOString() 
            }
          : mission
      );
      localStorage.setItem('drone-missions', JSON.stringify(updatedMissions));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update mission' });
    }
  };

  const removeMission = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'REMOVE_MISSION', payload: id });
      
      // Save to localStorage
      const updatedMissions = state.missions.filter(mission => mission.id !== id);
      localStorage.setItem('drone-missions', JSON.stringify(updatedMissions));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove mission' });
    }
  };

  const selectMission = (id: string | null): void => {
    dispatch({ type: 'SELECT_MISSION', payload: id });
  };

  const assignMission = async (missionId: string, droneId: string): Promise<void> => {
    try {
      const mission = state.missions.find(m => m.id === missionId);
      if (!mission) {
        dispatch({ type: 'SET_ERROR', payload: 'Mission not found' });
        return;
      }

      if (!canAssignMissionToDrone(mission)) {
        dispatch({ type: 'SET_ERROR', payload: 'Mission cannot be assigned' });
        return;
      }

      dispatch({ type: 'ASSIGN_MISSION', payload: { missionId, droneId } });
      
      // Save to localStorage
      const updatedMissions = state.missions.map(mission =>
        mission.id === missionId
          ? { ...mission, assignedDroneId: droneId, updatedAt: new Date().toISOString() }
          : mission
      );
      const updatedDrones = state.drones.map(drone =>
        drone.id === droneId
          ? { ...drone, currentMissionId: missionId, status: 'in-mission', updatedAt: new Date().toISOString() }
          : drone
      );
      
      localStorage.setItem('drone-missions', JSON.stringify(updatedMissions));
      localStorage.setItem('drone-fleet', JSON.stringify(updatedDrones));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to assign mission' });
    }
  };

  const updateMissionStatus = async (missionId: string, status: Mission['status']): Promise<void> => {
    try {
      dispatch({ type: 'UPDATE_MISSION_STATUS', payload: { missionId, status } });
      
      // Save to localStorage
      const updatedMissions = state.missions.map(mission =>
        mission.id === missionId
          ? { 
              ...mission, 
              status,
              updatedAt: new Date().toISOString(),
              ...(status === 'active' && !mission.startedAt && { startedAt: new Date().toISOString() }),
              ...(['completed', 'failed', 'cancelled'].includes(status) && !mission.completedAt && { completedAt: new Date().toISOString() })
            }
          : mission
      );
      
      const updatedDrones = state.drones.map(drone => {
        const mission = updatedMissions.find(m => m.id === drone.currentMissionId);
        if (mission && ['completed', 'failed', 'cancelled'].includes(mission.status)) {
          return { ...drone, currentMissionId: undefined, status: 'available' as const, updatedAt: new Date().toISOString() };
        }
        return drone;
      });
      
      localStorage.setItem('drone-missions', JSON.stringify(updatedMissions));
      localStorage.setItem('drone-fleet', JSON.stringify(updatedDrones));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update mission status' });
    }
  };

  // Get drone by ID
  const getDroneById = (id: string): Drone | undefined => {
    return state.drones.find(drone => drone.id === id);
  };

  // Get mission by ID
  const getMissionById = (id: string): Mission | undefined => {
    return state.missions.find(mission => mission.id === id);
  };

  // Get filtered drones
  const getFilteredDrones = (filters: FleetFilters): Drone[] => {
    let filtered = state.drones;

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(drone => filters.status!.includes(drone.status));
    }

    if (filters.model && filters.model.length > 0) {
      filtered = filtered.filter(drone => filters.model!.includes(drone.model));
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(drone =>
        drone.name.toLowerCase().includes(searchLower) ||
        drone.model.toLowerCase().includes(searchLower) ||
        drone.id.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  // Get fleet statistics
  const getFleetStats = (): FleetStats => {
    const droneStats = state.drones.reduce(
      (acc, drone) => {
        acc.total++;
        if (drone.status === 'in-mission') {
          acc.inMission++;
        } else {
          acc[drone.status]++;
        }
        return acc;
      },
      { total: 0, available: 0, inMission: 0, maintenance: 0, offline: 0 }
    );

    const missionStats = state.missions.reduce(
      (acc, mission) => {
        acc.total++;
        acc[mission.status]++;
        return acc;
      },
      { total: 0, planned: 0, active: 0, completed: 0, failed: 0, cancelled: 0 }
    );

    return {
      ...droneStats,
      missions: missionStats,
    };
  };

  const value: FleetContextType = {
    state,
    // Drone actions
    addDrone,
    updateDrone,
    removeDrone,
    selectDrone,
    loadDrones,
    // Mission actions
    addMission,
    updateMission,
    removeMission,
    selectMission,
    loadMissions,
    assignMission,
    updateMissionStatus,
    // Computed values
    getDroneById,
    getMissionById,
    getFilteredDrones,
    getFleetStats,
  };

  return (
    <FleetContext.Provider value={value}>
      {children}
    </FleetContext.Provider>
  );
}

// Custom hook to use the fleet context
export function useFleet(): FleetContextType {
  const context = useContext(FleetContext);
  if (context === undefined) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
}
