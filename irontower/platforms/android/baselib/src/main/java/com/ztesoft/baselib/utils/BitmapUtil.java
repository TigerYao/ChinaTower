package com.ztesoft.baselib.utils;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by fengxuan on 2017/8/11.
 */

public class BitmapUtil {

    private static final int IO_BUFFER_SIZE = 10 * 1024;

    public static Bitmap getLocalBitmap(String url) {

        Bitmap bitmap = null;

        File file = new File(url);
        if (file.exists()){
            bitmap = BitmapFactory.decodeFile(url);
        }

        return bitmap;
    }

    /**
     * 从网络中加载图片
     * @param url
     * @return
     */
    public static Bitmap getImageBitmapFromNet(String url) {

        Bitmap bitmap = null;
        URL imgUrl = null;
        try {
            imgUrl = new URL(url);
            HttpURLConnection conn = (HttpURLConnection) imgUrl
                    .openConnection();
            conn.setDoInput(true);
            conn.connect();
            InputStream is = conn.getInputStream();
            bitmap = BitmapFactory.decodeStream(is);
            is.close();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return bitmap;
    }

    /**
     * 将本地图片转成字节数组
     * @param bitmap
     * @return
     */
    public static byte[] getBitmapByte(Bitmap bitmap) {

        byte[] data = null;

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG,100,outputStream);
        data = outputStream.toByteArray();
        try {
            outputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return data;
    }

    /**
     * 按正方形裁切图片
     */
    public static Bitmap imageCrop(Bitmap bitmap) {
        int w = bitmap.getWidth(); // 得到图片的宽，高
        int h = bitmap.getHeight();

        int wh = w > h ? h : w;// 裁切后所取的正方形区域边长

        int retX = w > h ? (w - h) / 2 : 0;//基于原图，取正方形左上角x坐标
        int retY = w > h ? 0 : (h - w) / 2;

        //下面这句是关键
        return Bitmap.createBitmap(bitmap, retX, retY, wh, wh, null, false);
    }

}
