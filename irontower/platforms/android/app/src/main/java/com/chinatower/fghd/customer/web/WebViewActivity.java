package com.chinatower.fghd.customer.web;

import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.chinatower.fghd.customer.R;
import com.chinatower.fghd.customer.vo.WebBean;
import com.tencent.smtt.export.external.interfaces.PermissionRequest;
import com.tencent.smtt.sdk.QbSdk;
import com.tencent.smtt.sdk.TbsReaderView;
import com.tencent.smtt.sdk.ValueCallback;
import com.tencent.smtt.sdk.WebChromeClient;
import com.tencent.smtt.sdk.WebSettings;
import com.tencent.smtt.sdk.WebView;
import com.tencent.smtt.sdk.WebViewClient;

import java.util.HashMap;


public class WebViewActivity extends Activity implements View.OnClickListener {
    public static final String KEY_DATA = "data";
    /**
     * 关闭
     */
    private TextView mBtnClose;
    private X5WebView mWebview;
    private ImageView mIvBack;
    private TextView mTvTitle;
    private RelativeLayout mRlTitle;

    private WebBean mWebBean;

    public static void startActivity(Context context, WebBean mWebBean) {
        Intent mIntent = new Intent(context, WebViewActivity.class);
        mIntent.putExtra(KEY_DATA, mWebBean);
        context.startActivity(mIntent);
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_web_view);
        initView();
        mWebBean = (WebBean) getIntent().getSerializableExtra(KEY_DATA);

        if (mWebBean != null && mWebBean.getTitle() != null) {
            mTvTitle.setText(mWebBean.getTitle());
        } else {
            mRlTitle.setVisibility(View.GONE);
        }

        mWebview.loadUrl(mWebBean.getUrl());
    }

    private void initWebViewSetting() {
        //系统默认会通过手机浏览器打开网页，为了能够直接通过WebView显示网页，则必须设置
        mWebview.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                //使用WebView加载显示url
                view.loadUrl(url);
                //返回true
                return true;
            }
        });
        mWebview.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
//                if (newProgress == 100) {
//                    cancelDialog();
//                } else {
//                    showDialog();
//                }

            }

            @TargetApi(Build.VERSION_CODES.LOLLIPOP)
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                request.grant(request.getResources());
            }
        });

        //声明WebSettings子类
        WebSettings webSettings = mWebview.getSettings();
        //如果访问的页面中要与Javascript交互，则webview必须设置支持Javascript
        webSettings.setJavaScriptEnabled(true);
        //设置自适应屏幕，两者合用
        webSettings.setUseWideViewPort(true); //将图片调整到适合webview的大小
        webSettings.setLoadWithOverviewMode(true); // 缩放至屏幕的大小

        //缩放操作
        webSettings.setSupportZoom(true); //支持缩放，默认为true。是下面那个的前提。
        webSettings.setBuiltInZoomControls(true); //设置内置的缩放控件。若为false，则该WebView不可缩放
        webSettings.setDisplayZoomControls(false); //隐藏原生的缩放控件
        //其他细节操作
        webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK); //关闭webview中缓存
        webSettings.setAllowFileAccess(true); //设置可以访问文件
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true); //支持通过JS打开新窗口
        webSettings.setLoadsImagesAutomatically(true); //支持自动加载图片
        webSettings.setDefaultTextEncodingName("utf-8");//设置编码格式
        webSettings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN);
        webSettings.setLoadWithOverviewMode(true);

        mWebview.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                String title = view.getTitle();

                Log.d("ckf", "网页标题----》 " + title);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                //使用自己的WebView组件来响应Url加载事件，而不是使用默认浏览器器加载页面
                mWebview.loadUrl(url);
                //消耗掉这个事件。Android中返回True的即到此为止吧,事件就会不会冒泡传递了，我们称之为消耗掉
                return true;
            }

        });

        mWebview.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onReceivedTitle(WebView view, String title) {
                super.onReceivedTitle(view, title);
                Log.d("ckf", "网页标题----》 " + title);
            }
        });

    }

    @SuppressLint("NewApi")
    @Override
    protected void onResume() {
        super.onResume();
        mWebview.onResume();
        // ...
    }

    @SuppressLint("NewApi")
    @Override
    protected void onPause() {
        mWebview.onPause();
        // ...
        super.onPause();
    }


    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.iv_back) {
            //关闭
            finish();
        }
    }

    private void initView() {
        TbsReaderView tbsReaderView = new TbsReaderView(this, new TbsReaderView.ReaderCallback() {
            @Override
            public void onCallBackAction(Integer integer, Object o, Object o1) {

            }
        });
        tbsReaderView.openFile(new Bundle());
        mIvBack = (ImageView) findViewById(R.id.iv_back);
        mIvBack.setOnClickListener(this);
        mTvTitle = (TextView) findViewById(R.id.tv_title);
        mWebview = findViewById(R.id.webview);
        mRlTitle = findViewById(R.id.rl_title);

        initWebViewSetting();

    }


}
