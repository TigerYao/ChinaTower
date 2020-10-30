package com.chinatower.fghd.customer.util.download;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Message;
import android.support.v4.content.FileProvider;
import android.view.KeyEvent;
import android.widget.Toast;


import com.chinatower.fghd.customer.Constant.Constant;

import java.io.File;

/**
 * huang.wenxing
 * 下载
 */
public class DownloadTool {
//    private static DownloadTool instance;

    private DownloadTool() {

    }

    public DownloadTool(Context mContext, String url, String fileName, Boolean istCancelable) {
        // 删除sqlite文件
        String databaseFilename = "/data/data/" + mContext.getPackageName() + "/databases/mobile_oa.db";
        File file = new File(databaseFilename);
        boolean result = file.delete();
        if (!result) {
            System.gc();    //回收资源
            file.delete();
        }
        this.mContext = mContext;
        this.url = url;
        this.fileName = fileName;
        this.istCancelable = istCancelable;
        callerDownload();
    }

//    public static DownloadTool getInsance() {
//        if (instance == null) {
//            instance = new DownloadTool();
//        }
//        return instance;
//    }

    private final int ERROR = -1;
    private final int DOWNLOADING = 1;
    private final int DOWNLOADED = 2;
    private final int BEGINE_DOWNLOAD = 0;

    private String url;
    private String fileName;

    private Context mContext;
    private Boolean istCancelable = true;//true,为可以隐藏进度；false,为不可隐藏进度

    ProgressDialog progressDialog;

    public void initDownload(Context mContext, String url, String fileName, Boolean istCancelable) {
        this.mContext = mContext;
        this.url = url;
        this.fileName = fileName;
        this.istCancelable = istCancelable;
        callerDownload();
    }

    private void callerDownload() {
//        btnDownload.setText("下载中...");

        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Caller.downloadFileUrl(url, fileName,
                            new DownLoadFileCallBack() {
                                @Override
                                public void init() {

                                }

                                @Override
                                public void beginDown(long fileSize) {
                                    Message message = new Message();

                                    message.arg1 = new Long(fileSize / 1000).intValue();
                                    message.what = BEGINE_DOWNLOAD;
                                    handler.sendMessage(message);
                                }

                                @Override
                                public void downLoading(long fileSize,
                                                        long downLoadSize) {
                                    Message message = new Message();

                                    message.arg1 = new Long(fileSize / 1000).intValue();
                                    message.arg2 = new Long(downLoadSize / 1000).intValue();
                                    message.what = DOWNLOADING;
                                    handler.sendMessage(message);
                                }

                                @Override
                                public void finishDownLoad(File file,
                                                           long fileSize, long downLoadSize) {
                                    Message message = new Message();
                                    message.arg1 = new Long(fileSize / 1000).intValue();
                                    message.arg2 = new Long(downLoadSize / 1000).intValue();
                                    message.obj = file;
                                    message.what = DOWNLOADED;
                                    handler.sendMessage(message);
                                }

                                @Override
                                public void error(String msg) {

                                }
                            });
                } catch (Exception e) {
                    // 下载失败，发送失败信息
                    Message message = new Message();
                    message.obj = e.getMessage();
                    message.what = ERROR;
                    handler.sendMessage(message);
                }
            }
        });
        getProgressDialog().show();
        thread.start();

//        btnDownload.setEnabled(false);
    }

    /**
     * 处理下载安装信息
     */
    public Handler handler = new Handler() {
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case BEGINE_DOWNLOAD:
                    progressDialog.setMessage("开始下载:" + "总大小" + msg.arg1 + "KB");
//                    currentInfo.setText("开始下载:" + "总大小" + msg.arg1 + "KB");
//                    progressLayout.setVisibility(View.VISIBLE);
                    break;
                case DOWNLOADED: {
//                    btnDownload.setText("下载成功,，开始安装");
//                    currentInfo.setText("下载成功，开始安装!");
//                    progressDialog.setMessage("下载成功，开始安装!");
                    progressDialog.dismiss();
                    reSetupApk();
                    break;
                }
                case DOWNLOADING:
                    progressDialog.setMessage("正在下载" + fileName + ":  " + msg.arg2 * 100 / (msg.arg1 == 0 ? 1 : msg.arg1) + "%");
//                    progressDialog.setMessage("正在下载:" + "总大小－" + msg.arg1 + "KB,已下载-"  + msg.arg2 + "KB");
//                    fileName
                    if (msg.arg1 != 0) {
//                        progressBar.setProgress((msg.arg2 * 100) / msg.arg1);
                    } else {
//                        currentInfo.setText("数据有误，文件大小为0KB");
                        progressDialog.setMessage("数据有误，文件大小为0KB");
                    }
                    break;
                case ERROR:
                    progressDialog.setMessage("下载" + fileName + "异常!" + msg.obj);
//                    btnDownload.setText("下载失败,可重新下载");
//                    currentInfo.setText("下载发生异常，下载失败!异常:" + msg.obj);
                    break;
            }
        }
    };

    /* 在手机上打开文件的method */
    private void reSetupApk() {
        Intent intent = new Intent();
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setAction(Intent.ACTION_VIEW);
        File file = new File(Constant.SDCARD_DOWNLOAD_PATH + "/" + fileName);
//            /* 调用getMIMEType()来取得MimeType */
//        String type = getMIMEType();
//            /* 设置intent的file与MimeType */
//        intent.setDataAndType(Uri.fromFile(file), type);
//        mContext.startActivity(intent);
//        finish();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {  //对Android N及以上的版本做判断
            Uri apkUriN = FileProvider.getUriForFile(mContext,
                    mContext.getApplicationInfo().packageName + ".fileprovider", file);
            intent.addCategory("android.intent.category.DEFAULT");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);   //天假Flag 表示我们需要什么权限
            intent.setDataAndType(apkUriN, "application/vnd.android.package-archive");
        } else {
            Uri apkUri = Uri.fromFile(file);
            intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
        }
        mContext.startActivity(intent);

    }

    /* 判断文件MimeType的method */
    private String getMIMEType() {
        String mimeType = "application/vnd.android.package-archive";
        return mimeType;
    }

    private ProgressDialog setProgressDialog() {
//            progressDialog.setMessage("正在下载请稍候... ");
        progressDialog.setIndeterminate(true);
        progressDialog.setCancelable(istCancelable);//true,为可以隐藏；false,为不可隐藏
        progressDialog.setOnKeyListener(new DialogInterface.OnKeyListener() {
            @Override
            public boolean onKey(DialogInterface dialog, int keyCode, KeyEvent event) {
                if (keyCode == KeyEvent.KEYCODE_BACK && event.getAction() == KeyEvent.ACTION_DOWN) {
//                        ViewUtil.showLongToast(mContext, "正在后台下载！");
                }
                return false;
            }
        });

        progressDialog.setOnCancelListener(new DialogInterface.OnCancelListener() {
            @Override
            public void onCancel(DialogInterface arg0) {
                Toast.makeText(mContext, "已移到后台下载" + fileName + "!", Toast.LENGTH_LONG).show();
            }
        });

//            progressDialog.show();
        return progressDialog;
    }


    private ProgressDialog getProgressDialog() {
        if (progressDialog == null) {
            progressDialog = new ProgressDialog(mContext);
            setProgressDialog();
        }
        return progressDialog;
    }

}
