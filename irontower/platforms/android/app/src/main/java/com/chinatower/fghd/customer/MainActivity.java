/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.chinatower.fghd.customer;

import android.Manifest;
import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.ClipData;
import android.content.ComponentName;
import android.content.ContentUris;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Picture;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Parcelable;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v4.content.FileProvider;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.*;
import android.widget.Toast;

import com.chinatower.fghd.customer.Constant.Constant;
import com.chinatower.fghd.customer.util.download.DownloadTool;
import com.chinatower.fghd.customer.vo.JpushTypeBean;
import com.chinatower.fghd.customer.vo.ToJsPathBean;
import com.google.gson.Gson;
import com.ztesoft.baselib.base.BaseActivity;
import com.ztesoft.baselib.utils.ShareManager;

import org.apache.cordova.*;
import org.apache.cordova.engine.SystemWebChromeClient;
import org.apache.cordova.engine.SystemWebView;
import org.apache.cordova.engine.SystemWebViewClient;
import org.apache.cordova.engine.SystemWebViewEngine;
import org.apache.cordova.h5Bridge.H5bridge;
import org.apache.cordova.splashscreen.SplashScreen;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class MainActivity extends CordovaActivity {

    private SystemWebView systemWebView;
    private Uri imageUri;
    private static final int FILE_CHOOSER_RESULT_CODE = 1333;
    private ValueCallback<Uri> mUploadMessage;
    private ValueCallback<Uri[]> mUploadCallbackAboveL;

    private JpushTypeBean jPushData;

    private ProgressDialog progressDialog;

    private String url;

    private String currentUrl;

    private KApplication kApplication;


//    @Override
//    protected CordovaWebView makeWebView() {
//        kApplication = (KApplication) this.getApplication();
//        if (appView == null && kApplication.getAppView() != null) {
//            return kApplication.getAppView();
//        } else {
//            return super.makeWebView();
//        }
//    }
//
//    @Override
//    protected void createViews() {
//        if (appView == null && kApplication.getAppView() == null) {
//            super.createViews();
//        }
//    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }

        jPushData = (JpushTypeBean) getIntent().getSerializableExtra("data");
        // Set by <content src="index.html" /> in config.xml
        url = getIntent().getStringExtra(Constant.TRAN_DATA_KEY);

        if (!TextUtils.isEmpty(url) && !url.contains("login/")) {
            this.launchUrl = launchUrl + url;
//            if (url.startsWith("javascript")) {
//                this.launchUrl = url;
//            }
        }

        if (launchUrl.contains("exchangeEleDetail")) {
            launchUrl = launchUrl + "isNeedMap=true";
        }
//

        loadUrl(launchUrl);

        Log.d("ckf", "url----> " + launchUrl);
//        Toast.makeText(MainActivity.this, "in mainActivity", Toast.LENGTH_LONG).show();

//        kApplication.setAppView(appView);
//        Toast.makeText(MainActivity.this, "in mainActivity", Toast.LENGTH_LONG).show();
        //下面能让 Android 设备支持 viewport;
        //权限的设置
        if (ContextCompat.checkSelfPermission(MainActivity.this, android.Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED ||
                ContextCompat.checkSelfPermission(MainActivity.this, android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
                        != PackageManager.PERMISSION_GRANTED ||
                ContextCompat.checkSelfPermission(MainActivity.this, android.Manifest.permission.ACCESS_FINE_LOCATION)
                        != PackageManager.PERMISSION_GRANTED ||
                ContextCompat.checkSelfPermission(MainActivity.this, android.Manifest.permission.READ_PHONE_STATE)
                        != PackageManager.PERMISSION_GRANTED) {//未开启相机权限
            //开启相机权限,200是标识码
            ActivityCompat.requestPermissions(MainActivity.this,
                    new String[]{android.Manifest.permission.CAMERA,
                            Manifest.permission.WRITE_EXTERNAL_STORAGE,
                            Manifest.permission.READ_PHONE_STATE,
                            android.Manifest.permission.ACCESS_FINE_LOCATION}, 200);
        } else {
            //开始定位
//            Toast.makeText(MainActivity.this, "已开启相机权限", Toast.LENGTH_LONG).show();
        }

        systemWebView = (SystemWebView) appView.getView();
        WebSettings settings = systemWebView.getSettings();
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setDefaultTextEncodingName("UTF-8");
        settings.setAllowContentAccess(true); // 是否可访问Content Provider的资源，默认值 true
        settings.setAllowFileAccess(true);    // 是否可访问本地文件，默认值 true

        settings.setDomStorageEnabled(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setJavaScriptEnabled(true);
        //关闭webview组件的保存密码功能。
        settings.setSavePassword(false);


        WebChromeClient client = new SystemWebChromeClient((SystemWebViewEngine) appView.getEngine()) {
            @Override
            public void onReceivedTitle(WebView view, String title) {
            }

            // For Android 3.0-
            public void openFileChooser(ValueCallback<Uri> uploadMsg) {

                mUploadMessage = uploadMsg;
                take();


            }

            // For Android 3.0+
            public void openFileChooser(ValueCallback uploadMsg, String acceptType) {

                mUploadMessage = uploadMsg;
                take();

            }

            //For Android 4.1
            public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
//            Log.d(TAG, "openFileChoose(ValueCallback<Uri> uploadMsg, String acceptType, String capture)");
                mUploadMessage = uploadMsg;

                take();

            }

            // For Android 5.0+
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {

                mUploadCallbackAboveL = filePathCallback;

                take();

                return true;
            }
        };
        systemWebView.setWebChromeClient(client);

        WebViewClient mWebViewClient = new SystemWebViewClient((SystemWebViewEngine) appView.getEngine()) {
            /**
             *    //该方法在Build.VERSION_CODES.LOLLIPOP以前有效，从Build.VERSION_CODES.LOLLIPOP起，
             *    建议使用shouldOverrideUrlLoading(WebView, WebResourceRequest)} instead
             * @param view          The WebView that is initiating the callback.
             * @param url           The url to be loaded.
             * @return 返回false，意味着请求过程里，不管有多少次的跳转请求（即新的请求地址），均交给webView自己处理，这也是此方法的默认处理
             *          返回true，说明你自己想根据url，做新的跳转，比如在判断url符合条件的情况下，我想让webView加载http://ask.csdn.net/questions/178242
             */
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                Log.d("ckf", url);

                if (url.contains(".apk")) {
                    return false;
                } else {
                    return super.shouldOverrideUrlLoading(view, url);
                }
            }

            /**
             *
             * @param view
             * @param request
             * @return //返回false，意味着请求过程里，不管有多少次的跳转请求（即新的请求地址），均交给webView自己处理，这也是此方法的默认处理
             *                 //返回true，说明你自己想根据url，做新的跳转，比如在判断url符合条件的情况下，我想让webView加载http://ask.csdn.net/questions/178242
             *
             */
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Log.d("ckf", view.getUrl());
                if (view.getUrl().contains(".apk")) {
                    return false;
                } else {
                    return super.shouldOverrideUrlLoading(view, request);
                }
            }


            @Override
            public void onPageFinished(WebView view, String url) {
                Log.i("ckf", "page finish " + url);
//                Toast.makeText(MainActivity.this, "page finish", Toast.LENGTH_LONG).show();
                currentUrl = url;
//                if (!TextUtils.isEmpty(MainActivity.this.url)) {
//                    removeProgress();
//
//                }

                Set<String> noticeSets = ShareManager.getSetValue(MainActivity.this, Constant.NOTICE_INFO_KEY);
                if (noticeSets != null && noticeSets.size() > 0) {
                    for (String noticeSet : noticeSets) {
                        setData(systemWebView, noticeSet);
                        //清空xml
                    }
                }
                super.onPageFinished(view, url);
                //your work here  ,
                // excute  js
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                Log.i("ckf", "page start " + url);
//                Toast.makeText(MainActivity.this, "page start", Toast.LENGTH_LONG).show();
//                if (!TextUtils.isEmpty(MainActivity.this.url)) {
//                    showProgress("加载中...");
//                }
                super.onPageStarted(view, url, favicon);
            }


            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                Toast.makeText(MainActivity.this, "onReceivedError " + description, Toast.LENGTH_LONG).show();

            }
        };


        systemWebView.setWebViewClient(mWebViewClient);
//        systemWebView.setPictureListener(new WebView.PictureListener() {
//            @Override
//            public void onNewPicture(WebView webView, @Nullable Picture picture) {
//
//            }
//        });
        /**
         * 解决webView无法访问http https混合内容
         */
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
//            systemWebView.getSettings().setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
//        }
        systemWebView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                Log.d("ckf", "开始下载   " + url);
                new DownloadTool(MainActivity.this, url, "铁塔换电", true);

            }
        });


        if (!TextUtils.isEmpty(url) && url.contains("login/")) {
            WebStorage.getInstance().deleteAllData();
            loadUrl(launchUrl);
        }


    }

    private void setData(WebView mWebView, String noticeId) {
        //1.拼接 JavaScript 代码
        String js = "window.localStorage.setItem(" + Constant.NOTICE_INFO_KEY + ",'{" + noticeId + ":{}}');";
        String jsUrl = "javascript:(function({ var localStorage = window.localStorage; localStorage.setItem(" + Constant.NOTICE_INFO_KEY + ",'{" + noticeId + ":{}}');";
        //2.根据不同版本，使用不同的 API 执行 Js
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            mWebView.evaluateJavascript(js, null);
        } else {
            mWebView.loadUrl(jsUrl);
            mWebView.reload();
        }
    }


    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d("ckf", "MainActivity onDestory end");
    }

    @Override
    public Object onMessage(String id, Object data) {
        if ("onPageFinished".equals(id)) {
            if (jPushData != null) {
                if (jPushData.getType().equals("1") || jPushData.getType().equals("0")) {
                    ToJsPathBean toJsPathBean = new ToJsPathBean();
                    toJsPathBean.setPathname("/myWallet/tradingDetail");
                    Gson mGson = new Gson();
                    String json = mGson.toJson(toJsPathBean);
                    String jsFunction = "window.pushToPage('" + json + "')";

                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Log.d("ckf", "加载交易详情");
                            appView.loadUrl("javascript:" + jsFunction);
                        }
                    });
                } else {
                    Gson mGson = new Gson();
                    String jsFunction = null;
                    jsFunction = "window.pushToPage('" + jPushData.getType() + "," + jPushData.getNoticeId() + "')";
                    String finalJsFunction = jsFunction;
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Log.d("ckf", "加载交易详情" + finalJsFunction);
                            appView.loadUrl("javascript:" + finalJsFunction);
                        }
                    });
                }
            } else {
                String jsFunction = "window.pushToPage('" + jPushData + "')";
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Log.d("ckf", "加载交易详情");
                        appView.loadUrl("javascript:" + jsFunction);
                    }
                });

            }
        }

        return super.onMessage(id, data);
    }

    /**
     * 读取uri所在的图片
     *
     * @param uri      图片对应的Uri
     * @param mContext 上下文对象
     * @return 获取图像的Bitmap
     */
    public static Bitmap getBitmapFromUri(Uri uri, Context mContext) {
        try {
//            Bitmap bitmap = MediaStore.Images.Media.getBitmap(mContext.getContentResolver(), uri);
            Bitmap bitmapFormUri = getBitmapFormUri(mContext, uri);
            return bitmapFormUri;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public void onBackPressed() {
        //如果可以返回上一级，而不是直接退出应用程序
        Log.d("ckf", "Main onBackPressed " + (systemWebView.canGoBack()));
        if (systemWebView.canGoBack()) {
            systemWebView.goBack();
        } else {
            super.onBackPressed();
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);

        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && systemWebView.canGoBack()) {
            systemWebView.goBack();// activityBaseWebAddWebView.reload();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    /**
     * 通过uri获取图片并进行压缩
     *
     * @param uri
     */
    public static Bitmap getBitmapFormUri(Context ac, Uri uri) throws FileNotFoundException, IOException {
        InputStream input = ac.getContentResolver().openInputStream(uri);
        BitmapFactory.Options onlyBoundsOptions = new BitmapFactory.Options();
        onlyBoundsOptions.inJustDecodeBounds = true;
        onlyBoundsOptions.inDither = true;//optional
        onlyBoundsOptions.inPreferredConfig = Bitmap.Config.ARGB_8888;//optional
        BitmapFactory.decodeStream(input, null, onlyBoundsOptions);
        input.close();
        int originalWidth = onlyBoundsOptions.outWidth;
        int originalHeight = onlyBoundsOptions.outHeight;
        if ((originalWidth == -1) || (originalHeight == -1)) {
            return null;
        }
        //图片分辨率以480x800为标准
        float hh = 800f;//这里设置高度为800f
        float ww = 480f;//这里设置宽度为480f
        //缩放比。由于是固定比例缩放，只用高或者宽其中一个数据进行计算即可
        int be = 1;//be=1表示不缩放
        if (originalWidth > originalHeight && originalWidth > ww) {//如果宽度大的话根据宽度固定大小缩放
            be = (int) (originalWidth / ww);
        } else if (originalWidth < originalHeight && originalHeight > hh) {//如果高度高的话根据宽度固定大小缩放
            be = (int) (originalHeight / hh);
        }
        if (be <= 0) {
            be = 1;
        }
        //比例压缩
        BitmapFactory.Options bitmapOptions = new BitmapFactory.Options();
        bitmapOptions.inSampleSize = be;//设置缩放比例
        bitmapOptions.inDither = true;//optional
        bitmapOptions.inPreferredConfig = Bitmap.Config.ARGB_8888;//optional
        input = ac.getContentResolver().openInputStream(uri);
        Bitmap bitmap = BitmapFactory.decodeStream(input, null, bitmapOptions);
        input.close();
        return compressImage(bitmap);//再进行质量压缩
    }

    /**
     * 质量压缩方法
     *
     * @param image
     * @return
     */
    public static Bitmap compressImage(Bitmap image) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        image.compress(Bitmap.CompressFormat.JPEG, 100, baos);//质量压缩方法，这里100表示不压缩，把压缩后的数据存放到baos中
        int options = 100;
        while (baos.toByteArray().length / 1024 > 100) {  //循环判断如果压缩后图片是否大于100kb,大于继续压缩
            baos.reset();//重置baos即清空baos
            //第一个参数 ：图片格式 ，第二个参数： 图片质量，100为最高，0为最差  ，第三个参数：保存压缩后的数据的流
            image.compress(Bitmap.CompressFormat.JPEG, options, baos);//这里压缩options%，把压缩后的数据存放到baos中
            options -= 10;//每次都减少10
        }
        ByteArrayInputStream isBm = new ByteArrayInputStream(baos.toByteArray());//把压缩后的数据baos存放到ByteArrayInputStream中
        Bitmap bitmap = BitmapFactory.decodeStream(isBm, null, null);//把ByteArrayInputStream数据生成图片
        return bitmap;
    }


    private void take() {
        File imageStorageDir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), "MyApp");        // Create the storage directory if it does not exist
        if (!imageStorageDir.exists()) {
            imageStorageDir.mkdirs();
        }
        File file = new File(imageStorageDir + File.separator + "IMG_" + String.valueOf(System.currentTimeMillis()) + ".jpg");
        if (Build.VERSION.SDK_INT >= 24) {
            imageUri = FileProvider.getUriForFile(MainActivity.this, this.getPackageName() + ".fileprovider", file);
        } else {
            imageUri = Uri.fromFile(file);
        }
        final List<Intent> cameraIntents = new ArrayList();
        final Intent captureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        final PackageManager packageManager = getPackageManager();
        final List<ResolveInfo> listCam = packageManager.queryIntentActivities(captureIntent, 0);
        for (ResolveInfo res : listCam) {
            final String packageName = res.activityInfo.packageName;
            final Intent i = new Intent(captureIntent);
            i.setComponent(new ComponentName(res.activityInfo.packageName, res.activityInfo.name));
            i.setPackage(packageName);
            i.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
            cameraIntents.add(i);

        }
        Intent i = new Intent(Intent.ACTION_GET_CONTENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("image/*");
        Intent chooserIntent = Intent.createChooser(i, "Image Chooser");
        chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, cameraIntents.toArray(new Parcelable[]{}));
        MainActivity.this.startActivityForResult(chooserIntent, FILE_CHOOSER_RESULT_CODE);
    }


    @SuppressWarnings("null")
    @TargetApi(Build.VERSION_CODES.JELLY_BEAN)
    private void onActivityResultAboveL(int requestCode, int resultCode, Intent data) {
        if (requestCode != FILE_CHOOSER_RESULT_CODE
                || mUploadCallbackAboveL == null) {
            return;
        }
        Uri[] results = null;
        if (resultCode == Activity.RESULT_OK) {
            if (data == null) {
                Bitmap bitmap = getBitmapFromUri(imageUri, MainActivity.this);
                String uriString = MediaStore.Images.Media.insertImage(getContentResolver(), bitmap, null, null);
                if (!TextUtils.isEmpty(uriString)) {
                    Uri uri = Uri.parse(uriString);
                    results = new Uri[]{uri};
                }

            } else {
                String dataString = data.getDataString();
                ClipData clipData = data.getClipData();
                if (clipData != null) {
                    results = new Uri[clipData.getItemCount()];
                    for (int i = 0; i < clipData.getItemCount(); i++) {
                        ClipData.Item item = clipData.getItemAt(i);
                        results[i] = item.getUri();
                    }
                }
                if (dataString != null)
                    results = new Uri[]{Uri.parse(dataString)};
            }
        } else {
            mUploadCallbackAboveL.onReceiveValue(results);
            mUploadCallbackAboveL = null;
            return;

        }
        if (results != null) {
//            getBitmapFromUri(results,MainActivity.this);
            mUploadCallbackAboveL.onReceiveValue(results);
            mUploadCallbackAboveL = null;
        } else {
            Bitmap bitmap = getBitmapFromUri(imageUri, MainActivity.this);
            Uri uri = Uri.parse(MediaStore.Images.Media.insertImage(getContentResolver(), bitmap, null, null));
            results = new Uri[]{uri};
            mUploadCallbackAboveL.onReceiveValue(results);
            mUploadCallbackAboveL = null;
        }
        return;
    }

    public static boolean isExternalStorageDocument(Uri uri) {
        return "com.android.externalstorage.documents".equals(uri.getAuthority());
    }

    /**
     * @param uri The Uri to check.
     * @return Whether the Uri authority is DownloadsProvider.
     */
    public static boolean isDownloadsDocument(Uri uri) {
        return "com.android.providers.downloads.documents".equals(uri.getAuthority());
    }

    public static String getDataColumn(Context context, Uri uri, String selection, String[] selectionArgs) {
        Cursor cursor = null;
        final String column = "_data";
        final String[] projection = {column};
        try {
            cursor = context.getContentResolver().query(uri, projection, selection, selectionArgs, null);
            if (cursor != null && cursor.moveToFirst()) {
                final int column_index = cursor.getColumnIndexOrThrow(column);
                return cursor.getString(column_index);
            }
        } finally {
            if (cursor != null) cursor.close();
        }
        return null;
    }

    @SuppressLint("NewApi")
    @TargetApi(Build.VERSION_CODES.KITKAT)
    public static String getPath(final Context context, final Uri uri) {
        final boolean isKitKat = Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT;
        // DocumentProvider
        if (isKitKat && DocumentsContract.isDocumentUri(context, uri)) {
            // ExternalStorageProvider
            if (isExternalStorageDocument(uri)) {
                final String docId = DocumentsContract.getDocumentId(uri);
                final String[] split = docId.split(":");
                final String type = split[0];
                if ("primary".equalsIgnoreCase(type)) {
                    return Environment.getExternalStorageDirectory() + "/" + split[1];
                }                // TODO handle non-primary volumes
            } else if (isDownloadsDocument(uri)) {
                final String id = DocumentsContract.getDocumentId(uri);
                final Uri contentUri = ContentUris.withAppendedId(Uri.parse("content://downloads/public_downloads"), Long.valueOf(id));
                return getDataColumn(context, contentUri, null, null);
            }
        }
        // MediaStore (and general)
        else if ("content".equalsIgnoreCase(uri.getScheme())) {
            return getDataColumn(context, uri, null, null);
        }
        // File
        else if ("file".equalsIgnoreCase(uri.getScheme())) {
            return uri.getPath();
        }
        return null;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_RESULT_CODE) {
            if (null == mUploadMessage && null == mUploadCallbackAboveL) return;
            Uri result = data == null || resultCode != RESULT_OK ? null : data.getData();
            if (mUploadCallbackAboveL != null) {
                onActivityResultAboveL(requestCode, resultCode, data);
            } else if (mUploadMessage != null) {
                if (result != null) {
                    String path = getPath(getApplicationContext(),
                            result);
                    Uri uri = Uri.fromFile(new File(path));
                    mUploadMessage
                            .onReceiveValue(uri);
                } else {
                    mUploadMessage.onReceiveValue(imageUri);
                }
                mUploadMessage = null;

            }
        } else if (requestCode == 1024) {
            //首页返回 关闭页面
            finish();
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case 200:
                if (grantResults.length != 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                } else {
                    Toast.makeText(this, "未开启相机权限，请手动到设置去开去权限", Toast.LENGTH_SHORT).show();
                }
                break;
            default:
                break;
        }
    }

    //-----显示ProgressDialog
    public void showProgress(String message) {
        if (progressDialog == null) {
            progressDialog = new ProgressDialog(MainActivity.this, ProgressDialog.THEME_HOLO_LIGHT);
            progressDialog.setCancelable(false);//设置点击不消失
        }
        if (progressDialog.isShowing()) {
            progressDialog.setMessage(message);
        } else {
            progressDialog.setMessage(message);
            progressDialog.show();
        }
    }

    //------取消ProgressDialog
    public void removeProgress() {
        if (progressDialog == null) {
            return;
        }
        if (progressDialog.isShowing()) {
            progressDialog.dismiss();
        }

    }

}
