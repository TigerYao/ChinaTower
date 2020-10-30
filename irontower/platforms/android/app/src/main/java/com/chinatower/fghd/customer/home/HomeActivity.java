package com.chinatower.fghd.customer.home;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.baidu.location.BDLocation;
import com.baidu.mapapi.map.MapStatus;
import com.baidu.mapapi.map.MapView;
import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.utils.DistanceUtil;
import com.bumptech.glide.load.resource.bitmap.CircleCrop;
import com.bumptech.glide.request.RequestOptions;
import com.chinatower.fghd.customer.Constant.Constant;
import com.chinatower.fghd.customer.Constant.PersonCenterData;
import com.chinatower.fghd.customer.MainActivity;
import com.chinatower.fghd.customer.R;
import com.chinatower.fghd.customer.api.ITowerBusiness;
import com.chinatower.fghd.customer.home.adapter.PersonCenterAdapter;
import com.chinatower.fghd.customer.update.UpdateDialog;
import com.chinatower.fghd.customer.util.APKVersionCodeUtils;
import com.chinatower.fghd.customer.util.UserInfoUtils;
import com.chinatower.fghd.customer.vo.JpushTypeBean;
import com.chinatower.fghd.customer.vo.StationListInfo;
import com.chinatower.fghd.customer.vo.ToJsPathBean;
import com.chinatower.fghd.customer.vo.UserInfo;
import com.chinatower.fghd.customer.vo.home.AppVersion;
import com.chinatower.fghd.customer.vo.home.MyBatteryInfo;
import com.chinatower.fghd.customer.vo.home.QueryAppVersion;
import com.chinatower.fghd.customer.vo.home.QueryBatteryVo;
import com.chinatower.fghd.customer.vo.home.QueryCabinetAndBatteryVo;
import com.chinatower.fghd.customer.vo.home.QueryServiceVo;
import com.chinatower.fghd.customer.vo.home.QueryStationVo;
import com.chinatower.fghd.customer.vo.home.QueryUserVo;
import com.chinatower.fghd.customer.vo.home.ServiceDetailInfo;
import com.chinatower.fghd.customer.vo.home.ServiceListInfo;
import com.chinatower.fghd.customer.vo.home.StationInfo;
import com.chinatower.fghd.customer.vo.home.UpdateUserBatteryVoltsVo;
import com.chinatower.fghd.customer.vo.home.UserDetailInfo;

import com.chinatower.fghd.customer.widget.BatteryView;
import com.google.gson.Gson;
import com.ztesoft.baselib.base.BaseActivity;
import com.ztesoft.baselib.constant.ExtraName;
import com.ztesoft.baselib.netutils.BaseResp;
import com.ztesoft.baselib.netutils.HRetrofitNetHelper;
import com.ztesoft.baselib.utils.DisplayUtil;
import com.ztesoft.baselib.utils.GlideUtils;
import com.ztesoft.baselib.utils.ShareManager;
import com.ztesoft.baselib.views.RemindDialog;
import com.ztesoft.baselib.views.ToastView;

import org.apache.cordova.h5Bridge.H5bridge;

import java.util.List;

import retrofit2.Call;

public class HomeActivity extends BaseActivity implements MapHelper.MapHelperListener, QRCodeHelper.QRCodeHelperListener, View.OnClickListener, RadioGroup.OnCheckedChangeListener {

    private ImageView mIvAvater;
    private ImageView mIvDrawerAvater;
    private ImageView mIvMsg;
    private RelativeLayout mRlTitle;
    private RelativeLayout mRlScan;
    private RelativeLayout mRlLeft;
    private RelativeLayout mRlAddViews;

    private RecyclerView ryPersonCenter;

    private DrawerLayout mDlMain;
    private MapView mMapView;
    /**
     * 张郑恺
     */
    private TextView mTvNickName;
    private TextView mTvBatteryId;
    /**
     * 已认证
     */
    private TextView mTvAuthStatus;

    private TextView mTvMobile;
    /**
     * 版本号 v4.0.6
     */
    private TextView mTvVersion;
    /**
     * 退出登录
     */
    private TextView mTvLogout;

    /**
     * 换电站
     */
    private RadioButton mRbExchangeStation;
    /**
     * 服务网点
     */
    private RadioButton mRbService;
    /**
     * 退电指引
     */
    private RadioButton mRbGuidelines;
    private RadioGroup mRgQueryType;
    private UserInfo mUserInfo;


    private UserDetailInfo mUserDetailInfo;

    ITowerBusiness iCloudBusiness;


    private QueryStationVo queryStationVo;


    private Integer currentQueryType = 0;


    private QueryServiceVo mQueryServiceVo;

    private MapHelper mapHelper;


    private boolean hasBattery;
    /**
     * 立即认证
     */
    private TextView mTvToAuth;
    private RelativeLayout mRlToAuth;

    private BatteryView mMyBattery;
    /**
     * 50%
     */
    private TextView mTvCurrentPower;
    private LinearLayout mLlMybattery;

    private Boolean isLaucherWeb;

    /**
     * 是否显示隐私协议
     */
    private boolean isShowPrivary = false;

    private HomeBroadcastReceiver mHomeBroadcastReceiver;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        Log.d("ckf", "onCreate start");
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_home);

        if (ContextCompat.checkSelfPermission(HomeActivity.this, android.Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(HomeActivity.this,
                    new String[]{
                            android.Manifest.permission.ACCESS_FINE_LOCATION}, 200);
        }

        getIntentValues();
        initBroadcast();
        initView();
        initMaps();
        initData();
        Log.d("ckf", "onCreate end");

    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case 200:
                if (grantResults.length != 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    initMaps();

                } else {
                    Toast.makeText(this, "未开启相机权限，请手动到设置去开去权限", Toast.LENGTH_SHORT).show();
                }
                break;
            default:
                break;
        }
    }

    private void initBroadcast() {
        mHomeBroadcastReceiver = new HomeBroadcastReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction(H5bridge.HOME_UPDATE_USER_INFO_ACTION);
        filter.addAction(H5bridge.HOME_UPDATE_ANNOTATION_ACTION);
        filter.addAction(H5bridge.JPUSH_ACTION);
        filter.addAction(H5bridge.JPUSH_DATA_ACTION);
        registerReceiver(mHomeBroadcastReceiver, filter);
    }

    public class HomeBroadcastReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals(H5bridge.HOME_UPDATE_ANNOTATION_ACTION)) {
                selectUserInfo(true);
                //刷新
                mapHelper.backCurrentLocation();
                mapHelper.clearAllMarker();
                if (currentQueryType == 0 || currentQueryType == 2) {
                    selectStationList(true);
                } else {
                    queryNetworkInfoList(true);
                }

            } else if (intent.getAction().equals(H5bridge.HOME_UPDATE_USER_INFO_ACTION)) {
                selectUserInfo(true);
            } else if (intent.getAction().equals(H5bridge.JPUSH_ACTION)) {
                JpushTypeBean jpushTypeBean = (JpushTypeBean) intent.getSerializableExtra("data");
                transmitNotificationOpen(jpushTypeBean);
            } else if (intent.getAction().equals(H5bridge.JPUSH_DATA_ACTION)) {
                JpushTypeBean jpushTypeBean = (JpushTypeBean) intent.getSerializableExtra("data");
                String jsFunction = null;
                Gson mGson = new Gson();
                if (jpushTypeBean.getType().startsWith("5")) {
                    jsFunction = "window.pushToQueryData('" + mGson.toJson(jpushTypeBean) + "')";
                    startWebPage("javascript:" + jsFunction);
                }
            }
        }
    }

    public void transmitNotificationOpen(JpushTypeBean jpushTypeBean) {
        String type = jpushTypeBean.getType();
        Gson mGson = new Gson();

        String jsFunction = null;
        if (type.equals("1") || type.equals("0")) {
            ToJsPathBean toJsPathBean = new ToJsPathBean();
            toJsPathBean.setPathname("/myWallet/tradingDetail");
            String json = mGson.toJson(toJsPathBean);
            jsFunction = "window.pushToPage('" + json + "')";
        } else if ("".equals(type)) {
            jsFunction = "window.pushToPage('" + type + "')";
        } else if (type.startsWith("5")) {
            jsFunction = "window.pushToPage('" + jpushTypeBean.getType() + "'," + jpushTypeBean.getNoticeId() + ")";

        }

        startWebPage("javascript:" + jsFunction);
    }

    private void initMaps() {
        mapHelper = MapHelper.getInstance();
        mapHelper.init(mMapView, HomeActivity.this, mRlAddViews);
        mapHelper.setmMapHelperListener(this);

    }

    private void initData() {
        iCloudBusiness = retrofitNetHelper.getAPIService(ITowerBusiness.class);
        mUserInfo = UserInfoUtils.getUserInfo(this);
        if (mUserInfo == null) {
            return;
        }
//        selectUserInfo(true);
        mTvMobile.setText(mUserInfo.getAccount());
        if (mUserInfo.getCertification().equals("1")) {
            mTvAuthStatus.setText("已认证");
            mTvAuthStatus.setTextColor(getResources().getColor(R.color.drawer_auth_text_color));
            mTvAuthStatus.setBackgroundResource(R.drawable.drawer_auth_back);
            mRlToAuth.setVisibility(View.GONE);
        } else {
            mTvAuthStatus.setText("未认证");
            mTvAuthStatus.setTextColor(getResources().getColor(R.color.drawer_un_auth_text_color));
            mTvAuthStatus.setBackgroundResource(R.drawable.drawer_un_auth_back);
            mRlToAuth.setVisibility(View.VISIBLE);
        }

        mTvNickName.setText(mUserInfo.getRealName());

        Integer defaultAvater = null;
        if (!TextUtils.isEmpty(mUserInfo.getSex()) && mUserInfo.getSex().equals("0")) {
            //nan
            defaultAvater = R.mipmap.home_default_avater;
        } else {
            defaultAvater = R.mipmap.avatar_woman;
        }
        RequestOptions options = RequestOptions.bitmapTransform(new CircleCrop()).fallback(R.mipmap.home_default_avater).error(defaultAvater);
        GlideUtils.with().displayImage(mUserInfo.getAvatar(), mIvDrawerAvater, options);
        GlideUtils.with().displayImage(mUserInfo.getAvatar(), mIvAvater, options);
        mTvVersion.append(APKVersionCodeUtils.getVerName(this));


        queryUpgrade(false);


    }

    private void queryUpgrade(boolean isShowToast) {
        showDialog();
        Call<BaseResp<AppVersion>> call = iCloudBusiness.queryUpgrade(new QueryAppVersion("exchange_android"));

        retrofitNetHelper.enqueueCall(call, new HRetrofitNetHelper.RetrofitCallBack<AppVersion>() {
            @Override
            public void onSuccess(BaseResp<AppVersion> baseResp) {
                cancelDialog();

                AppVersion appVersion = baseResp.getResultObject();

                Integer localVersion = APKVersionCodeUtils.getVersionCode(HomeActivity.this);
                try {
                    if (Integer.parseInt(appVersion.getAppVersionNo()) > localVersion) {

                        UpdateDialog dialog = new UpdateDialog(HomeActivity.this);
                        dialog.setAppVersion(appVersion);
                        dialog.show();

                    } else {
                        if (isShowToast) {
                            ToastView.showLong("您目前版本最新版本");
                        }

                    }
                } catch (Exception e) {

                }


            }

            @Override
            public void onFailure(String error) {
                cancelDialog();
                ToastView.showLong(error);
            }
        });
    }


    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            default:
                break;
            case R.id.iv_avater:
                //打开抽屉
                mDlMain.openDrawer(mRlLeft);
                //清除路线规划
                mapHelper.clearbikingRoute();
//                mDlMain.closeDrawer(mRlLeft);
                break;
            case R.id.iv_msg:
                //跳转到react 消息中心
                startWebPage("#/news/news");
                break;
            case R.id.rl_scan:
                //扫码
                ScanHelper helper = ScanHelper.getInstance();
                helper.setmQRCodeHelperListener(this);
                helper.setView(findViewById(R.id.rl_scan));
                helper.toScan(HomeActivity.this);
                break;
            case R.id.iv_location:
                //设置定位数据
                LatLng ll = mapHelper.backCurrentLocation();
                if (queryStationVo == null) {
                    queryStationVo = new QueryStationVo();
                }
                if (ll == null) {
                    return;
                }

                queryStationVo.setStationLatitude(ll.latitude);
                queryStationVo.setStationLongitude(ll.longitude);

                if (currentQueryType == 0 || currentQueryType == 2) {
                    selectStationList(true);
                } else {
                    queryNetworkInfoList(true);
                }
                break;
            case R.id.iv_location_refresh:
                //刷新
                mapHelper.clearAllMarker();
                if (currentQueryType == 0 || currentQueryType == 2) {
                    selectStationList(false);
                } else {
                    queryNetworkInfoList(false);
                }
                break;
            case R.id.iv_zoom_in:
                //使缩放级别减小一级
                mapHelper.zoomOut();
                break;
            case R.id.iv_zoom_out:
                //使缩放级别增大一级
                mapHelper.zoomIn();
                break;

            case R.id.ll_mybattery:
                startWebPage("#/myBattery");
                break;
            case R.id.ll_user_info:
                startWebPage("#/personalCenter/personalNews");
                break;
            case R.id.tv_version:
                //检测更新
                queryUpgrade(true);
                break;
            case R.id.tv_logout:
                //退出
                showSignOutDialog();
                break;

            case R.id.tv_to_auth:
                //实名认证
                startWebPage("#/realNameAuth");

                break;

            case R.id.iv_server:

                //客服
                ServiceHelper.getInstance().showDialog(this, UserInfoUtils.getUserDetailInfo(this));

                break;
        }
    }

    private void showSignOutDialog() {
        RemindDialog dialog = new RemindDialog(mContext);
        dialog.setTitle("温馨提示");
        String content = "确认退出？";
        dialog.setContent(content);
        dialog.setButtonInfoRight("确定", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
                startWebPage("#/login/index");
                finish();
            }
        });

        dialog.setButtonInfoLeft("取消", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });

        dialog.show();


    }

    private void startWebPage(String url) {
        if (mapHelper != null) {
            mapHelper.clearbikingRoute();
        }
        Intent mIntent = new Intent(this, MainActivity.class);
        mIntent.putExtra(Constant.TRAN_DATA_KEY, url);

        this.startActivity(mIntent);
        overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);

    }


    private boolean isToTraining = false;
    Handler handler;
    Runnable runnable;

    /**
     * 查询电量信息
     */
    public void trainingPower() {
        handler = new Handler();
        runnable = new Runnable() {

            @Override
            public void run() {
                // 查询电量信息
                queryBatteryElectricQuantity(false);
                handler.postDelayed(this, 1000 * 60 * 3);//每隔3分钟执行

            }
        };
        handler.post(runnable);

    }


    public void queryBatteryElectricQuantity(boolean isShowDialog) {

        if (isShowDialog) {
            showDialog();
        }
        Call<BaseResp<MyBatteryInfo>> call = iCloudBusiness.queryBatteryElectricQuantity(mUserInfo.getBearerToken(), new QueryBatteryVo(mUserInfo.getDriverId(), mUserDetailInfo.getBatteryId()));
        retrofitNetHelper.enqueueCall(call, new HRetrofitNetHelper.RetrofitCallBack<MyBatteryInfo>() {
            @Override
            public void onSuccess(BaseResp<MyBatteryInfo> baseResp) {
                if (isShowDialog) {
                    cancelDialog();
                }
                MyBatteryInfo myBatteryInfo = baseResp.getResultObject();

                if (myBatteryInfo != null) {
                    //设置电池电量
                    hasBattery = true;
                    if (!TextUtils.isEmpty(myBatteryInfo.getCurrentCapacity())) {

                        mMyBattery.setPower(Integer.parseInt(myBatteryInfo.getCurrentCapacity()));
                        mMyBattery.setOnLine(myBatteryInfo.getOnlineStatus().equals("1"));
                        mTvCurrentPower.setText(myBatteryInfo.getCurrentCapacity() + "%");
                        Integer powerColor = null;
                        if (myBatteryInfo.getOnlineStatus().equals("1")) {
                            Integer mPower = Integer.parseInt(myBatteryInfo.getCurrentCapacity());
                            if (mPower >= 30) {
                                powerColor = getResources().getColor(R.color.main_theme);
                            } else if (mPower >= 20 && mPower < 30) {
                                powerColor = getResources().getColor(R.color.power_20_30);
                            } else {
                                powerColor = getResources().getColor(R.color.power_down_20);
                            }
                        } else {
                            powerColor = getResources().getColor(R.color.power_off_line);
                        }
                        mTvCurrentPower.setTextColor(powerColor);
                        if (myBatteryInfo.getOnlineStatus().equals("0")) {
                            //离线
                            mTvCurrentPower.setTextColor(getResources().getColor(R.color.power_off_line));
                        }
                        mTvBatteryId.setText(myBatteryInfo.getBatteryId());
                        mLlMybattery.setVisibility(View.VISIBLE);
                        mTvBatteryId.setVisibility(View.VISIBLE);
//                        mTvBatteryId.setTextSize(DisplayUtil.px2sp(HomeActivity.this,24));
                    } else {
                        mLlMybattery.setVisibility(View.GONE);
                    }

                    //轮训电量
                    if (!isToTraining) {
                        trainingPower();
                        isToTraining = true;
                    }


                } else {
                    mLlMybattery.setVisibility(View.GONE);
                }

            }

            @Override
            public void onFailure(String error) {
                cancelDialog();
                ToastView.showLong(error);
            }
        });
    }


    public void selectStationList(boolean isShowDialog) {
        if (mUserInfo == null || queryStationVo == null) {
            return;
        }
        if (isShowDialog) {
            showDialog();

        }
        Call<BaseResp<List<StationInfo>>> call = null;
        if (currentQueryType == 0) {
            call = iCloudBusiness.selectRangeStationList(mUserInfo.getBearerToken(), queryStationVo);

        } else if (currentQueryType == 2) {
            call = iCloudBusiness.selectRangeReturnStationList(mUserInfo.getBearerToken(), queryStationVo);
        } else {
            return;
        }
        retrofitNetHelper.enqueueCall(call, new HRetrofitNetHelper.RetrofitCallBack<List<StationInfo>>() {
            @Override
            public void onSuccess(BaseResp<List<StationInfo>> baseResp) {
                if (isShowDialog) {
                    cancelDialog();
                }

                //点
                mapHelper.markerStation(baseResp.getResultObject());


            }

            @Override
            public void onFailure(String error) {
                if (isShowDialog) {
                    cancelDialog();
                }
                ToastView.showLong(error);
            }
        });
    }


    public void queryNetworkInfoList(boolean isShowDialog) {

        if (mQueryServiceVo == null) {
            return;
        }
        if (isShowDialog) {
            showDialog();

        }


        Call<BaseResp<ServiceListInfo>> call = iCloudBusiness.queryNetworkInfoList(mUserInfo.getBearerToken(), mQueryServiceVo);

        retrofitNetHelper.enqueueCall(call, new HRetrofitNetHelper.RetrofitCallBack<ServiceListInfo>() {
            @Override
            public void onSuccess(BaseResp<ServiceListInfo> baseResp) {
                if (isShowDialog) {
                    cancelDialog();
                }
                if (baseResp.getResultObject() != null) {
                    mapHelper.markerService(baseResp.getResultObject().getBsNetworkInfoList());
                }


            }

            @Override
            public void onFailure(String error) {
                cancelDialog();
                ToastView.showLong(error);
            }
        });
    }

    public void selectUserInfo(boolean isShowDialog) {
        if (isShowDialog) {
            showDialog();
        }
        Call<BaseResp<UserDetailInfo>> call = iCloudBusiness.selectUserInfo(mUserInfo.getBearerToken(), new QueryUserVo(mUserInfo.getDriverId()));

        retrofitNetHelper.enqueueCall(call, new HRetrofitNetHelper.RetrofitCallBack<UserDetailInfo>() {
            @Override
            public void onSuccess(BaseResp<UserDetailInfo> baseResp) {
                if (isShowDialog) {
                    cancelDialog();
                }
                mUserDetailInfo = baseResp.getResultObject();
                mUserDetailInfo.setHasBattery(hasBattery);
                UserInfoUtils.setUserDetailInfo(HomeActivity.this, mUserDetailInfo);

                String phoneOs = APKVersionCodeUtils.getDeviceBrand() + " " + APKVersionCodeUtils.getDeviceMobile() + " " + APKVersionCodeUtils.getSystemVersion();
                //更新 手机等信息
                if (!phoneOs.equals(mUserDetailInfo.getPhoneOs())) {
                    UpdateUserBatteryVoltsVo mUpdateUserBatteryVoltsVo = new UpdateUserBatteryVoltsVo();
                    mUpdateUserBatteryVoltsVo.setPhoneOs(phoneOs);
                    mUpdateUserBatteryVoltsVo.setDriverId(mUserDetailInfo.getDriverId());
                    UpdateUserInfo(mUpdateUserBatteryVoltsVo);
                }
                String versionName = APKVersionCodeUtils.getVerName(HomeActivity.this);
                if (!versionName.equals(mUserDetailInfo.getAppVersion())) {
                    UpdateUserBatteryVoltsVo mUpdateUserBatteryVoltsVo = new UpdateUserBatteryVoltsVo();
                    mUpdateUserBatteryVoltsVo.setAppVersion(versionName);
                    mUpdateUserBatteryVoltsVo.setDriverId(mUserDetailInfo.getDriverId());
                    UpdateUserInfo(mUpdateUserBatteryVoltsVo);
                }

                String phoneModel = APKVersionCodeUtils.getDeviceMobile();


                if (!phoneModel.equals(mUserDetailInfo.getPhoneModel())) {
                    UpdateUserBatteryVoltsVo mUpdateUserBatteryVoltsVo = new UpdateUserBatteryVoltsVo();
                    mUpdateUserBatteryVoltsVo.setPhoneModel(phoneModel);
                    mUpdateUserBatteryVoltsVo.setDriverId(mUserDetailInfo.getDriverId());
                    UpdateUserInfo(mUpdateUserBatteryVoltsVo);
                }
                queryStationVo = QueryStationVo.getQueryStationVo(mUserDetailInfo);
                if (lastLLatLng != null) {
                    queryStationVo.setStationLongitude(lastLLatLng.longitude);
                    queryStationVo.setStationLatitude(lastLLatLng.latitude);
                }
                mQueryServiceVo = QueryServiceVo.getInstance(mUserDetailInfo);
//
                selectStationList(isShowDialog);
                //查询电池电量
                queryBatteryElectricQuantity(isShowDialog);
            }

            @Override
            public void onFailure(String error) {
                cancelDialog();
                ToastView.showLong(error);
            }
        });
    }


    @Override
    protected void onResume() {
        Log.d("ckf", "onResume start");
        super.onResume();
        // activity 恢复时同时恢复地图控件
        if (mMapView != null) {
            mMapView.onResume();
        }

        if (currentQueryType != 1) {
            if (lastLLatLng == null) {
                lastLLatLng = UserInfoUtils.getLatLng(this);
            }
            selectUserInfo(false);
        } else {
            queryNetworkInfoList(false);
        }

        Log.d("ckf", "onResume end");
    }

    @Override
    protected void onPause() {
        Log.d("ckf", "onPause start");
        if (lastLLatLng != null) {
            UserInfoUtils.setLatLng(this, lastLLatLng);
        }
        super.onPause();
        // activity 暂停时同时暂停地图控件
        mMapView.onPause();
        Log.d("ckf", "onPause end");

    }

    @Override
    public void onDestroy() {
        Log.d("ckf", "homeActivity onDestory");
        super.onDestroy();
        if (mapHelper != null) {
            mapHelper.onDestroy();
        }
        if (isToTraining) {
            handler.removeCallbacks(runnable);
        }
        if (mHomeBroadcastReceiver != null) {
            unregisterReceiver(mHomeBroadcastReceiver);
        }

    }

    @Override
    public void onCheckedChanged(RadioGroup group, int checkedId) {
        switch (checkedId) {
            case R.id.rb_exchange_station:

                if (currentQueryType != 0) {
                    currentQueryType = 0;
                    selectStationList(true);
                }
                break;

            case R.id.rb_service:

                if (currentQueryType != 1) {
                    queryNetworkInfoList(false);
                }
                currentQueryType = 1;
                break;

            case R.id.rb_guidelines:
                if (currentQueryType != 2) {
                    currentQueryType = 2;
                    selectStationList(true);
                }


                break;
        }
    }

    LatLng lastLLatLng = null;
    Long lastTimeTemp = System.currentTimeMillis();

    @Override
    public void onReceiveLocation(BDLocation bdLocation) {
        ToastView.showLong("定位失败，请检查定位权限");
    }

    /**
     * 地图状态改变结束回调
     *
     * @param mapStatus
     */
    @Override
    public void onMapStatusChangeFinish(MapStatus mapStatus) {
        if (!isShowPrivary) {
            isShowPrivary = true;
            String phone = ShareManager.getValue(this, mUserInfo.getPhoneNumber());
            if (TextUtils.isEmpty(phone)) {
                PrivacyActivity.startActivity(this, mUserInfo.getPhoneNumber());
            }
        }

        if (lastLLatLng == null) {
            lastLLatLng = mapStatus.target;
        }

        Double distance = DistanceUtil.getDistance(mapStatus.target, lastLLatLng);
        Log.d("ckf", "距离为-----> " + distance);
        Log.d("ckf", "时间差为-----> " + (System.currentTimeMillis() - lastTimeTemp) / (60 * 1000) + "分钟");
        /**
         * 距离大于1000米或者时间为10分钟前
         */
        if (distance > 1000 || System.currentTimeMillis() - lastTimeTemp > 10 * 60 * 1000) {
            lastTimeTemp = System.currentTimeMillis();
            lastLLatLng = mapStatus.target;
            getCabinetData(mapStatus);
        }


    }

    public void getCabinetData(MapStatus mapStatus) {
        LatLng cenpt = mapStatus.target;
        if (queryStationVo != null) {
            queryStationVo.setStationLatitude(cenpt.latitude);
            queryStationVo.setStationLongitude(cenpt.longitude);
        }
        if (currentQueryType == 0 || currentQueryType == 2) {
            selectStationList(false);
        }
    }

    /**
     * 换电站
     *
     * @param mStationInfo
     */
    public void queryCabinetAndBatteryInfo(StationInfo mStationInfo) {
        showDialog();
        Call<BaseResp<List<StationListInfo>>> call = iCloudBusiness.queryCabinetAndBatteryInfo(mUserInfo.getBearerToken(), new QueryCabinetAndBatteryVo(mStationInfo.getStationId()));

        retrofitNetHelper.enqueueCall(call, new HRetrofitNetHelper.RetrofitCallBack<List<StationListInfo>>() {
            @Override
            public void onSuccess(BaseResp<List<StationListInfo>> baseResp) {
                cancelDialog();
                NetInfoPopuHelper.showStationInfo(mStationInfo.getGreyFlag(), baseResp.getResultObject(), HomeActivity.this, mRlAddViews, currentQueryType);
            }

            @Override
            public void onFailure(String error) {
                cancelDialog();
                ToastView.showLong(error);
            }
        });
    }

    /**
     * 退电指引
     *
     * @param mStationInfo
     */
    public void queryReturnCabinetListInfo(StationInfo mStationInfo) {
        showDialog();
        Call<BaseResp<List<StationListInfo>>> call = iCloudBusiness.queryReturnCabinetListInfo(mUserInfo.getBearerToken(), new QueryCabinetAndBatteryVo(mStationInfo.getStationId()));

        retrofitNetHelper.enqueueCall(call, new HRetrofitNetHelper.RetrofitCallBack<List<StationListInfo>>() {
            @Override
            public void onSuccess(BaseResp<List<StationListInfo>> baseResp) {
                cancelDialog();
                NetInfoPopuHelper.showStationInfo(mStationInfo.getGreyFlag(), baseResp.getResultObject(), HomeActivity.this, mRlAddViews, currentQueryType);
            }

            @Override
            public void onFailure(String error) {
                cancelDialog();
                ToastView.showLong(error);
            }
        });
    }

    /**
     * 点击换电站
     *
     * @param stationInfo
     */
    @Override
    public void onStationClick(StationInfo stationInfo) {
        if (currentQueryType == 0) {
            queryCabinetAndBatteryInfo(stationInfo);

        } else if (currentQueryType == 2) {
            queryReturnCabinetListInfo(stationInfo);
        }
    }


    /**
     * 点击服务网点
     *
     * @param stationInfo
     */

    @Override
    public void onNetClick(ServiceDetailInfo stationInfo) {
        NetInfoPopuHelper.showNetInfo(stationInfo, this, mRlAddViews);

    }

    @Override
    protected void onNewIntent(Intent intent) {
        Log.d("ckf", "onNewIntent start");
        super.onNewIntent(intent);
        Log.d("ckf", "onNewIntent end");

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode != RESULT_OK) {
            return;
        }
        if (requestCode == 1003) {
            String content = data.getStringExtra(ExtraName.KEY_DATA);
            QRCodeHelper mQRCodeHelper = QRCodeHelper.getInstance(this);
            mQRCodeHelper.qrCodeAnalysis(content, this);
            mQRCodeHelper.setQRCodeHelperListener(HomeActivity.this);
        } else if (requestCode == PrivacyActivity.REQUEST_CODE_PRIVACY) {
            Intent mIntent = new Intent(HomeActivity.this, MainActivity.class);
            String url = "login/";
            mIntent.putExtra(Constant.TRAN_DATA_KEY, url);
            startActivity(mIntent);
            finish();

        }
    }

    /**
     * 扫码过后查询电池的回调
     */
    @Override
    public void toQueryBattery() {
        queryBatteryElectricQuantity(true);
    }


    private void initView() {
        mIvAvater = (ImageView) findViewById(R.id.iv_avater);
        mIvAvater.setOnClickListener(this);
        mIvDrawerAvater = (ImageView) findViewById(R.id.iv_drawer_avater);
        mIvMsg = (ImageView) findViewById(R.id.iv_msg);
        mIvMsg.setOnClickListener(this);
        mRlTitle = (RelativeLayout) findViewById(R.id.rl_title);
        mMapView = (MapView) findViewById(R.id.g_mapView);
        mRlScan = (RelativeLayout) findViewById(R.id.rl_scan);
        mRlAddViews = (RelativeLayout) findViewById(R.id.rl_bottom_for_add_view);
        mRlScan.setOnClickListener(this);
        ryPersonCenter = findViewById(R.id.ry_person_center);
        findViewById(R.id.iv_location).setOnClickListener(this);
        findViewById(R.id.iv_location_refresh).setOnClickListener(this);
        findViewById(R.id.iv_zoom_in).setOnClickListener(this);
        findViewById(R.id.iv_zoom_out).setOnClickListener(this);
        findViewById(R.id.ll_mybattery).setOnClickListener(this);
        findViewById(R.id.ll_user_info).setOnClickListener(this);
        findViewById(R.id.iv_server).setOnClickListener(this);
        PersonCenterAdapter mAdapter = new PersonCenterAdapter(this);
        ryPersonCenter.setLayoutManager(new LinearLayoutManager(this));

        ryPersonCenter.setAdapter(mAdapter);
        mAdapter.setItems(PersonCenterData.getPersonCenterList(this));
        mAdapter.setOnItemClickListener(new PersonCenterAdapter.onItemClickListener() {
            @Override
            public void onClick(View v) {
                mDlMain.closeDrawer(mRlLeft);
            }
        });
        mRlLeft = findViewById(R.id.rl_left);
        DrawerLayout.LayoutParams relativeParams = (DrawerLayout.LayoutParams) mRlLeft.getLayoutParams();
        relativeParams.width = DisplayUtil.getWidth(this) / 4 * 3;
        mRlLeft.setLayoutParams(relativeParams);

        mDlMain = findViewById(R.id.dl_main);
        mTvNickName = (TextView) findViewById(R.id.tv_nick_name);
        mTvAuthStatus = (TextView) findViewById(R.id.tv_auth_status);
        mTvMobile = (TextView) findViewById(R.id.tv_mobile);
        mTvVersion = (TextView) findViewById(R.id.tv_version);
        mTvVersion.setOnClickListener(this);
        mTvLogout = (TextView) findViewById(R.id.tv_logout);
        mTvLogout.setOnClickListener(this);
        mRbExchangeStation = (RadioButton) findViewById(R.id.rb_exchange_station);
        mRbService = (RadioButton) findViewById(R.id.rb_service);
        mRbGuidelines = (RadioButton) findViewById(R.id.rb_guidelines);
        mRgQueryType = (RadioGroup) findViewById(R.id.rg_query_type);
        mRgQueryType.check(R.id.rb_exchange_station);
        mRgQueryType.setOnCheckedChangeListener(this);
        mTvToAuth = (TextView) findViewById(R.id.tv_to_auth);
        mTvToAuth.setOnClickListener(this);
        mRlToAuth = (RelativeLayout) findViewById(R.id.rl_to_auth);
        mMyBattery = (BatteryView) findViewById(R.id.my_battery);
        mTvCurrentPower = (TextView) findViewById(R.id.tv_current_power);
        mTvBatteryId = (TextView) findViewById(R.id.tv_battery_id);
        mLlMybattery = (LinearLayout) findViewById(R.id.ll_mybattery);


    }


    private void getIntentValues() {
        isLaucherWeb = getIntent().getBooleanExtra(ExtraName.KEY_DATA, false);
    }

    private long mExitTime;//实现“再按一次退出”的记录时间变量


    @Override //再按一次退出程序
    public void onBackPressed() {
        if (System.currentTimeMillis() - mExitTime < 2000) {
            super.onBackPressed();
        } else {
            mExitTime = System.currentTimeMillis();
            ToastView.showShort("再按一次返回键退出应用");
        }
    }


    public void UpdateUserInfo(UpdateUserBatteryVoltsVo mUpdateUserBatteryVoltsVo) {
        Call<BaseResp<Void>> call = iCloudBusiness.updateUserInfo(mUserInfo.getBearerToken(), mUpdateUserBatteryVoltsVo);

        retrofitNetHelper.enqueueCall(call, new HRetrofitNetHelper.RetrofitCallBack<Void>() {
            @Override
            public void onSuccess(BaseResp<Void> baseResp) {

            }

            @Override
            public void onFailure(String error) {
                cancelDialog();
                ToastView.showLong(error);
            }
        });
    }
}