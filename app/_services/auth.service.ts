import axios from "axios";

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
      console.error("Authentication failed:", error);
      throw error;
    }
  },
};

export default authService;
