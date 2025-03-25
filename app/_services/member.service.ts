import axios from "axios";
import { MemberModel } from "../_models/member.model";

const apiUrl = "/api/member"; 
const apiMemberSearch = "https://v611.wownet.biz/api/member/search";

const memberService = {
  async saveMember(memberData): Promise<MemberModel | null> {
    try {
      const response = await axios.post(apiUrl, memberData);
      return response.data;
    } catch (error) {
      console.error("Error saving member:", error);
      throw error; 
    }
  },
  async searchMember(query): Promise<MemberModel[]> {
    try {
      const response = await axios.post<MemberModel[]>(apiMemberSearch, query);
      return response.data;
    } catch (error) {
      console.error("Error searching members:", error);
      throw error;
    }
  },
};

export default memberService;
