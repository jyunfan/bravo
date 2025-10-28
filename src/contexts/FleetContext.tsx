/**
 * Fleet Management Context
 * 
 * React Context for managing drone fleet state across components
 */

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { FleetState, Drone, DroneRegistrationData, DroneUpdateData, FleetFilters, FleetStats } from '../types';
import { mockDrones } from '../utils/mockData.ts';

// Action types for the reducer
type FleetAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_DRONES'; payload: Drone[] }
  | { type: 'ADD_DRONE'; payload: Drone }
  | { type: 'UPDATE_DRONE'; payload: { id: string; updates: DroneUpdateData } }
  | { type: 'REMOVE_DRONE'; payload: string }
  | { type: 'SELECT_DRONE'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: FleetFilters };

// Initial state
const initialState: FleetState = {
  drones: [],
  selectedDroneId: null,
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
    
    default:
      return state;
  }
}

// Context type
interface FleetContextType {
  state: FleetState;
  // Actions
  addDrone: (droneData: DroneRegistrationData) => Promise<void>;
  updateDrone: (id: string, updates: DroneUpdateData) => Promise<void>;
  removeDrone: (id: string) => Promise<void>;
  selectDrone: (id: string | null) => void;
  loadDrones: () => Promise<void>;
  // Computed values
  getDroneById: (id: string) => Drone | undefined;
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

  // Load drones from localStorage on mount
  useEffect(() => {
    loadDrones();
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

  // Get drone by ID
  const getDroneById = (id: string): Drone | undefined => {
    return state.drones.find(drone => drone.id === id);
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
    const stats = state.drones.reduce(
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

    return stats;
  };

  const value: FleetContextType = {
    state,
    addDrone,
    updateDrone,
    removeDrone,
    selectDrone,
    loadDrones,
    getDroneById,
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
