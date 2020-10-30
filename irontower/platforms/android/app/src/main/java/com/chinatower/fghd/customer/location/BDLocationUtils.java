package com.chinatower.fghd.customer.location;

import android.content.Context;
import android.util.Log;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;

/**
 * @auther EnzoChan
 * created:2020-04-08
 * desc:
 */
public class BDLocationUtils {
    private final static boolean DEBUG = true;
    private final static String TAG = "BDLocationUtils";
    private static BDLocationUtils mInstance;
    private BDLocation mLocation = null;
    private MLocation mBaseLocation = new MLocation();

    public static ILocationListener mLocationListener;


    public static BDLocationUtils getInstance(Context context) {
        if (mInstance == null) {
            mInstance = new BDLocationUtils(context);
        }
        return mInstance;
    }

    Context mContext;
    String mProvider;
    public BDLocationListener myListener = new MyLocationListener();
    private LocationClient mLocationClient;

    public BDLocationUtils(Context context) {
        mLocationClient = new LocationClient(context.getApplicationContext());
        initParams();
        mLocationClient.registerLocationListener(myListener);
    }

    public void startMonitor() {
        if (DEBUG) Log.d(TAG, "start monitor location " + mLocationClient.isStarted());
        if (!mLocationClient.isStarted()) {
            mLocationClient.restart();
        }
        if (mLocationClient != null && mLocationClient.isStarted()) {
            mLocationClient.requestLocation();
        } else {
            Log.d("LocSDK3", "locClient is null or not started");
        }
    }

    public void stopMonitor() {
        if (DEBUG) Log.d(TAG, "stop monitor location");
        if (mLocationClient != null && mLocationClient.isStarted()) {
            mLocationClient.stop();
        }
    }

    public BDLocation getLocation() {
        if (DEBUG) Log.d(TAG, "get location");
        return mLocation;
    }

    public MLocation getBaseLocation() {
        if (DEBUG) Log.d(TAG, "get location");
        return mBaseLocation;
    }

    private void initParams() {
        LocationClientOption option = new LocationClientOption();
        option.setOpenGps(true);
        //option.setPriority(LocationClientOption.NetWorkFirst);
        option.setAddrType("all");//返回的定位结果包含地址信息
        option.setCoorType("bd09ll");//返回的定位结果是百度经纬度,默认值gcj02
        option.setScanSpan(0);//设置发起定位请求的间隔时间为5000ms
        option.setOpenGps(true);
        option.setLocationNotify(true);


        option.disableCache(true);//禁止启用缓存定位
//        option.setPoiNumber(5);    //最多返回POI个数
//        option.setPoiDistance(1000); //poi查询距离
//        option.setPoiExtraInfo(true); //是否需要POI的电话和地址等详细信息
        mLocationClient.setLocOption(option);
    }

    public class MyLocationListener implements BDLocationListener {
        @Override
        public void onReceiveLocation(BDLocation location) {

            Log.d(TAG, "onReceiveLocation");

            if (location == null) {
                mLocationListener.onErrorLocation("定位失败");
                return;
            }

            Log.d(TAG, "result code ---->" + location.getLocType());
            if (mLocationListener != null) {
                mLocationListener.onSuccessLocation(location);
            }
            mLocation = location;
            mBaseLocation.latitude = mLocation.getLatitude();
            mBaseLocation.longitude = mLocation.getLongitude();
            StringBuffer sb = new StringBuffer(256);
            sb.append("time : ");
            sb.append(location.getTime());
            sb.append("\nerror code : ");
            sb.append(location.getLocType());
            sb.append("\nlatitude : ");
            sb.append(location.getLatitude());
            sb.append("\nlontitude : ");
            sb.append(location.getLongitude());
            sb.append("\nradius : ");
            sb.append(location.getRadius());
            sb.append("\ncity : ");
            sb.append(location.getCity());
            if (location.getLocType() == BDLocation.TypeGpsLocation) {
                sb.append("\nspeed : ");
                sb.append(location.getSpeed());
                sb.append("\nsatellite : ");
                sb.append(location.getSatelliteNumber());
            } else if (location.getLocType() == BDLocation.TypeNetWorkLocation) {
                sb.append("\naddr : ");
                sb.append(location.getAddrStr());
            }
            if (DEBUG) Log.d(TAG, "" + sb);
            stopMonitor();
        }

        public void onReceivePoi(BDLocation poiLocation) {
        }
    }

    public class MLocation {
        public double latitude;
        public double longitude;
    }

    /**
     * 自定义接口
     */
    public interface ILocationListener {
        void onSuccessLocation(BDLocation location);

        void onErrorLocation(String errorMsg);
    }

    public void setLocationListener(ILocationListener mLocationListener) {
        BDLocationUtils.mLocationListener = mLocationListener;
    }
}
