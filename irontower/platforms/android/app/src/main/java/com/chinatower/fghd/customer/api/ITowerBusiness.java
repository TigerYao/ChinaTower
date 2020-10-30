package com.chinatower.fghd.customer.api;

import com.chinatower.fghd.customer.vo.StationListInfo;
import com.chinatower.fghd.customer.vo.home.AppVersion;
import com.chinatower.fghd.customer.vo.home.OperateOfflineCabinetExcVo;
import com.chinatower.fghd.customer.vo.home.QueryAppVersion;
import com.chinatower.fghd.customer.vo.home.QueryCabinetAndBatteryVo;
import com.chinatower.fghd.customer.vo.home.ExchangePowerBusinessResultVo;
import com.chinatower.fghd.customer.vo.home.ExchangePowerBusinessVo;
import com.chinatower.fghd.customer.vo.home.FirstTakeBean;
import com.chinatower.fghd.customer.vo.home.MyBatteryInfo;
import com.chinatower.fghd.customer.vo.home.QueryBatteryVo;
import com.chinatower.fghd.customer.vo.home.QueryFirstTakeVo;
import com.chinatower.fghd.customer.vo.home.QueryServiceVo;
import com.chinatower.fghd.customer.vo.home.QueryStationVo;
import com.chinatower.fghd.customer.vo.home.QueryUserVo;
import com.chinatower.fghd.customer.vo.home.ServiceListInfo;
import com.chinatower.fghd.customer.vo.home.ShareLinkInfo;
import com.chinatower.fghd.customer.vo.home.StationInfo;
import com.chinatower.fghd.customer.vo.home.UpdateUserBatteryVoltsVo;
import com.chinatower.fghd.customer.vo.home.UserDetailInfo;
import com.ztesoft.baselib.netutils.BaseResp;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;

/**
 * @auther EnzoChan
 * created:2020/8/25
 * desc:
 */
public interface ITowerBusiness {
    /**
     * 查询电池信息
     *
     * @param token
     * @param batteryVo
     * @return
     */
    @POST("/queryexc/bussiness/cabinet/queryBatteryElectricQuantity")
    Call<BaseResp<MyBatteryInfo>> queryBatteryElectricQuantity(@Header("Authorization") String token, @Body QueryBatteryVo batteryVo);


    /**
     * 查询换电站
     *
     * @param token
     * @param mQueryStationVo
     * @return
     */
    @POST("/queryexc/bussiness/station/selectRangeStationListNew")
    Call<BaseResp<List<StationInfo>>> selectRangeStationList(@Header("Authorization") String token, @Body QueryStationVo mQueryStationVo);

    /**
     * 查询服务网店
     *
     * @param token
     * @param mQueryServiceVo
     * @return
     */
    @POST("/queryexc/bussiness/queryNetworkInfoList")
    Call<BaseResp<ServiceListInfo>> queryNetworkInfoList(@Header("Authorization") String token, @Body QueryServiceVo mQueryServiceVo);


    /**
     * 查询换电站
     *
     * @param token
     * @param mQueryStationVo
     * @return
     */
    @POST("/queryexc/bussiness/station/selectRangeReturnStationListNew")
    Call<BaseResp<List<StationInfo>>> selectRangeReturnStationList(@Header("Authorization") String token, @Body QueryStationVo mQueryStationVo);

    /**
     * 查询个人信息
     *
     * @param token
     * @param mQueryUserVo
     * @return
     */

    @POST("/user/bussiness/personal/selectUserInfo")
    Call<BaseResp<UserDetailInfo>> selectUserInfo(@Header("Authorization") String token, @Body QueryUserVo mQueryUserVo);


    /**
     * 分享信息
     *
     * @return
     */
    @GET("/base/public/userShare/getAppShareLink")
    Call<BaseResp<ShareLinkInfo>> getAppShareLink();


    /**
     * 首放查询
     *
     * @param token
     * @param mQueryFirstTakeVo
     * @return
     */
    @POST("/exc/bussiness/process/queryFirstTakeFlag")
    Call<BaseResp<FirstTakeBean>> queryFirstTakeFlag(@Header("Authorization") String token, @Body QueryFirstTakeVo mQueryFirstTakeVo);

    /**
     * 更新用户信息
     *
     * @param token
     * @param mUpdateUserVo
     * @return
     */
    @POST("/user/bussiness/personal/updateUserInfo")
    Call<BaseResp<Void>> updateUserInfo(@Header("Authorization") String token, @Body UpdateUserBatteryVoltsVo mUpdateUserVo);


    /**
     * 打开柜门
     *
     * @param token
     * @param mmExchangePowerBusinessVo
     * @return
     */
    @POST("/exc/bussiness/process/exchangePowerBusiness")
    Call<BaseResp<ExchangePowerBusinessResultVo>> exchangePowerBusiness(@Header("Authorization") String token, @Body ExchangePowerBusinessVo mmExchangePowerBusinessVo);

    /**
     * 离线换电
     *
     * @param token
     * @param mOperateOfflineCabinetExcVo
     * @return
     */
    @POST("/exc/bussiness/offlineCabinet/operateOfflineCabinetExc")
    Call<BaseResp<ExchangePowerBusinessResultVo>> operateOfflineCabinetExc(@Header("Authorization") String token, @Body OperateOfflineCabinetExcVo mOperateOfflineCabinetExcVo);


    /**
     * 查询换电柜详情
     *
     * @param token
     * @param mQueryCabinetAndBatteryVo
     * @return
     */
    @POST("/queryexc/bussiness/cabinet/queryCabinetAndBatteryInfo")
    Call<BaseResp<List<StationListInfo>>> queryCabinetAndBatteryInfo(@Header("Authorization") String token, @Body QueryCabinetAndBatteryVo mQueryCabinetAndBatteryVo);


    /**
     * 退电指引的电柜详情
     *
     * @param token
     * @param mQueryCabinetAndBatteryVo
     * @return
     */
    @POST("/queryexc/bussiness/cabinet/queryReturnCabinetListInfo")
    Call<BaseResp<List<StationListInfo>>> queryReturnCabinetListInfo(@Header("Authorization") String token, @Body QueryCabinetAndBatteryVo mQueryCabinetAndBatteryVo);


    /**
     * 版本信息
     *
     * @param mQueryAppVersion
     * @return
     */
    @POST("/base/public/UpgradeAction/queryUpgrade")
    Call<BaseResp<AppVersion>> queryUpgrade(@Body QueryAppVersion mQueryAppVersion);

}
