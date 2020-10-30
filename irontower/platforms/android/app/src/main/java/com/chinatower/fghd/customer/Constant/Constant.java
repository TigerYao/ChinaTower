package com.chinatower.fghd.customer.Constant;

//import com.baidu.idl.face.platform.LivenessTypeEnum;

/**
 * @auther EnzoChan
 * created:2020/5/26
 * desc:
 */
public class Constant {
    public static final String SDCARD_DOWNLOAD_PATH = android.os.Environment.getExternalStorageDirectory().getAbsolutePath()
            + "/GangWeiZhuShou/download/";

    public static final String TRAN_DATA_KEY = "tran_data_key";

//    public static String licenseID = "exchange-face-android";
//    public static String licenseFileName = "idl-license.face-android";

//    public static LivenessTypeEnum[] LIVENESSLIST = {
//            LivenessTypeEnum.Eye,
//            LivenessTypeEnum.Mouth,
//            LivenessTypeEnum.HeadUp,
//            LivenessTypeEnum.HeadDown,
//            LivenessTypeEnum.HeadLeft,
//            LivenessTypeEnum.HeadRight,
//            LivenessTypeEnum.HeadLeftOrRight
//    };

    public static boolean IS_LIVENESS_RANDOM = false;
    public static String USER_INFO = "user_info";
    public static String USER_DETAIL_INFO = "user_detail_info";
    public static String LAST_LATLNG = "last_LatLng";
    public static String NOTICE_INFO_KEY = "noticeInfo";



    public static final String SERVICE_URL = "http://im5.7x24cc.com/phone_webChat.html?accountId=N000000022137&chatId=914da534-d51f-4427-8e91-86783578d435&phone=";



}
