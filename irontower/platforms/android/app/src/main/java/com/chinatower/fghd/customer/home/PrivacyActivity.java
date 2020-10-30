package com.chinatower.fghd.customer.home;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.TextPaint;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.view.View;
import android.widget.TextView;

import com.chinatower.fghd.customer.Constant.Constant;
import com.chinatower.fghd.customer.MainActivity;
import com.chinatower.fghd.customer.R;
import com.ztesoft.baselib.base.BaseActivity;
import com.ztesoft.baselib.constant.ExtraName;
import com.ztesoft.baselib.utils.ShareManager;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

public class PrivacyActivity extends BaseActivity implements View.OnClickListener {


    public static final Integer REQUEST_CODE_PRIVACY = 1002;

    /**
     * 欢迎使用“铁塔换电”，基于对个人信息的保护，在使用前请仔细阅读《铁塔换电隐私政策》，我们将严格遵照您的意愿使用个人信息，以便为您提供更好的服务。
     */
    private TextView mTvUpdateContent;
    /**
     * 不同意
     */
    private TextView mTvUnAgree;
    /**
     * 同意
     */
    private TextView mTvAgree;

    private String phone;


    public static void startActivity(Context mContext, String phone) {
        Intent mIntent = new Intent(mContext, PrivacyActivity.class);
        mIntent.putExtra(ExtraName.KEY_DATA, phone);
        ((Activity) mContext).startActivityForResult(mIntent, REQUEST_CODE_PRIVACY);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_privacy);
        phone = getIntent().getStringExtra(ExtraName.KEY_DATA);
        initView();
    }

    private void initView() {
        mTvUpdateContent = findViewById(R.id.tv_update_content);
        mTvUnAgree = findViewById(R.id.tv_un_agree);
        mTvAgree = findViewById(R.id.tv_agree);
        mTvUpdateContent.setOnClickListener(this);
        mTvUnAgree.setOnClickListener(this);
        mTvAgree.setOnClickListener(this);
        String content = "欢迎使用“铁塔换电”，基于对个人信息的保护，在使用前请仔细阅读《铁塔换电隐私政策》，我们将严格遵照您的意愿使用个人信息，以便为您提供更好的服务。";


        int startIndex = content.indexOf("《");
        int endIndex = content.indexOf("》");

        SpannableStringBuilder spannable = new SpannableStringBuilder(content);
        //文字点击
        spannable.setSpan(new privacyClick(), startIndex, endIndex
                , Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);

        //一定要记得设置，不然点击不生效
        mTvUpdateContent.setMovementMethod(LinkMovementMethod.getInstance());
        mTvUpdateContent.setText(spannable);
    }


    private class privacyClick extends ClickableSpan {

        @Override
        public void onClick(View widget) {
            Intent mIntent = new Intent(PrivacyActivity.this, MainActivity.class);
            String url = "#/protocol?title=铁塔换电隐私政策";
            mIntent.putExtra(Constant.TRAN_DATA_KEY, url);
            startActivity(mIntent);
        }

        @Override
        public void updateDrawState(TextPaint ds) {
            ds.setColor(PrivacyActivity.this.getResources().getColor(R.color.main_theme));
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            default:
                break;
            case R.id.tv_update_content:
                break;
            case R.id.tv_un_agree:

                setResult(RESULT_OK);
                finish();

                break;
            case R.id.tv_agree:

                ShareManager.setValue(this, phone, "agree privary");
                finish();
                break;
        }
    }
}