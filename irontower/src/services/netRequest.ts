import { AuthorRequest } from './api';
import URL from './url';
import { commonFunc } from '@/utils/cordovapluigs';

// 请求支付宝生成APP支付订单信息
export const aliPayForSign = (data: any) =>
  AuthorRequest({
    url: URL.aliPayForSign,
    data,
  });

// /bussiness/process/getExchangeRecord
// 查询账户消息
export const selectAccountNews = (data: any) =>
  AuthorRequest({
    url: URL.selectAccountNews,
    data,
  });

//  微信支付
export const unifiedOrder = (data: any) =>
  AuthorRequest({
    url: URL.unifiedOrder,
    data,
  });

// 根据地市编码获取地市套餐月卡列表
export const getPckageConfigList = (data?: any) =>
  AuthorRequest({
    url: URL.getPckageConfigList,
    data,
    // hiddenLoading: true,
  });

export const getPckageDetail = (data?: any) =>
  AuthorRequest({
    url: URL.getPckageDetail,
    data,
  });

export const fundPreFreeze = (data?: any) =>
  AuthorRequest({
    url: URL.fundPreFreeze,
    data,
  });

// 更新用户
export const authUpdateUser = (data?: any) =>
  AuthorRequest({
    url: URL.authUpdateUser,
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

// OCR认证
export const idCardRecognition = (data?: any) =>
  AuthorRequest({
    url: URL.idCardRecognition,
    data,
  });

// 邀请码验证
export const validInvitationCode = (data?: any) =>
  AuthorRequest({
    url: URL.validInvitationCode,
    data,
  });

// 订单查询
export const getOrderInfoList = (data?: any) =>
  AuthorRequest({
    url: URL.getOrderInfoList,
    data,
  });

// 支付查询
export const getPaymentInfoList = (data?: any) =>
  AuthorRequest({
    url: URL.getPaymentInfoList,
    data,
  });

//  查询电池电量
export const queryBatteryElectricQuantity = (data?: any) =>
  AuthorRequest({
    url: URL.queryBatteryElectricQuantity,
    data,
    hiddenLoading: true,
  });

// 查询城市站点
export async function selectCityStation(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.selectCityStation,
    data,
    hiddenLoading: true,
  });
}

// 查询附近站点
export async function selectNearStation(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.selectNearStation,
    data,
    hiddenLoading: true,
  });
}

// 查询范围站点
export async function selectRangeStationList(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.selectRangeStationList,
    data,
    hiddenLoading: true,
  });
}

// 获取用户押金或者服务费退款金额
export async function getUserRefundFee(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getUserRefundFee,
    data,
  });
}

// 支付宝退款
export async function aliRefund(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.aliRefund,
    data,
  });
}

// 微信退款
export async function wxRefund(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.wxRefund,
    data,
  });
}
// 支付宝资金解冻接口
export async function fundPreUnFreeze(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.fundPreUnFreeze,
    data,
  });
}

// 查询电柜
export async function queryCabinetBatteryInfo(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.queryCabinetBatteryInfo,
    data,
  });
}

export async function queryCabinetAndBatteryInfo(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.queryCabinetAndBatteryInfo,
    data,
  });
}

// 查询退电指引机柜
export async function queryReturnCabinetInfo(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.queryReturnCabinetListInfo,
    data,
  });
}

// 换电记录
export async function getExchangeRecord(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getNewExchangeRecord,
    data,
    hiddenLoading: true,
  });
}

// 换电记录详情
export async function getExchangeRecordInfo(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getExchangeRecordInfo,
    data,
    hiddenLoading: true,
  });
}

//
export async function selectDepositPaymentInfoByUserId(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.selectDepositPaymentInfoByUserId,
    data,
  });
}

// 分组查询账户消息数量
export async function selectAccountNewsByGroup(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.selectAccountNewsByGroup,
    data,
  });
}
//
export async function selectUserAuthPaymentRecord(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.selectUserAuthPaymentRecord,
    data,
  });
}

export async function exchangePowerBusiness(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.exchangePowerBusiness,
    data,
  });
}

// 套餐支付宝预授权线上资金重新授权冻结接口
export async function reFundPreFreeze(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.reFundPreFreeze,
    data,
  });
}

// 电柜轮播图查询
export async function batchQueryFileInfoByIds(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.batchQueryFileInfoByIds,
    data,
  });
}

// 切换城市信息
export async function updateTurnsCity(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.updateTurnsCity,
    data,
  });
}

// 根据城市名称模糊查询城市ID
export async function queryCityIdByCityName(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.queryCityIdByCityName,
    data,
    hiddenLoading: true,
  });
}

// 根据部门id获取区域信息
export async function getAllSysAreaInfo(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getAllSysAreaInfo,
    data,
    hiddenLoading: true,
  });
}

// 首放标识查询
export async function queryFirstTakeFlag(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.queryFirstTakeFlag,
    data,
    hiddenLoading: true,
  });
}

export async function getPostalBatteryBinding(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getPostalBatteryBinding,
    data,
    hiddenLoading: true,
  });
}

export async function getPostalBatteryUnbound(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getPostalBatteryUnbound,
    data,
    hiddenLoading: true,
  });
}

export async function queryUserOverdueInfo(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.queryUserOverdueInfo,
    data,
    hiddenLoading: true,
  });
}

export async function updatePowerNoticeSwitch(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.updatePowerNoticeSwitch,
    data,
    hiddenLoading: true,
  });
}

export async function queryPowerNoticeSwitch(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.queryPowerNoticeSwitch,
    data,
    hiddenLoading: true,
  });
}

export async function getCouponInfoByDriverId(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getCouponInfoByDriverId,
    data,
    hiddenLoading: true,
  });
}

export async function enableCouponById(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.enableCouponById,
    data,
    hiddenLoading: true,
  });
}
export async function queryCabinetDoorInfo(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.queryCabinetDoorInfo,
    data,
  });
}
export async function getCouponInfoByOrderId(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getCouponInfoByOrderId,
    data,
  });
}

export async function getRefundStatusConfirm(data?: any): Promise<any> {
  console.log('tag', data);
  return AuthorRequest({
    url: URL.getRefundStatusConfirm,
    data,
  });
}
export async function getInvitationCodeByDriverId(data?: any): Promise<any> {
  console.log('tag', data);
  return AuthorRequest({
    url: URL.getInvitationCodeByDriverId,
    data,
  });
}

export async function getCityDepositAmount(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getCityDepositAmount,
    data,
  });
}

export async function queryBatteryTrackInfo(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.queryBatteryTrackInfo,
    data,
  });
}

export async function selectRangeReturnStationList(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.selectRangeReturnStationList,
    data,
  });
}

// 城市网点列表信息查询接口
export async function queryNetworkInfoList(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.queryNetworkInfoList,
    data,
  });
}

// 网点详情信息查询接口
export async function queryNetworkInfo(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.queryNetworkInfo,
    data,
  });
}

// 提交申请退款
export async function subApplyRefund(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.subApplyRefund,
    data,
  });
}

// 车电一体获取退款申请单列表
export async function getApplyRefundList(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getApplyRefundList,
    data,
  });
}

// 车电一体获取退款申请单详情
export async function getApplyRefundInfo(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getApplyRefundInfo,
    data,
  });
}

// 获取渠道信息
export async function getChannelInfo(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getChannelInfo,
    data,
  });
}
// 获取我的车辆
export async function getMyECar(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getMyECar,
    data,
  });
}

// 获取我的租车记录
export async function queryRentCarList(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.queryRentCarList,
    data,
  });
}

// 获取我的租车记录详情
export async function getMyECarRecordDet(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getMyECarRecordDet,
    data,
  })
}

// 获取渠道信息
export async function getHistoryInvitationCodeWithDriver(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getHistoryInvitationCodeWithDriver,
    data,
  });
}

// 获取渠道信息
export async function getMyPointsList(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getMyPointsList,
    data,
  });
}

// 获取消息公告详情
export async function getSysNoticeInfoByNoticeId(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.getSysNoticeInfoByNoticeId,
    data,
  });
}

// 换电柜详情电柜昨日时段换电曲线统计
export async function queryDayCabinetExchangeStatistics(data?: any): Promise<any> {
  return AuthorRequest({
    url: URL.queryDayCabinetExchangeStatistics,
    data,
  });
}
