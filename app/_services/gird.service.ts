import axios from "axios";
import { GridConfig, GridDataResponse } from "../_type/types";
import { apiService } from "./apiClient";
const girdService = {


  async createGridConfig(config: Omit<GridConfig, 'id'>): Promise<GridConfig> {
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
        `/data/${configId}`,
        params ? { params } : undefined
      );
    } catch (error) {
      console.error('Error loading grid data:', error);
      throw error;
    }
  },

};

export default girdService;
