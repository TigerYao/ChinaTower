package com.chinatower.fghd.customer.home;

import android.app.Activity;
import android.content.Context;
import android.graphics.Point;
import android.os.Bundle;
import android.os.Handler;
import android.text.TextUtils;
import android.util.Log;
import android.util.TimeUtils;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.map.BitmapDescriptor;
import com.baidu.mapapi.map.BitmapDescriptorFactory;
import com.baidu.mapapi.map.InfoWindow;
import com.baidu.mapapi.map.MapPoi;
import com.baidu.mapapi.map.MapStatus;
import com.baidu.mapapi.map.MapStatusUpdate;
import com.baidu.mapapi.map.MapStatusUpdateFactory;
import com.baidu.mapapi.map.MapView;
import com.baidu.mapapi.map.Marker;
import com.baidu.mapapi.map.MarkerOptions;
import com.baidu.mapapi.map.MyLocationConfiguration;
import com.baidu.mapapi.map.MyLocationData;
import com.baidu.mapapi.map.OverlayOptions;
import com.baidu.mapapi.map.offline.MKOfflineMap;
import com.baidu.mapapi.map.offline.MKOfflineMapListener;
import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.search.core.SearchResult;
import com.baidu.mapapi.search.route.BikingRouteLine;
import com.baidu.mapapi.search.route.BikingRoutePlanOption;
import com.baidu.mapapi.search.route.BikingRouteResult;
import com.baidu.mapapi.search.route.DrivingRouteResult;
import com.baidu.mapapi.search.route.IndoorRouteResult;
import com.baidu.mapapi.search.route.MassTransitRouteResult;
import com.baidu.mapapi.search.route.OnGetRoutePlanResultListener;
import com.baidu.mapapi.search.route.PlanNode;
import com.baidu.mapapi.search.route.RoutePlanSearch;
import com.baidu.mapapi.search.route.TransitRouteResult;
import com.baidu.mapapi.search.route.WalkingRouteResult;
import com.chinatower.fghd.customer.R;
import com.chinatower.fghd.customer.vo.home.CabinetInfo;
import com.chinatower.fghd.customer.vo.home.ServiceDetailInfo;
import com.chinatower.fghd.customer.vo.home.StationInfo;
import com.chinatower.fghd.customer.widget.CircleLayout;
import com.ztesoft.baselib.utils.DateUtil;
import com.ztesoft.baselib.utils.DisplayUtil;
import com.ztesoft.baselib.utils.ListUtils;
import com.ztesoft.baselib.utils.LogUtils;
import com.ztesoft.baselib.utils.TimeUtil;
import com.ztesoft.baselib.views.ToastView;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * @auther EnzoChan
 * created:2020/8/26
 * desc:首页地图相关
 */
public class MapHelper implements BDLocationListener, BaiduMap.OnMapStatusChangeListener, BaiduMap.OnMapClickListener, MKOfflineMapListener {

    /**
     * 覆盖物类型  换电站 = 0 服务网店=1
     */
    private static final String MARKER_TYPE = "marker_type";

    /**
     * 覆盖物携参key
     */
    private static final String MAEKER_BUNLD_DATA = "bunld_data";
    /**
     * 被电击覆盖物的索引
     */
    private static final String MAEKER_POSITION = "marker_position";

    private Context context;
    private MapView mMapView;

    private RelativeLayout mRlAddViews;
    private BaiduMap mBaiduMap;


    private static MapHelper mMapHelper;


    /**
     * 定位模式
     */
    private MyLocationConfiguration.LocationMode mCurrentMode;


    /**
     * 定位端
     */
    private LocationClient mLocClient;


    private boolean isFirst = true;

    private MyLocationData myLocationData;


    private MapHelperListener mMapHelperListener;


    private RoutePlanSearch mRoutePlanSearch;

    private Boolean isClickMarker = false;

    BikingRouteOverlay mBikingRouteOverlay;


    private MKOfflineMap mOffline;

    public void setmMapHelperListener(MapHelperListener mMapHelperListener) {
        this.mMapHelperListener = mMapHelperListener;
    }

    public static MapHelper getInstance() {
        if (mMapHelper == null) {
            mMapHelper = new MapHelper();
        }

        return mMapHelper;
    }

    public void init(MapView mMapView, Context context, RelativeLayout mRlAddViews) {
        this.mRlAddViews = mRlAddViews;
        this.mMapView = mMapView;
        this.context = context;
        initMaps();
    }


    private void initMaps() {
        //隐藏放大缩小按钮
        mMapView.showZoomControls(false);
        //隐藏logo
        View child = mMapView.getChildAt(1);

        if (child != null && (child instanceof ImageView)) {
            child.setVisibility(View.INVISIBLE);
        }

        //显示比例尺
//        mMapView.showScaleControl(true);
        mBaiduMap = mMapView.getMap();


        mBaiduMap.setOnMarkerClickListener(new BaiduMap.OnMarkerClickListener() {
            @Override
            public boolean onMarkerClick(Marker marker) {
                if (isClickMarker) {
                    mRlAddViews.removeAllViews();
                    isClickMarker = false;
                }
                if (mRoutePlanSearch != null) {
                    mBikingRouteOverlay.removeFromMap();
                    mRoutePlanSearch.destroy();
                }
                if (mInfoWindow != null) {
                    mBaiduMap.hideInfoWindow(mInfoWindow);
                }
                Bundle bundle = marker.getExtraInfo();
                if (bundle == null) {
                    return false;
                }
                int markerType = bundle.getInt(MARKER_TYPE);
                Integer position = bundle.getInt(MAEKER_POSITION);

                LatLng llEnd = null;

                if (markerType == 0) {
                    //换电站
                    isClickMarker = true;

                    List<StationInfo> stationInfoList = (List<StationInfo>) bundle.getSerializable(MAEKER_BUNLD_DATA);


                    StationInfo stationInfo = stationInfoList.get(position);

                    if (stationInfo != null && !stationInfo.getGreyFlag().equals("1")) {
                        llEnd = new LatLng(Double.parseDouble(stationInfo.getStationLatitude()),

                                Double.parseDouble(stationInfo.getStationLongitude()));
                    }
                    if (!stationInfo.getGreyFlag().equals("1")) {
                        mMapHelperListener.onStationClick(stationInfo);
                    }
//                    NetInfoPopuHelper.showStationInfo(stationInfoList,context,mRlAddViews);

                } else {
                    isClickMarker = true;
                    //服务网点
                    List<ServiceDetailInfo> bsNetworkInfoList = (List<ServiceDetailInfo>) bundle.getSerializable(MAEKER_BUNLD_DATA);

                    ServiceDetailInfo stationInfo = bsNetworkInfoList.get(position);
                    if (stationInfo != null) {
                        llEnd = new LatLng(Double.parseDouble(stationInfo.getNodeLatitude()),

                                Double.parseDouble(stationInfo.getNodeLongitude()));
                    }

                    mMapHelperListener.onNetClick(stationInfo);

                }

                if (llEnd == null) {
                    return false;
                }
                mRoutePlanSearch = RoutePlanSearch.newInstance();
                mRoutePlanSearch.setOnGetRoutePlanResultListener(new OnGetRoutePlanResultListener() {
                    @Override
                    public void onGetWalkingRouteResult(WalkingRouteResult walkingRouteResult) {

                    }

                    @Override
                    public void onGetTransitRouteResult(TransitRouteResult transitRouteResult) {

                    }

                    @Override
                    public void onGetMassTransitRouteResult(MassTransitRouteResult massTransitRouteResult) {

                    }

                    @Override
                    public void onGetDrivingRouteResult(DrivingRouteResult drivingRouteResult) {

                    }

                    @Override
                    public void onGetIndoorRouteResult(IndoorRouteResult indoorRouteResult) {

                    }

                    @Override
                    public void onGetBikingRouteResult(BikingRouteResult bikingRouteResult) {
                        if (bikingRouteResult == null || bikingRouteResult.error != SearchResult.ERRORNO.NO_ERROR) {
                            Toast.makeText(context, "路线规划失败", Toast.LENGTH_SHORT).show();
                        }
                        if (bikingRouteResult.error == SearchResult.ERRORNO.AMBIGUOUS_ROURE_ADDR) {
                            //起终点或途经点地址有岐义，通过以下接口获取建议查询信息
                            //result.getSuggestAddrInfo()
                            Toast.makeText(context, "路线规划失败", Toast.LENGTH_SHORT).show();
                            return;
                        }
                        if (bikingRouteResult.error == SearchResult.ERRORNO.ST_EN_TOO_NEAR) {
                            Toast.makeText(context, "距离太近，无需规划骑行路线", Toast.LENGTH_SHORT).show();
                            return;
                        }
                        //创建BikingRouteOverlay实例
                        mBikingRouteOverlay = new BikingRouteOverlay(mBaiduMap);
                        if (bikingRouteResult.getRouteLines() != null && bikingRouteResult.getRouteLines().size() > 0) {
                            //获取路径规划数据,(以返回的第一条路线为例）
                            BikingRouteLine mBikingRouteLine = bikingRouteResult.getRouteLines().get(0);
                            displayDistanceAndDuration(mBikingRouteLine);
                            //为BikingRouteOverlay实例设置数据
                            mBikingRouteOverlay.setData(mBikingRouteLine);
                            //在地图上绘制BikingRouteOverlay
                            mBikingRouteOverlay.addToMap();
                        }
                    }
                });

                LatLng llStart = new LatLng(myLocationData.latitude, myLocationData.longitude);

                PlanNode stNode = PlanNode.withLocation(llStart);

                PlanNode enNode = PlanNode.withLocation(llEnd);
                mRoutePlanSearch.bikingSearch((new BikingRoutePlanOption())
                        .from(stNode)
                        .to(enNode)
                        // ridingType  0 普通骑行，1 电动车骑行
                        // 默认普通骑行
                        .ridingType(1));
                return false;
            }
        });
        //定义地图状态
        MapStatus mMapStatus = new MapStatus.Builder().zoom(16).build();
        MapStatusUpdate mMapStatusUpdate = MapStatusUpdateFactory.newMapStatus(mMapStatus);
        //改变地图状态
        mBaiduMap.setMapStatus(mMapStatusUpdate);
        //地图状态改变相关监听
        mBaiduMap.setOnMapStatusChangeListener(this);
        //开启定位图层
        mBaiduMap.setMyLocationEnabled(true);

        //定位图层显示方式
        mCurrentMode = MyLocationConfiguration.LocationMode.NORMAL;
        /**
         * 设置定位图层配置信息，只有先允许定位图层后设置定位图层配置信息才会生效
         * customMarker用户自定义定位图标
         * enableDirection是否允许显示方向信息
         * locationMode定位图层显示方式
         */
        mBaiduMap.setMyLocationConfigeration(new MyLocationConfiguration(mCurrentMode, true, null));
        //初始化定位
        mLocClient = new LocationClient(context);
        //注册定位监听
        mLocClient.registerLocationListener(this);
        //定位选项
        LocationClientOption option = new LocationClientOption();
        /**
         * coorType - 取值有3个：
         * 返回国测局经纬度坐标系：gcj02
         * 返回百度墨卡托坐标系 ：bd09
         * 返回百度经纬度坐标系 ：bd09ll
         */
        option.setCoorType("bd09ll");
        //设置是否需要地址信息，默认为无地址
        option.setIsNeedAddress(true);
        //设置是否需要返回位置语义化信息，可以在BDLocation.getLocationDescribe()中得到数据，ex:"在天安门附近"， 可以用作地址信息的补充
        option.setIsNeedLocationDescribe(true);
        //设置是否需要返回位置POI信息，可以在BDLocation.getPoiList()中得到数据
        option.setIsNeedLocationPoiList(true);
        /**
         * 设置定位模式
         * Battery_Saving
         * 低功耗模式
         * Device_Sensors
         * 仅设备(Gps)模式
         * Hight_Accuracy
         * 高精度模式
         */
        option.setLocationMode(LocationClientOption.LocationMode.Battery_Saving);
        //设置是否打开gps进行定位
        option.setOpenGps(true);
        //设置扫描间隔，单位是毫秒 当<1000(1s)时，定时定位无效
        option.setScanSpan(0);
        //离线地图
        mOffline = new MKOfflineMap();
        mOffline.init(this);
        //设置地图单击事件监听
        mBaiduMap.setOnMapClickListener(this);

        //设置 LocationClientOption
        mLocClient.setLocOption(option);
        //开始定位
        mLocClient.start();
    }

    InfoWindow mInfoWindow;

    private void displayDistanceAndDuration(BikingRouteLine mBikingRouteLine) {

        Integer distance = mBikingRouteLine.getDistance();
        Integer duration = mBikingRouteLine.getDuration();
        StringBuffer content = new StringBuffer();
        if (distance > 1000) {
            content.append(distance / 1000);
            content.append("公里");

        } else {
            content.append(distance);
            content.append("米");
        }


        content.append("  ");
        long days = duration / (60 * 60 * 24);
        long hours = (duration - days * (60 * 60 * 24)) / (60 * 60);
        long minutes = (duration - days * (60 * 60 * 24) - hours * (60 * 60)) / (60);

        if (days > 0) {
            content.append(days + "天" + hours + "小时" + minutes + "分钟");
        } else if (hours > 0) {
            content.append(hours + "小时" + minutes + "分钟");
        } else {
            content.append(minutes + "分钟");
        }
        View view = LayoutInflater.from(context).inflate(R.layout.localtion_tip_layout, null);


        TextView textView = view.findViewById(R.id.tv_info);
        textView.setText(content);
        //将marker所在的经纬度的信息转化成屏幕上的坐标

        final LatLng ll = mBikingRouteLine.getTerminal().getLocation();

        Point p = mBaiduMap.getProjection().toScreenLocation(ll);
        p.y -= 150;
        LatLng llInfo = mBaiduMap.getProjection().fromScreenLocation(p);
        //为弹出的InfoWindow添加点击事件
        mInfoWindow = new InfoWindow(view, llInfo, 1);
        //显示InfoWindow
        mBaiduMap.showInfoWindow(mInfoWindow);

    }

    @Override
    public void onReceiveLocation(BDLocation bdLocation) {
        //如果bdLocation为空或mapView销毁后不再处理新数据接收的位置
        if (bdLocation == null || mBaiduMap == null) {
            Toast.makeText(context, "定位失败，请打开GPS和WI-FI网络！", Toast.LENGTH_SHORT).show();
            mLocClient.stop();
            mBaiduMap.setMyLocationEnabled(false);
            mMapView.onDestroy();
            mMapView = null;
            return;
        } else if (bdLocation.getLocType() == 62 || bdLocation.getLocType() == 167) {


            return;
        }

        LogUtils.d("ckf", "设置定位数据" + isFirst);

        //是否是第一次定位
        if (isFirst) {
            isFirst = false;
            LatLng ll = new LatLng(bdLocation.getLatitude(), bdLocation.getLongitude());
            MapStatusUpdate msu = MapStatusUpdateFactory.newLatLngZoom(ll, 16);
            mBaiduMap.animateMapStatus(msu);

//            //创建GeoCoder实例对象
//            geoCoder = GeoCoder.newInstance();
//            //发起反地理编码请求(经纬度->地址信息)
//            ReverseGeoCodeOption reverseGeoCodeOption = new ReverseGeoCodeOption();
//            //设置反地理编码位置坐标
//            reverseGeoCodeOption.location(new LatLng(bdLocation.getLatitude(), bdLocation.getLongitude()));
//            geoCoder.reverseGeoCode(reverseGeoCodeOption);
//
//            //设置查询结果监听者
//            geoCoder.setOnGetGeoCodeResultListener(this);
            //定位数据
            myLocationData = new MyLocationData.Builder()
                    //定位精度bdLocation.getRadius()
                    .accuracy(bdLocation.getRadius())
                    //此处设置开发者获取到的方向信息，顺时针0-360
                    .direction(bdLocation.getDirection())
                    //经度
                    .latitude(bdLocation.getLatitude())
                    //纬度
                    .longitude(bdLocation.getLongitude())
                    //构建
                    .build();


            //设置定位数据
            mBaiduMap.setMyLocationData(myLocationData);
            // 开始下载离线地图，传入参数为cityID, cityID表示城市的数字标识。

            //mOffline.start(Integer.parseInt(bdLocation.getCityCode()));

        }

    }

    /**
     * 手势操作地图，设置地图状态等操作导致地图状态开始改变。
     *
     * @param mapStatus 地图状态改变开始时的地图状态
     */


    @Override
    public void onMapStatusChangeStart(MapStatus mapStatus) {

    }

    /**
     * 手势操作地图，设置地图状态等操作导致地图状态开始改变。
     *
     * @param mapStatus 地图状态改变开始时的地图状态
     * @param reason    地图状态改变的原因
     */

    //用户手势触发导致的地图状态改变,比如双击、拖拽、滑动底图
    //int REASON_GESTURE = 1;
    //SDK导致的地图状态改变, 比如点击缩放控件、指南针图标
    //int REASON_API_ANIMATION = 2;
    //开发者调用,导致的地图状态改变
    //int REASON_DEVELOPER_ANIMATION = 3;
    @Override
    public void onMapStatusChangeStart(MapStatus mapStatus, int reason) {

        if (isClickMarker) {
            mRlAddViews.removeAllViews();
            isClickMarker = false;
        }
        if (mRoutePlanSearch != null) {
            mBikingRouteOverlay.removeFromMap();
            mRoutePlanSearch.destroy();
        }

        if (mInfoWindow != null) {
            mBaiduMap.hideInfoWindow(mInfoWindow);
        }

    }


    /**
     * 地图状态变化中
     *
     * @param mapStatus 当前地图状态
     */
    @Override
    public void onMapStatusChange(MapStatus mapStatus) {

    }

    /**
     * 地图状态改变结束
     *
     * @param mapStatus 地图状态改变结束后的地图状态
     */
    @Override
    public void onMapStatusChangeFinish(MapStatus mapStatus) {
        //比例尺
//        mMapView.setScaleControlPosition(new Point(100,100));
        if (mMapHelperListener != null) {
            mMapHelperListener.onMapStatusChangeFinish(mapStatus);
        }

    }

    @Override
    public void onMapClick(LatLng latLng) {
        if (isClickMarker) {
            mRlAddViews.removeAllViews();
            isClickMarker = false;
        }
        if (mRoutePlanSearch != null) {
            mBikingRouteOverlay.removeFromMap();
            mRoutePlanSearch.destroy();
        }
        if (mInfoWindow != null) {
            mBaiduMap.hideInfoWindow(mInfoWindow);
        }
    }

    @Override
    public void onMapPoiClick(MapPoi mapPoi) {

    }

    /**
     * 离线下载监听
     *
     * @param i
     * @param i1
     */
    @Override
    public void onGetOfflineMapState(int i, int i1) {
        Log.d("ckf", "i== " + i + "  i1=== " + i1);
    }


    public interface MapHelperListener {
        void onReceiveLocation(BDLocation bdLocation);

        void onMapStatusChangeFinish(MapStatus mapStatus);

        void onStationClick(StationInfo stationInfo);

        void onNetClick(ServiceDetailInfo stationInfo);
    }

    public void zoomOut() {
        mBaiduMap.setMapStatus(MapStatusUpdateFactory.zoomOut());
    }

    public void zoomIn() {
        mBaiduMap.setMapStatus(MapStatusUpdateFactory.zoomIn());
    }

    public LatLng backCurrentLocation() {
        if (myLocationData == null) {
            return null;
        }
        LatLng ll = new LatLng(myLocationData.latitude, myLocationData.longitude);
        MapStatusUpdate msu = MapStatusUpdateFactory.newLatLngZoom(ll, 16);
        mBaiduMap.animateMapStatus(msu);
        return ll;
    }

    public void onDestroy() {

        //退出时停止定位
        isFirst = true;
        mLocClient.stop();
        //退出时关闭定位图层
        mBaiduMap.setMyLocationEnabled(false);

        // activity 销毁时同时销毁地图控件
        if (mMapView != null) {
            mMapView.onDestroy();
        }

        //释放资源
//        if (geoCoder != null) {
//            geoCoder.destroy();
//        }

        mMapView = null;
    }


    public void markerStation(List<StationInfo> stationInfoList) {
        mBaiduMap.clear();
        if (ListUtils.isEmpty(stationInfoList)) {
            return;
        }
        for (int i = 0; i < stationInfoList.size(); i++) {
            StationInfo stationInfo = stationInfoList.get(i);
            View view = LayoutInflater.from(context).inflate(R.layout.marker_station_layout, null);

//            CircleLayout circleLayout = view.findViewById(R.id.cl_root);
            TextView mTv1 = view.findViewById(R.id.tv_1);
            TextView mTv2 = view.findViewById(R.id.tv_2);
            TextView mTv3 = view.findViewById(R.id.tv_3);
            TextView mTv4 = view.findViewById(R.id.tv_4);
            TextView mTv5 = view.findViewById(R.id.tv_5);
            TextView mTv6 = view.findViewById(R.id.tv_6);
            RelativeLayout mRlBack = view.findViewById(R.id.rl_back);
            LatLng point = null;

            point = new LatLng(Double.parseDouble(stationInfo.getStationLatitude())
                    , Double.parseDouble(stationInfo.getStationLongitude()));   //横纵坐标值

            if (stationInfo.getGreyFlag().equals("1")) {
                mRlBack.setBackground(context.getResources().getDrawable(R.mipmap.station_marker_back_gray));
            } else {
                mRlBack.setBackground(context.getResources().getDrawable(R.mipmap.station_marker_back));


                for (int j = 0; j < stationInfo.getBsCabinetResponseList().size(); j++) {
                    CabinetInfo cabinetInfo = stationInfo.getBsCabinetResponseList().get(j);

                    if (!TextUtils.isEmpty(cabinetInfo.getFullCount())) {
                        if (j == 0) {
                            mTv1.setVisibility(View.VISIBLE);
                            mTv1.setText(cabinetInfo.getFullCount());
                        } else if (j == 1) {
                            mTv2.setVisibility(View.VISIBLE);
                            mTv2.setText(cabinetInfo.getFullCount());
                        } else if ((j == 2)) {
                            mTv3.setText(cabinetInfo.getFullCount());
                            mTv3.setVisibility(View.VISIBLE);
                        } else if (j == 3) {
                            mTv4.setText(cabinetInfo.getFullCount());
                            mTv4.setVisibility(View.VISIBLE);
                        } else if (j == 4) {
                            mTv5.setText(cabinetInfo.getFullCount());
                            mTv5.setVisibility(View.VISIBLE);
                        } else if (j == 5) {
                            mTv6.setVisibility(View.VISIBLE);
                            mTv6.setText(cabinetInfo.getFullCount());
                        }
                    }
                }
            }


            //构建Marker图标
            BitmapDescriptor bitmapDescriptor = BitmapDescriptorFactory.fromView(view);
            //构建MarkerOption，用于在地图上添加Marker
            MarkerOptions optionPosition = new MarkerOptions()
                    .position(point)
                    .icon(bitmapDescriptor);
            //在地图上添加Marker，并显示
            Marker marker = (Marker) mBaiduMap.addOverlay(optionPosition);
            //使用marker携带info信息，当点击事件的时候可以通过marker获得info信息
            Bundle bundle = new Bundle();
            bundle.putInt(MARKER_TYPE, 0);
            bundle.putInt(MAEKER_POSITION, i);
            //info必须实现序列化接口
            bundle.putSerializable(MAEKER_BUNLD_DATA, (Serializable) stationInfoList);
            marker.setExtraInfo(bundle);
        }


    }


    public void markerService(List<ServiceDetailInfo> bsNetworkInfoList) {
        mBaiduMap.clear();
        if (ListUtils.isEmpty(bsNetworkInfoList)) {
            return;
        }

        for (int i = 0; i < bsNetworkInfoList.size(); i++) {
            ServiceDetailInfo serviceDetailInfo = bsNetworkInfoList.get(i);
            //定义Maker坐标点
            LatLng point = new LatLng(Double.parseDouble(serviceDetailInfo.getNodeLatitude())
                    , Double.parseDouble(serviceDetailInfo.getNodeLongitude()));
            //构建Marker图标
            BitmapDescriptor bitmap = BitmapDescriptorFactory
                    .fromResource(R.mipmap.marker_service_icon);
            //构建MarkerOption，用于在地图上添加Marker
            OverlayOptions option = new MarkerOptions()
                    .position(point)
                    .icon(bitmap);
            //在地图上添加Marker，并显示
            Marker marker = (Marker) mBaiduMap.addOverlay(option);
            //使用marker携带info信息，当点击事件的时候可以通过marker获得info信息
            Bundle bundle = new Bundle();
            bundle.putInt(MARKER_TYPE, 1);
            bundle.putInt(MAEKER_POSITION, i);
            //info必须实现序列化接口
            bundle.putSerializable(MAEKER_BUNLD_DATA, (Serializable) bsNetworkInfoList);
            marker.setExtraInfo(bundle);
        }

    }

    /**
     * 清除
     */
    public void clearAllMarker() {
        mBaiduMap.clear();
    }


    public void clearbikingRoute() {
        if (isClickMarker) {
            mRlAddViews.removeAllViews();
            isClickMarker = false;
            mBaiduMap.clear();
        }
        if (mRoutePlanSearch != null) {
            mBikingRouteOverlay.removeFromMap();
            mRoutePlanSearch.destroy();
        }
        if (mInfoWindow != null) {
            mBaiduMap.hideInfoWindow(mInfoWindow);
        }
    }


}
