package com.ztesoft.baselib.views;

import android.widget.Button;

import com.ztesoft.baselib.R;
import com.ztesoft.baselib.utils.AdornTimer;


/**
 * Created by MMF on 2016/6/10.
 */
public class SendCodePourDown {
    private Button sendCode;
    private AdornTimer timer;
    public SendCodePourDown(Button sendCode){
        this.sendCode = sendCode;
    }

    public void setBtnEnabled(boolean enabled){
        sendCode.setEnabled(enabled);
        if (enabled) {
            if (timer != null) {
                timer.cancel();
                timer = null;
            }
//            sendCode.setBackgroundResource(R.drawable.rectangle_round_red_bg);
            sendCode.setText("获取验证码");
        } else {
//            sendCode.setBackgroundResource(R.drawable.rectangle_round_btn_disable_right);
            if (timer != null) {
                timer.cancel();
                timer = null;
            }
            timer = new AdornTimer(60);
            timer.start();
            timer.setTimerListener(new AdornTimer.ITimerListener() {
                @Override
                public void onFinish() {
                    setBtnEnabled(true);
                    if (timer != null) {
                        timer.cancel();
                        timer = null;
                    }
                }

                @Override
                public void onTick(long seconds) {
                    sendCode.setText(seconds + "s");
                }
            });
        }
    }
    public void closeTimer(){
        if (timer != null) {
            timer.cancel();
        }
    }
}
