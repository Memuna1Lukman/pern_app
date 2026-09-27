import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import { API_URL } from "./constants";
import { 
  DataProvider, 
  GetListParams, 
  GetListResponse, 
  BaseRecord 
} from "@refinedev/core";
import { MOCK_SUBJECTS } from "@/constants/mockData";



export const dataProvider : DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({resource }: GetListParams): Promise <GetListResponse<TData>>=>{
    if(resource === 'subjects'){
      return { data: MOCK_SUBJECTS as unknown as TData[],total: MOCK_SUBJECTS.length }
    }
    return {
      data:[],
      total:0
    }
  },

  getOne: async ()=> {throw new Error('This function is not present in mock')},
  create: async ()=> {throw new Error('This function is not present in mock')},
  update: async ()=> {throw new Error('This function is not present in mock')},
  deleteOne: async ()=> {throw new Error('This function is not present in mock')},

  getApiUrl: () => ''
}