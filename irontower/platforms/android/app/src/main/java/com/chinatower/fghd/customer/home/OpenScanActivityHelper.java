package com.chinatower.fghd.customer.home;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.provider.MediaStore;
import android.support.annotation.NonNull;

import com.chinatower.fghd.customer.R;

import java.util.Arrays;
import java.util.List;

import me.devilsen.czxing.Scanner;
import me.devilsen.czxing.code.BarcodeFormat;
import me.devilsen.czxing.util.BarCodeUtil;
import me.devilsen.czxing.view.ScanActivityDelegate;
import me.devilsen.czxing.view.ScanView;

/**
 * @auther EnzoChan
 * created:2020/9/20
 * desc: 打开扫码页面
 */
public class OpenScanActivityHelper {
    private static final int CODE_SELECT_IMAGE = 1;

    private Context mContext;
    private static OpenScanActivityHelper openScanActivityHelper;


    private OnScanDelegate mOnScanDelegate;

    public void setmOnScanDelegate(OnScanDelegate mOnScanDelegate) {
        this.mOnScanDelegate = mOnScanDelegate;
    }

    public interface OnScanDelegate {
        void onScanResult(Activity activity, String result, BarcodeFormat format);
    }


    public OpenScanActivityHelper(Context mContext) {
        this.mContext = mContext;
    }

    public static OpenScanActivityHelper getInstance(Context mContext) {
        if (openScanActivityHelper == null) {
            openScanActivityHelper = new OpenScanActivityHelper(mContext);
        }

        return openScanActivityHelper;
    }


    public void openScanActivity(String title) {
        Resources resources = mContext.getResources();
        List<Integer> scanColors = Arrays.asList(resources.getColor(R.color.scan_side), resources.getColor(R.color.scan_partial), resources.getColor(R.color.scan_middle));

        Scanner.with(mContext)
                .setMaskColor(resources.getColor(R.color.mask_color))
                .setBorderColor(resources.getColor(R.color.box_line))
                .setBorderSize(BarCodeUtil.dp2px(mContext, 200))
//                .setBorderSize(BarCodeUtil.dp2px(this, 200), BarCodeUtil.dp2px(this, 100))
                .setCornerColor(resources.getColor(R.color.corner))
                .setScanLineColors(scanColors)
//                .setHorizontalScanLine()
                .setScanMode(ScanView.SCAN_MODE_BIG)
//                .setBarcodeFormat(BarcodeFormat.EAN_13)
                .setTitle(title)
                .showAlbum(false)
                .setScanNoticeText("将二维码放入框内，自动识别")
                .setFlashLightOnText("打开闪光灯")
                .setFlashLightOffText("关闭闪光灯")
//                .setFlashLightInvisible()
                .setFlashLightOnDrawable(R.drawable.ic_highlight_open_24dp)
                .setFlashLightOffDrawable(R.drawable.ic_highlight_close_24dp)
//                .continuousScan()
                .enableOpenCVDetect(true)
                .setOnClickAlbumDelegate(new ScanActivityDelegate.OnClickAlbumDelegate() {
                    @Override
                    public void onClickAlbum(Activity activity) {
                        Intent albumIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                        activity.startActivityForResult(albumIntent, CODE_SELECT_IMAGE);
                    }

                    @Override
                    public void onSelectData(int requestCode, Intent data) {
                        if (requestCode == CODE_SELECT_IMAGE) {
//                            decodeImage(data);
                        }
                    }
                })
                .setOnScanResultDelegate(new ScanActivityDelegate.OnScanDelegate() {
                    @Override
                    public void onScanResult(@NonNull final Activity activity, @NonNull final String result, @NonNull BarcodeFormat format) {
                        // 如果有回调，则必然有值,因为要避免AndroidX和support包的差异，所以没有默认的注解
//                        Intent intent = new Intent(MainActivity.this, DelegateActivity.class);
//                        intent.putExtra("result", result);
//                        startActivity(intent);

//                        final String showContent = "format: " + format.name() + "  code: " + result;
//                        runOnUiThread(new Runnable() {
//                            @Override
//                            public void run() {
//                                if ("123".equals(result)) {
//                                    activity.finish();
//                                }
//                                Toast.makeText(MainActivity.this, showContent, Toast.LENGTH_SHORT).show();
//                            }
//                        });
                        if (mOnScanDelegate != null) {
                            mOnScanDelegate.onScanResult(activity, result, format);
                        }
//                        QRCodeHelper mQRCodeHelper = QRCodeHelper.getInstance(mContext);
//                        mQRCodeHelper.qrCodeAnalysis(result);
//                        mQRCodeHelper.setQRCodeHelperListener(mQRCodeHelperListener);
                    }
                })
                .start();
    }
}
