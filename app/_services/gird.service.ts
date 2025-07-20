import axios from "axios";
import { ERPData, GridConfig, GridDataResponse } from "../_type/types";
import { apiService } from "./apiClient";
const girdService = {


  async createGridConfig(config: Omit<GridConfig, 'id'> ,  idConfig?: string | null): Promise<GridConfig> {
    if(idConfig){
      return apiService.put<GridConfig>(`/grid/config/${idConfig}`, config);
    }
    return apiService.post<GridConfig>('/grid/config', config);
  },

  async loadGridConfig(): Promise<GridConfig[]> {
    return apiService.get<GridConfig[]>('/grid/config');
  },
  async loadGridData(configId: string, filters?: Record<string, any>): Promise<GridDataResponse> {
    try {
      // Convert filters to query params if they exist
      const params = filters ? new URLSearchParams() : undefined;
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params?.append(key, String(value));
          }
        });
      }

      return apiService.get<GridDataResponse>(
        `/grid/data/${configId}`,
        params ? { params } : undefined
      );
    } catch (error) {
      console.error('Error loading grid data:', error);
      throw error;
    }
  },

async saveGridData(
  configId: string,
  fieldValues: Record<string, any>,
  idData?: string | null
): Promise<ERPData> {
  try {
    const params = new URLSearchParams();
    if (idData) {
      params.append('idData', idData);
    }

    const config = {
      params,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return apiService.post<ERPData>(`/grid/data/${configId}`, fieldValues, config);
  } catch (error) {
    console.error(idData ? 'Error updating grid data:' : 'Error creating grid data:', error);
    throw error;
  }
},

};

export default girdService;
