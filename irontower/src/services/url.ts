//  准生产
// const devUrls = {
//   quickCs: '', // 查询城市
//   registerUser: '/driverRegister/registerUser', // 注册
//   updateUser: '/driverRegister/updateUser', // 更新用户
//   updateUserPhone: '/driverRegister/updateUserPhone', // 更新电话
//   ordinaryLogin: '/public/login/ordinaryLogin', // 用户账号密码登录
//   sendShortMessage: '/public/sms/sendShortMessage', // 发送短信验证码
//   forgetUpdatePassWord: '/public/login/forgetUpdatePassWord',
//   updatePassWord: '/public/login/updatePassWord', // 修改密码
//   smsLogin: '/public/login/smsLogin', // 用户短信登录
//   publicRegisterUser: '/public/driverRegister/registerUser', // 用户注册
//   aliPayForSign: '/bussiness/alipay/aliPayForSign', // 支付宝支付
//   selectAccountNews: '/bussiness/accountNews/selectAccountNews', // 查询账户消息
//   unifiedOrder: '/bussiness/wxPay/createOrder', // 微信原生支付
//   updateUserInfo: '/bussiness/personal/updateUserInfo', //更新用户信息
//   queryUpgrade: '/public/UpgradeAction/queryUpgrade', // 查询是否需要升级
//   getAgreement: '/public/userAgreement/getAgreement', // 获取用户协议
//   selectCityStation: '/bussiness/station/selectCityStation', // 查询城市站点
//   selectNearStation: '/bussiness/station/selectNearStation', // 查询附近站点
//   selectPronvieOrCity: '/public/driverRegister/selectPronvieOrCity', // 城市查询
//   getPckageConfigList: '/bussiness/packageConfig/getPckageConfigList', // 根据地市编码获取地市套餐月卡列表
//   idCardRecognition: '/bussiness/driverRegister/idCardRecognition', // OCR认证
//   authUpdateUser: '/bussiness/driverRegister/updateUser', // 更新用户
//   uploadFile: '/public/upload', // 上传接口
//   getPckageDetail: '/bussiness/packageConfig/getPckageDetail', // 获取地市套餐详情
//   fundPreFreeze: '/bussiness/alipay/fundPreFreeze', // 支付宝资金冻结
//   selectDictionaryByDictType: '/public/dictionary/selectDictionaryByDictType', // 归属平台
//   selectUserInfo: '/bussiness/personal/selectUserInfo', // 获取用户信息
//   getOrderInfoList: '/bussiness/order/getOrderInfoList', // 订单查询
//   getPaymentInfoList: '/bussiness/order/getPaymentInfoList', //
//   selectObjectByKey: '/public/dictionary/selectObjectByKey', // 查询电话号码
//   queryBatteryElectricQuantity: '/bussiness/cabinet/queryBatteryElectricQuantity', // 查询电池电量
//   getUserRefundFee: '/bussiness/personal/getUserRefundFee', //
//   aliRefund: '/bussiness/alipay/aliRefund', // 支付宝退款
//   wxRefund: '/bussiness/wxPay/refund', // 微信退款
//   fundPreUnFreeze: '/bussiness/alipay/fundPreUnFreeze', // 支付宝资金解冻接口
//   sendShortMessageU: '/public/sms/sendShortMessageU', // 发送短信验证码更换手机号
//   updateUserPhoneU: '/bussiness/driverRegister/updateUserPhone', // 更新电话
//   updatePassWordU: '/bussiness/login/updatePassWord', // 修改密码
//   queryCabinetBatteryInfo: '/bussiness/cabinet/queryCabinetBatteryInfo', // 查询电柜
//   queryCabinetAndBatteryInfo: '/bussiness/cabinet/queryCabinetAndBatteryInfo', // 统计查询电柜电池信息
//   getExchangeRecord: '/bussiness/process/getExchangeRecord', // 换电记录
//   selectAccountNewsByGroup: '/bussiness/accountNews/selectAccountNewsByGroup', // 分组查询账户消息数量
//   userLoginOut: '/bussiness/login/userLoginOut', // 退出登录
//   selectDepositPaymentInfoByUserId: '/bussiness/order/selectDepositPaymentInfoByUserId', // 押金信息查询
//   selectUserAuthPaymentRecord: '/bussiness/order/selectUserAuthPaymentRecord', // 授权信息查询
//   exchangePowerBusiness: '/bussiness/process/exchangePowerBusiness', // 打开电柜
//   reFundPreFreeze: '/bussiness/alipay/reFundPreFreeze', // 套餐支付宝预授权线上资金重新授权冻结接口
//   selectObjectsByKeys: '/public/dictionary/selectObjectsByKeys', // 关于我们参数获取
//   addSuggestInfo: '/bussiness/personal/addSuggestInfo', // 意见反馈
//   selectAllCity: '/public/driverRegister/selectAllCity', // 选择所有城市
//   batchQueryFileInfoByIds: '/bussiness/cabinet/batchQueryFileInfoByIds', // 电柜轮播图查询
//   getAppShareLink: '/public/userShare/getAppShareLink', // 获取分享参数
//   checkShortMessage: '/public/sms/checkShortMessage', // 校验短信验证码
//   updateTurnsCity: '/bussiness/personal/updateTurnsCity', // 切换城市信息
//   queryCityIdByCityName: '/bussiness/station/queryCityIdByCityName', // 根据城市名称模糊查询城市ID
//   getAllSysAreaInfo: '/bussiness/alipay/getAllSysAreaInfo', // 根据部门id获取区域信息
//   queryFirstTakeFlag: '/bussiness/process/queryFirstTakeFlag', // 首放标识查询
//   getPostalBatteryBinding: '/bussiness/postal/getPostalBatteryBinding', // 邮政电池绑定
//   getPostalBatteryUnbound: '/bussiness/postal/getPostalBatteryUnbound', // 邮政电池解绑
// };

// 测试
const devUrls = {
  quickCs: '', // 查询城市
  registerUser: '/user/public/driverRegister/registerUser', // 注册
  updateUser: '/user/bussiness/driverRegister/updateUser', // 更新用户
  updateUserPhone: '/user/bussiness/driverRegister/updateUserPhone', // 更新电话
  ordinaryLogin: '/oauth/public/login/ordinaryLogin', // 用户账号密码登录
  sendShortMessage: '/msg/public/sms/sendShortMessage', // 发送短信验证码
  forgetUpdatePassWord: '/user/public/login/forgetUpdatePassWord',
  updatePassWord: '/user/public/login/updatePassWord', // 修改密码
  smsLogin: '/oauth/public/login/smsLogin', // 用户短信登录
  publicRegisterUser: '/user/public/driverRegister/registerUser', // 用户注册
  aliPayForSign: '/order/bussiness/alipay/aliPayForSign', // 支付宝支付
  selectAccountNews: '/user/bussiness/accountNews/selectAccountNews', // 查询账户消息
  unifiedOrder: '/order/bussiness/wxPay/createOrder', // 微信原生支付
  updateUserInfo: '/user/bussiness/personal/updateUserInfo', // 更新用户信息
  queryUpgrade: '/base/public/UpgradeAction/queryUpgrade', // 查询是否需要升级
  getAgreement: '/base/public/userAgreement/getAgreement', // 获取用户协议
  selectCityStation: '/queryexc/bussiness/station/selectCityStation', // 查询城市站点（2020.6.19废弃）
  selectNearStation: '/queryexc/bussiness/station/selectNearStation', // 查询附近站点（2020.6.19废弃）
  selectRangeStationList: '/queryexc/bussiness/station/selectRangeStationList', // 查询范围站点
  selectPronvieOrCity: '/base/public/driverRegister/selectPronvieOrCity', // 城市查询
  getPckageConfigList: '/order/bussiness/packageConfig/getPckageConfigList', // 根据地市编码获取地市套餐月卡列表
  idCardRecognition: '/user/bussiness/driverRegister/idCardRecognition', // OCR认证
  validInvitationCode: '/user/bussiness/personal/validInvitationCode',
  authUpdateUser: '/user/bussiness/driverRegister/updateUser', // 更新用户
  uploadFile: '/base/public/upload', // 上传接口
  getPckageDetail: '/order/bussiness/packageConfig/getPckageDetail', // 获取地市套餐详情
  fundPreFreeze: '/order/bussiness/alipay/fundPreFreeze', // 支付宝资金冻结
  selectDictionaryByDictType: '/base/public/dictionary/selectDictionaryByDictType', // 归属平台
  selectUserInfo: '/user/bussiness/personal/selectUserInfo', // 获取用户信息
  getOrderInfoList: '/order/bussiness/order/getOrderInfoList', // 订单查询
  getPaymentInfoList: '/order/bussiness/order/getPaymentInfoList', //
  selectObjectByKey: '/base/public/dictionary/selectObjectByKey', // 查询电话号码
  queryBatteryElectricQuantity: '/queryexc/bussiness/cabinet/queryBatteryElectricQuantity', // 查询电池电量
  getUserRefundFee: '/order/bussiness/userAccountPay/getUserRefundFee', //
  aliRefund: '/order/bussiness/alipay/aliRefund', // 支付宝退款
  wxRefund: '/order/bussiness/wxPay/refund', // 微信退款
  fundPreUnFreeze: '/order/bussiness/alipay/fundPreUnFreeze', // 支付宝资金解冻接口
  sendShortMessageU: '/msg/public/sms/sendShortMessageU', // 发送短信验证码更换手机号
  updateUserPhoneU: '/user/bussiness/driverRegister/updateUserPhone', // 更新电话
  updatePassWordU: '/user/bussiness/login/updatePassWord', // 修改密码
  queryCabinetBatteryInfo: '/queryexc/bussiness/cabinet/queryCabinetBatteryInfo', // 查询电柜
  queryCabinetAndBatteryInfo: '/queryexc/bussiness/cabinet/queryCabinetAndBatteryInfo', // 统计查询电柜电池信息
  queryReturnCabinetListInfo: '/queryexc/bussiness/cabinet/queryReturnCabinetListInfo', // 统计查询退电电柜电池信息
  getExchangeRecord: '/queryexc/bussiness/process/getExchangeRecord', // 换电记录
  getNewExchangeRecord: '/queryexc/bussiness/process/getNewExchangeRecord', // 新换电记录
  getExchangeRecordInfo: '/queryexc/bussiness/process/getExchangeRecordInfo', // 换电记录详情
  selectAccountNewsByGroup: '/user/bussiness/accountNews/selectAccountNewsByGroup', // 分组查询账户消息数量
  userLoginOut: '/oauth/bussiness/login/userLoginOut', // 退出登录
  selectDepositPaymentInfoByUserId: '/order/bussiness/order/selectDepositPaymentInfoByUserId', // 押金信息查询
  selectUserAuthPaymentRecord: '/order/bussiness/order/selectUserAuthPaymentRecord', // 授权信息查询
  exchangePowerBusiness: '/exc/bussiness/process/exchangePowerBusiness', // 打开电柜
  reFundPreFreeze: '/order/bussiness/alipay/reFundPreFreeze', // 套餐支付宝预授权线上资金重新授权冻结接口
  selectObjectsByKeys: '/base/public/dictionary/selectObjectsByKeys', // 关于我们参数获取
  addSuggestInfo: '/user/bussiness/personal/addSuggestInfo', // 意见反馈
  selectAllCity: '/base/public/driverRegister/selectAllCity', // 选择所有城市
  batchQueryFileInfoByIds: '/base/public/batchQueryFileInfoByIds', // 电柜轮播图查询
  getAppShareLink: '/base/public/userShare/getAppShareLink', // 获取分享参数
  checkShortMessage: '/msg/public/sms/checkShortMessage', // 校验短信验证码
  updateTurnsCity: '/user/bussiness/personal/updateTurnsCity', // 切换城市信息
  queryCityIdByCityName: '/base/public/station/queryCityIdByCityName', // 根据城市名称模糊查询城市ID
  getAllSysAreaInfo: '/base/bussiness/driverRegister/getAllSysAreaInfo', // 根据部门id获取区域信息
  queryFirstTakeFlag: '/exc/bussiness/process/queryFirstTakeFlag', // 首放标识查询
  getPostalBatteryBinding: '/queryexc/bussiness/postal/getPostalBatteryBinding', // 邮政电池绑定
  getPostalBatteryUnbound: '/queryexc/bussiness/postal/getPostalBatteryUnbound', // 邮政电池解绑
  updatePowerNoticeSwitch: '/user/bussiness/updatePowerNoticeSwitch', // 电池低电量通知开关接口：
  queryPowerNoticeSwitch: '/user/bussiness/queryPowerNoticeSwitch', // 电池低电量通知开关状态查询接口：
  getCouponInfoByDriverId: '/order/bussiness/coupon/getCouponInfoByDriverId', // 获取用户优惠卷
  enableCouponById: '/order/bussiness/coupon/enableCouponById', // 启用优惠券
  queryCabinetDoorInfo: '/queryexc/bussiness/cabinet/queryCabinetDoorInfo', // 电柜柜门查询接口
  getCouponInfoByOrderId: '/order/bussiness/coupon/getCouponInfoByOrderId', // 优惠券详情
  getRefundStatusConfirm: '/order/bussiness/refund/getRefundStatusConfirm', // 退款状态获取
  getInvitationCodeByDriverId: '/user/bussiness/personal/getInvitationCodeByDriverId', // 获取邀请码
  getCityDepositAmount: '/base/bussiness/driverRegister/getCityDepositAmount', // 根据设备类型 获取地市的设备押金金额
  queryBatteryTrackInfo: '/queryexc/bussiness/cabinet/queryBatteryTrackInfoNew', // 电池轨迹查询接口
  selectRangeReturnStationList: '/queryexc/bussiness/station/selectRangeReturnStationList', // 退电站点查询
  queryNetworkInfoList: '/queryexc/bussiness/queryNetworkInfoList', // 城市网点列表信息查询接口
  queryNetworkInfo: '/queryexc/bussiness/queryNetworkInfo', // 网点详情信息查询接口
  subApplyRefund: '/order/bussiness/refund/subApplyRefund', // 提交申请退款getApplyRefundList
  getApplyRefundList: '/order/bussiness/refund/getApplyRefundList', // 车电一体获取退款申请单列表
  getApplyRefundInfo: '/order/bussiness/refund/getApplyRefundInfo', // 车电一体获取退款申请单详情
  getChannelInfo: '/user/bussiness/personal/getChannelInfo', // 获取渠道信息
  getMyECar:'/user/bussiness/personal/getMyECar', // 获取我的车辆
  queryRentCarList: '/user/bussiness/personal/getMyECarRecordList', // 获取租车记录列表
  getMyECarRecordDet: '/user/bussiness/personal/getMyECarRecordInfo', // 获取我的租车详情
  getHistoryInvitationCodeWithDriver: '/user/bussiness/personal/getHistoryInvitationCodeWithDriver', // 获取历史邀请记录
  getMyPointsList: '/user/bussiness/personal/getIntegralRecordList', // 获取我的积分列表
  getSysNoticeInfoByNoticeId: '/msg/bussiness/news/getSysNoticeInfoByNoticeId', // 获取消息公告详情
  queryDayCabinetExchangeStatistics: '/queryexc/bussiness/cabinet/queryDayCabinetExchangeStatistics', // 换电柜详情电柜昨日时段换电曲线统计

};

export default devUrls;
