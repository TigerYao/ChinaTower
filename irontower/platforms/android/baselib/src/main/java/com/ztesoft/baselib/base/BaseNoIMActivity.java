package com.ztesoft.baselib.base;

import android.os.Bundle;
import android.view.WindowManager;

/**
 * @author EnzoChan
 * @create 2019/8/12
 * @desc: 屏蔽输入法，防止二维码扫描界面出现空白
 */
public class BaseNoIMActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM,
                WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM);
//        onCreateStarted(savedInstanceState);
    }


}
