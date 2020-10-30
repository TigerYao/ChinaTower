package com.chinatower.tthd.jpush.receiver;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.content.res.AssetFileDescriptor;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.util.Log;

import com.chinatower.fghd.customer.Constant.Constant;
import com.chinatower.fghd.customer.MainActivity;
import com.chinatower.fghd.customer.vo.JpushTypeBean;
import com.google.gson.Gson;
import com.ztesoft.baselib.utils.ShareManager;

import org.apache.cordova.h5Bridge.H5bridge;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import cn.jpush.android.api.CmdMessage;
import cn.jpush.android.api.CustomMessage;
import cn.jpush.android.api.JPushInterface;
import cn.jpush.android.api.JPushMessage;
import cn.jpush.android.api.NotificationMessage;
import cn.jpush.android.service.JPushMessageReceiver;

public class PushMessageReceiver extends JPushMessageReceiver {
    private static final String TAG = "jiguang";

    @Override
    public void onMessage(Context context, CustomMessage customMessage) {
        Log.e(TAG, "[onMessage] " + customMessage);
        processCustomMessage(context, customMessage);
    }

    @Override
    public void onNotifyMessageOpened(Context context, NotificationMessage message) {
        Log.e(TAG, "[onNotifyMessageOpened] " + message);
        try {
            Gson mGson = new Gson();
            JpushTypeBean jpushTypeBean = mGson.fromJson(message.notificationExtras, JpushTypeBean.class);

            String type = jpushTypeBean.getType();
            if (type.equals("1") || type.equals("0")) {
                startWeb(context, "#/myWallet/tradingDetail");
            } else if (type.equals("2")) {

            } else if (type.equals("3") || type.equals("4")) {
                startWeb(context, "#/myWallet");
            } else if (type.equals("501")) {
                startWeb(context, "#/news/messageDetail?newsType=0&title=通知公告&type=" + type + "&noticeId=" + jpushTypeBean.getNoticeId());
            } else if (type.equals("502")) {
                startWeb(context, "#/news/messageDetail?newsType=2&title=活动消息&type=" + type + "&noticeId=" + jpushTypeBean.getNoticeId());
            }
        } catch (Throwable throwable) {

        }
    }

    public void startWeb(Context context, String url) {
        Intent mIntent = new Intent(context, MainActivity.class);
        mIntent.putExtra(Constant.TRAN_DATA_KEY, url);
        mIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(mIntent);
    }

    @Override
    public void onMultiActionClicked(Context context, Intent intent) {
        Log.e(TAG, "[onMultiActionClicked] 用户点击了通知栏按钮");
        String nActionExtra = intent.getExtras().getString(JPushInterface.EXTRA_NOTIFICATION_ACTION_EXTRA);

        //开发者根据不同 Action 携带的 extra 字段来分配不同的动作。
        if (nActionExtra == null) {
            Log.d(TAG, "ACTION_NOTIFICATION_CLICK_ACTION nActionExtra is null");
            return;
        }
        if (nActionExtra.equals("my_extra1")) {
            Log.e(TAG, "[onMultiActionClicked] 用户点击通知栏按钮一");
        } else if (nActionExtra.equals("my_extra2")) {
            Log.e(TAG, "[onMultiActionClicked] 用户点击通知栏按钮二");
        } else if (nActionExtra.equals("my_extra3")) {
            Log.e(TAG, "[onMultiActionClicked] 用户点击通知栏按钮三");
        } else {
            Log.e(TAG, "[onMultiActionClicked] 用户点击通知栏按钮未定义");
        }
    }

    @Override
    public void onNotifyMessageArrived(Context context, NotificationMessage message) {
        Log.e(TAG, "[onNotifyMessageArrived] " + message);

        /**
         * JpushTypeBean
         * type
         * 0 支付消息
         * 1 退款消息
         * 2 电池信息
         * 3 订单到期消息
         * 4 逾期消息
         * 501 系统消息 502 活动消息
         * 5 501 502 -》获取系统消息
         *
         */
        Gson mGson = new Gson();
        JpushTypeBean jpushTypeBean = mGson.fromJson(message.notificationExtras, JpushTypeBean.class);

        if (jpushTypeBean.getType().equals("2")) {
            //播放语音
            playMUsic(context);
            //关闭通知栏提示
//            Integer notificationId = message.notificationId;
//            JPushInterface.clearNotificationById(context, notificationId);

        } else if (jpushTypeBean.getType().startsWith("5")) {

            //保存对象，点击到webView时操作内存

            Set<String> noticeSets = ShareManager.getSetValue(context, Constant.NOTICE_INFO_KEY);
            if (noticeSets == null) {
                noticeSets = new HashSet<>();
            }
            noticeSets.add(jpushTypeBean.getNoticeId());
            ShareManager.setSetValues(context, Constant.NOTICE_INFO_KEY, noticeSets);


//            Intent broadcastIntent = new Intent();
//            broadcastIntent.setAction(H5bridge.JPUSH_DATA_ACTION);
//            broadcastIntent.putExtra("data", jpushTypeBean);
//            context.sendBroadcast(broadcastIntent);


            //传递给h5
        } else {
            //传给前端
//            Intent broadcastIntent = new Intent();
//            broadcastIntent.setAction(H5bridge.JPUSH_ACTION);
//            broadcastIntent.putExtra("data", jpushTypeBean.getType());
//            context.sendBroadcast(broadcastIntent);
        }


    }

    public void playMUsic(Context context) {
        try {
            //播放 assets/a2.mp3 音乐文件
            AssetFileDescriptor fd = context.getAssets().openFd("ele.m4a");
            MediaPlayer mediaPlayer = new MediaPlayer();
            mediaPlayer.setDataSource(fd.getFileDescriptor(), fd.getStartOffset(), fd.getLength());
            mediaPlayer.prepare();
            mediaPlayer.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onNotifyMessageDismiss(Context context, NotificationMessage message) {
        Log.e(TAG, "[onNotifyMessageDismiss] " + message);
    }

    @Override
    public void onRegister(Context context, String registrationId) {
        Log.e(TAG, "[onRegister] " + registrationId);
    }

    @Override
    public void onConnected(Context context, boolean isConnected) {
        Log.e(TAG, "[onConnected] " + isConnected);
    }

    @Override
    public void onCommandResult(Context context, CmdMessage cmdMessage) {
        Log.e(TAG, "[onCommandResult] " + cmdMessage);
    }

    @Override
    public void onTagOperatorResult(Context context, JPushMessage jPushMessage) {
//        TagAliasOperatorHelper.getInstance().onTagOperatorResult(context,jPushMessage);
        super.onTagOperatorResult(context, jPushMessage);
    }

    @Override
    public void onCheckTagOperatorResult(Context context, JPushMessage jPushMessage) {
//        TagAliasOperatorHelper.getInstance().onCheckTagOperatorResult(context,jPushMessage);
        super.onCheckTagOperatorResult(context, jPushMessage);
    }

    @Override
    public void onAliasOperatorResult(Context context, JPushMessage jPushMessage) {
//        TagAliasOperatorHelper.getInstance().onAliasOperatorResult(context,jPushMessage);
        super.onAliasOperatorResult(context, jPushMessage);
    }

    @Override
    public void onMobileNumberOperatorResult(Context context, JPushMessage jPushMessage) {
//        TagAliasOperatorHelper.getInstance().onMobileNumberOperatorResult(context,jPushMessage);
        super.onMobileNumberOperatorResult(context, jPushMessage);
    }

    //send msg to MainActivity
    private void processCustomMessage(Context context, CustomMessage customMessage) {
//        if (MainActivity.isForeground) {
//            String message = customMessage.message;
//            String extras = customMessage.extra;
//            Intent msgIntent = new Intent(MainActivity.MESSAGE_RECEIVED_ACTION);
//            msgIntent.putExtra(MainActivity.KEY_MESSAGE, message);
//            if (!ExampleUtil.isEmpty(extras)) {
//                try {
//                    JSONObject extraJson = new JSONObject(extras);
//                    if (extraJson.length() > 0) {
//                        msgIntent.putExtra(MainActivity.KEY_EXTRAS, extras);
//                    }
//                } catch (JSONException e) {
//
//                }
//
//            }
//            LocalBroadcastManager.getInstance(context).sendBroadcast(msgIntent);
//        }
    }

    @Override
    public void onNotificationSettingsCheck(Context context, boolean isOn, int source) {
        super.onNotificationSettingsCheck(context, isOn, source);
        Log.e(TAG, "[onNotificationSettingsCheck] isOn:" + isOn + ",source:" + source);
    }


    /**
     * 获得栈中最顶层的Activity
     *
     * @param context
     * @return
     */
    public static String getTopActivity(Context context) {
        android.app.ActivityManager manager = (android.app.ActivityManager) context.getSystemService(context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningTaskInfo> runningTaskInfos = manager.getRunningTasks(1);

        if (runningTaskInfos != null) {
            return (runningTaskInfos.get(0).topActivity).toString();
        } else
            return null;
    }
}
