import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';
import {selectObjectsByKeys} from "@/services/personServices"
export interface AboutUsModelState {
  name: string;
}

export interface AboutUsModelType {
  namespace: 'aboutUs';
  state: AboutUsModelState;
  effects: {
    query: Effect;
    selectObjectsByKeys:Effect;
  };
  reducers: {
    save: Reducer<AboutUsModelState>;
  };
}

const AboutUsModel: AboutUsModelType = {
  namespace: 'aboutUs',

  state: {
    telephone:'',
    service:"",
    website:'',
    email:"",
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
    *selectObjectsByKeys({payload},{call,put}){
      const res=yield call(selectObjectsByKeys,{
        "configKeys": [
          "app.consumer.hotline","app.wechat.service.number","app.official.website","app.email"
        ]
      });
      if(res.resultCode==="000"){
        console.log(res.resultObject)
        yield put({
          type:'save',
          payload:{
            telephone:res.resultObject[0].configValue,
            service:res.resultObject[1].configValue,
            website:res.resultObject[2].configValue,
            email:res.resultObject[3].configValue,
          }
        })
      }
    }
  },
  reducers: {
    save(state, action) {
      console.log(action)
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default AboutUsModel;
