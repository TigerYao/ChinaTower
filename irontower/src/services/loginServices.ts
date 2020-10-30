import URL from './url';
import { baseRequest, uploadFiles } from './api';

// 查询城市
export async function quickCs(data?: any): Promise<any> {
  return baseRequest({
    url: URL.quickCs,
    data,
  });
}

// 注册
export async function registerUser(data?: any): Promise<any> {
  return baseRequest({
    url: URL.registerUser,
    data,
  });
}

// 更新用户
export async function updateUser(data?: any): Promise<any> {
  return baseRequest({
    url: URL.updateUser,
    data,
  });
}

// 更新电话
export async function updateUserPhone(data?: any): Promise<any> {
  return baseRequest({
    url: URL.updateUserPhone,
    data,
  });
}

// 账户密码登录
export async function ordinaryLogin(data?: any): Promise<any> {
  return baseRequest({
    url: URL.ordinaryLogin,
    data,
  });
}

// 发送短信验证码
export async function sendShortMessage(data): Promise<any> {
  return baseRequest({
    url: URL.sendShortMessage,
    data,
  });
}

// 忘记密码重置密码
export async function forgetUpdatePassWord(data): Promise<any> {
  return baseRequest({
    url: URL.forgetUpdatePassWord,
    data,
  });
}

// 修改密码
export async function updatePassWord(data): Promise<any> {
  return baseRequest({
    url: URL.updatePassWord,
    data,
  });
}

// 用户短信登录
export async function smsLogin(data): Promise<any> {
  return baseRequest({
    url: URL.smsLogin,
    data,
  });
}

// 用户注册
export async function publicRegisterUser(data): Promise<any> {
  return baseRequest({
    url: URL.publicRegisterUser,
    data,
  });
}

// 查询是否需要升级
export async function queryUpgrade(data?: any): Promise<any> {
  return baseRequest({
    url: URL.queryUpgrade,
    data,
  });
}

//
// 获取用户协议
export async function getAgreement(data?: any): Promise<any> {
  return baseRequest({
    url: URL.getAgreement,
    data,
    hiddenLoading: true,
  });
}

// 城市查询
export async function selectPronvieOrCity(data?: any): Promise<any> {
  return baseRequest({
    url: URL.selectPronvieOrCity,
    data,
    hiddenLoading: true,
  });
}

// uploadFile
export async function uploadFile(data?: any): Promise<any> {
  return baseRequest({
    url: URL.uploadFile,
    data,
  });
}

// 归属平台
export async function selectDictionaryByDictType(data?: any): Promise<any> {
  return baseRequest({
    url: URL.selectDictionaryByDictType,
    data,
    hiddenLoading: true,
  });
}

// 查询电话号码
export async function selectObjectByKey(data?: any): Promise<any> {
  return baseRequest({
    url: URL.selectObjectByKey,
    data,
    hiddenLoading: true,
  });
}

export async function selectAllCity(data?: any): Promise<any> {
  return baseRequest({
    url: URL.selectAllCity,
    data,
    hiddenLoading: true,
  });
}

// 检验短信验证码
export async function checkShortMessage(data?: any): Promise<any> {
  return baseRequest({
    url: URL.checkShortMessage,
    data,
  });
}
