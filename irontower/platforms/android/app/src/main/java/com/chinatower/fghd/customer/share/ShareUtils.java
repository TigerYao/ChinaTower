package com.chinatower.fghd.customer.share;

import android.content.Context;
import android.view.Gravity;
import android.view.View;
import android.widget.RelativeLayout;

import com.chinatower.fghd.customer.R;
import com.chinatower.fghd.customer.util.PopUtils;
import com.chinatower.fghd.customer.vo.ShareMsg;

/**
 * @auther EnzoChan
 * created:2020-04-02
 * desc:分享工具类
 */
public class ShareUtils {


    public static void show(ShareMsg msg, Context context, View view) {

        PopUtils utils = new PopUtils(context, R.layout.share_popu_layout, RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT,
                view, Gravity.CENTER, 0, 0, new PopUtils.ClickListener() {
            @Override
            public void setUplistener(PopUtils.PopBuilder builder) {

            }
        }
        );

    }
}
