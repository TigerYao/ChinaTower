import { Reducer } from 'redux';
import { Effect } from 'alita';
import { selectAllCity } from '@/services/loginServices';

export interface SearchAddressModelState {
  allCity: Array<any>;
  allColumn: Array<any>;
  citys: Array<any>;
  colums: Array<any>;
}

export interface SearchAddressModelType {
  namespace: 'searchAddress';
  state: SearchAddressModelState;
  effects: {
    selectAllCity: Effect;
    changeAddress: Effect;
  };
  reducers: {
    save: Reducer<SearchAddressModelState>;
  };
}

const SearchAddressModel: SearchAddressModelType = {
  namespace: 'searchAddress',

  state: {
    allCity: [],
    allColumn: [],
    citys: [],
    colums: [],
  },

  effects: {
    *selectAllCity({ payload }, { call, put }) {
      const { resultCode, resultObject = {} } = yield call(selectAllCity, payload);

      const allCity = Object.keys(resultObject).filter(key => resultObject[key].length > 0);

      if (resultCode === '000') {
        const citys = allCity.map(key => {
          return {
            id: key,
            letter: key,
            city: resultObject[key],
          };
        });

        const colums = allCity.map(key => {
          return {
            id: key,
            letter: key,
          };
        });

        yield put({
          type: 'save',
          payload: {
            allCity: citys,
            allColumn: colums,
            colums,
            citys,
          },
        });
      }
    },

    *changeAddress({ payload }, { put, select }) {
      const { citys, colums } = yield select(_ => _.searchAddress);
      const keyWords = payload.value;

      if (keyWords.length === 0) {
        yield put({
          type: 'save',
          payload: {
            allCity: citys,
            allColumn: colums,
          },
        });
        return;
      }

      const resultCitys: { city: any[] }[] = [];
      citys.forEach((item: { city: any }) => {
        const aCity: any[] = (item.city || []).filter(
          (res: { areaName: string | any[] }) => res.areaName.indexOf(keyWords) !== -1,
        );
        if (aCity.length > 0) {
          resultCitys.push({
            id: item.id,
            letter: item.letter,
            city: aCity,
          });
        }
      });

      const allColumn = resultCitys.map(key => {
        console.log('tag', key);
        return {
          id: key.id,
          letter: key.letter,
        };
      });

      yield put({
        type: 'save',
        payload: {
          allCity: resultCitys,
          allColumn,
        },
      });
    },
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

export default SearchAddressModel;
