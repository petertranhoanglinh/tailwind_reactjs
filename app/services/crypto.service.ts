import axios from "axios";

const apiMemberSearch = "https://v611.wownet.biz/api/member/search";

const cryptoService = {
  // API tìm kiếm thành viên
  async searchCryto(query: any): Promise<[]> {
    try {
      const response = await axios.post<[]>(apiMemberSearch, query);
      return response.data;
    } catch (error) {
      console.error("Error searching members:", error);
      throw error;
    }
  },
};

export default cryptoService;
