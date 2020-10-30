package com.chinatower.fghd.customer.location;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.widget.Toast;

import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.utils.CoordinateConverter;

import java.io.File;

import static com.baidu.mapapi.utils.CoordinateConverter.CoordType.BD09LL;
import static com.baidu.mapapi.utils.CoordinateConverter.CoordType.BD09MC;

/**
 * @auther EnzoChan
 * created:2020-03-31
 * desc:
 */
public class LocationUtils {

    //https://lbsyun.baidu.com/index.php?title=uri/api/android
    public static void openBaiduMap(Context context, String lat, String lon, double myLat, double myLon, String name, String region, String mode, String addr) {
        try {
            StringBuilder loc = new StringBuilder();
//            "baidumap://map/direction?region=beijing&origin=39.98871,116.43234&destination=西直门&coord_type=bd09ll&mode=driving&src=andr.baidu.openAPIdemo"
            loc.append("baidumap://map/direction?region=" + region + "&origin=");
            loc.append("name:我的位置|latlng:" + myLat + "," + myLon);
            loc.append("&destination=");
            loc.append("name:" + name + "|latlng:" + lat + "," + lon + "|addr:" + addr);
            loc.append("&riding_type=1");
            loc.append("&coord_type=bd09ll&mode=");
            loc.append(mode);
            loc.append("&src=andr.baidu.openAPIdemo");
            Intent intent = Intent.getIntent(loc.toString());
            if (isInstallPackage("com.baidu.BaiduMap")) {
                context.startActivity(intent); //启动调用
                Log.e("GasStation", "百度地图客户端已经安装");
            } else {
                //没有安装
                Toast.makeText(context, "请先安装百度地图", Toast.LENGTH_LONG).show();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //https://lbs.amap.com/api/amap-mobile/guide/android/route
    public static void openGaoDeMap(Context context, double lon, double lat, String title, String describle, String mode) {
        try {
            double[] gd_lat_lon = bdToGaoDe(lon, lat);
            StringBuilder builder = new StringBuilder("amapuri://route/plan?sourceApplication=铁塔换电");
            builder.append("&poiname=").append(title)
                    .append("&dlat=").append(gd_lat_lon[0])
                    .append("&dlon=").append(gd_lat_lon[1])
                    .append("&dname=").append(title)
                    .append("&dev=0")
                    .append("&rideType=elebike")
                    .append("&t=3");


            Log.d("ckf", "导航路径----->" + builder.toString());
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setPackage("com.autonavi.minimap");
            intent.addCategory("android.intent.category.DEFAULT");
            intent.setData(Uri.parse(builder.toString()));
            context.startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static boolean isInstallPackage(String packageName) {
        return new File("/data/data/" + packageName).exists();
    }


    private static double[] bdToGaoDe(double bd_lat, double bd_lon) {
        double[] gd_lat_lon = new double[2];
        double PI = 3.14159265358979324 * 3000.0 / 180.0;
        double x = bd_lon - 0.0065, y = bd_lat - 0.006;
        double z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * PI);
        double theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * PI);
        gd_lat_lon[0] = z * Math.cos(theta);
        gd_lat_lon[1] = z * Math.sin(theta);
        return gd_lat_lon;
    }



    //高德到百度
    private static double[] gaoDeToBaidu(double gd_lon, double gd_lat) {
        double[] bd_lat_lon = new double[2];
        double PI = 3.14159265358979324 * 3000.0 / 180.0;
        double x = gd_lon, y = gd_lat;
        double z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * PI);
        double theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * PI);
        bd_lat_lon[0] = z * Math.cos(theta) + 0.0065;
        bd_lat_lon[1] = z * Math.sin(theta) + 0.006;
        return bd_lat_lon;
    }
}
