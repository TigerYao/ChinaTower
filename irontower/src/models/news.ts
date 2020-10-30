import { Reducer } from 'redux';
// import { query } from '@/services/api';
import { Effect } from '@/models/connect';
import { getLoginInfo, saveNoticeInfo } from '@/utils';
import { selectAccountNewsByGroup, getSysNoticeInfoByNoticeId } from '@/services/netRequest';

export interface NewsModelState {
  name: string;
  newsCount: object;
}

export interface NewsModelType {
  namespace: 'news';
  state: NewsModelState;
  effects: {
    query: Effect;
    selectAccountNewsByGroup: Effect;
    getSysNoticeInfoByNoticeId: Effect;
  };
  reducers: {
    save: Reducer<NewsModelState>;
  };
}

const NewsModel: NewsModelType = {
  namespace: 'news',

  state: {
    name: '',
    sysNewsCount: 0,
    activityNewsCount: 0,
    newsCount: {
      sysNewsCount: 0,
      warnNewsCount: 0,
      activityNewsCount: 0,
    },
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
    *selectAccountNewsByGroup({ payload }, { call, put }) {
      let sysNewsCount = 0;
      let warnNewsCount = 0;
      let activityNewsCount = 0;

      const data = yield call(selectAccountNewsByGroup, {
        driverId: getLoginInfo().driverId,
      });
      
      if (data.resultObject && data.resultObject.length) {
        data.resultObject.map((item, index) => {
          // 系统消息
          if (item._id === '0') {
            sysNewsCount = item.count;
          }
          // 系统消息
          if (item._id === '1') {
            warnNewsCount = item.count;
          }
          // 系统消息
          if (item._id === '2') {
            activityNewsCount = item.count;
          }
        });
      }
      yield put({
        type: 'save',
        payload: {
          newsCount: {
            sysNewsCount,
            warnNewsCount,
            activityNewsCount,
          },
        }
      })
    },
    *getSysNoticeInfoByNoticeId({ payload }, { call, put }) {
      const { noticeId, type, isRead = false } = payload;
      const { resultObject } = yield call(getSysNoticeInfoByNoticeId, { noticeId });
      resultObject.isRead = isRead;
      resultObject.type = type;
      saveNoticeInfo(noticeId, resultObject);
      if (payload.callback) {
        payload.callback(resultObject);
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

export default NewsModel;
