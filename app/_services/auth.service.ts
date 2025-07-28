import axios from "axios";
import { getAuthToken } from "../_utils/common.util";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

const authService = {
  async authenticate(authData: {
    username?: string;
    password?: string;
    googleID?: string;
  }): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/user/authenticate`, authData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async checkToken(): Promise<any> {
    try {
      const token = getAuthToken()
      const response = await axios.get(`${API_URL}/user/check-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
