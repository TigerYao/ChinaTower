import URL from './url';
import { AuthorRequest, baseRequest } from './api';
import { commonFunc } from '@/utils/cordovapluigs';

// 更新用户信息
export async function updateUserInfo(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.updateUserInfo,
    data,
  }).then(item => {
    commonFunc({
      method: 'notificationNative',
      params: {
        key: 'updateUser',
      },
    });
    return item;
  });
}
// export async function updateAvatar(data?: any): Promise<any> {
//   // console.log(data)
//   return AuthorRequest({
//     url: URL.updateAvatar,
//     data,
//   });
// }
// 获取用户信息
export async function selectUserInfo(data?: any): Promise<any> {
  // console.log(data)
  return AuthorRequest({
    url: URL.selectUserInfo,
    data,
  });
}
// //发送短信验证码更换手机号
export async function sendShortMessageU(data?: any): Promise<any> {
  return baseRequest({
    url: URL.sendShortMessageU,
    data,
  });
}
// 更新电话
export async function updateUserPhoneU(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.updateUserPhoneU,
    data,
  });
}
// 修改密码
export async function updatePassWordU(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.updatePassWordU,
    data,
  });
}
// 退出登录
export async function userLoginOut(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.userLoginOut,
    data,
  });
}
// 关于我们参数获取
export async function selectObjectsByKeys(data?: any): Promise<any> {
  return baseRequest({
    url: URL.selectObjectsByKeys,
    data,
  });
}

// 意见反馈
export async function addSuggestInfo(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.addSuggestInfo,
    data,
  });
}

// 获取意见反馈类型参数
export async function selectDictionaryByDictType(data?: any): Promise<any> {
  return baseRequest({
    url: URL.selectDictionaryByDictType,
    data,
  });
}
