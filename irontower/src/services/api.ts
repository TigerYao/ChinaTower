/* eslint-disable no-unused-expressions */
import { request, router } from 'alita';
import { Toast , Modal } from 'antd-mobile';
import { getLoginInfo, clearLoginInfo } from '@/utils';

import { clearJpushAlias } from '@/utils/cordovapluigs';

let canShowModal = true;

export async function baseRequest(params?: any, token?: string): Promise<any> {
  console.log('params==', JSON.stringify(params));
  if (!params.hiddenLoading) {
    Toast.loading('正在加载中...');
  }

  // const token = getLoginInfo().token;
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    request(params.url, {
      method: 'post',
      data: params.data,
      headers,
      requestType: 'json',
    })
      .then(res => {

        if (!(params.url.indexOf('getAgreement') > -1)) {
          // console.log('res==', params.url, ',', JSON.stringify(res), res);
        }

        if (!params.hiddenLoading) {
          Toast.hide();
        }

        if (!res) {
          Toast.fail('服务器开小差了~');
          return;
        }
        if (res.resultCode === '000') {
          // 成功
          resolve && resolve(res); // && resolve(res.resultObject)
        } else if (res.resultCode === '401') {
          // 接口验证失败
          clearLoginInfo();
          if (canShowModal) {
            canShowModal = false;
            Modal.alert('温馨提示', '您的登录信息已失效,请重新登录', [
              {
                text: '去登录',
                onPress() {
                  clearJpushAlias('');
                  canShowModal = true;
                  localStorage.removeItem('isRefreshIndex');
                  router.replace({
                    pathname: '/',
                  });
                },
              },
            ]);
          }
        } else {
          // 接口失败  999
          resolve && resolve(res);
          reject && reject(res);

          if (!(params.url.indexOf('smsLogin') > -1 && res.resultCode === '407')) {
            if (!(params.url.indexOf('getAgreement') > -1)) {
              if (!(params.url.indexOf('queryCityIdByCityName') > -1)) {
                Toast.fail(res.resultMsg);
              }
            }
          }
        }
      })
      .catch(err => {
        
        Toast.hide();
        Toast.fail('服务器开小差了~');
        reject && reject(err);
      });
  });
}

export async function AuthorRequest(params?: any): Promise<any> {
  return baseRequest(params, getLoginInfo().token);
}

//  get请求
export async function GETRequest(params?: any): Promise<any> {
  return request(params.url, {
    data: params.data,
    method: 'get',
  });
}
