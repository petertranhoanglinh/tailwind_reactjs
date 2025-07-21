import { CryptoModel } from './../_models/crypto.model';
import axios from "axios";
const API_URL = "https://api.coingecko.com/api/v3/coins/markets";
const cryptoService = {
  async searchCryto(query): Promise<CryptoModel[]> {
    try {
      const response = await axios.get<CryptoModel[]>(API_URL, {
        params: {
          vs_currency: query.currency,
          order: "market_cap_desc",
          per_page: query.per_page,
          page: query.page,
          sparkline: false,
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Error searching members:", error);
      throw error;
    }
  }
};

export default cryptoService;
