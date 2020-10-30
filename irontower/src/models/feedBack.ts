import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';
import {addSuggestInfo,selectDictionaryByDictType} from "@/services/personServices"
export interface FeedBackModelState {
  name: string;
}

export interface FeedBackModelType {
  namespace: 'feedBack';
  state: FeedBackModelState;
  effects: {
    query: Effect;
    addSuggestInfo:Effect;
    selectDictionaryByDictType:Effect;
  };
  reducers: {
    save: Reducer<FeedBackModelState>;
  };
}

const FeedBackModel: FeedBackModelType = {
  namespace: 'feedBack',

  state: {
    name: '',
    opinionList:[]
  },

  effects: {
    *query({ payload }, { call, put }) {
      // const data = yield call(query, payload);
      // console.log(data)
      // yield put({
      //   type: 'save',
      //   payload: { name: data.text },
      // });
    },
    *addSuggestInfo({payload},{call,put}){
      const {userId,depId,text,type}=payload
      const res=yield call(addSuggestInfo,{
        createBy:userId,
        deptId: depId,
        problemDescription: text,
        problemType: type
      });
      if(res.resultCode==="000"){
        payload.callback && payload.callback()
      }
    },
    *selectDictionaryByDictType({payload},{call,put}){
      const { resultCode, resultObject }=yield call(selectDictionaryByDictType,{
        dictType: "suggest_return_type"
      });
      if(resultCode==="000"){
        yield put({
          type:'save',
          payload:{
            opinionList:(resultObject || []).map((res:{ dictLabel: any; dictValue: any })=>{
              return {
                label:res.dictLabel,
                value:res.dictValue
              }
            })
          }
        });
      }
    }
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default FeedBackModel;
