package com.ztesoft.baselib.utils;

import android.content.ContentResolver;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Bitmap.Config;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.graphics.PorterDuff.Mode;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.provider.MediaStore;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Android图片处理类 Bitmap与DrawAble与byte[]与InputStream之间的转换工具类 图片色调转换工具类 图片保存格式工具类
 *
 * @author
 */
public class ImageUtil {

    private static ImageUtil tools = null;

    /**
     * . 获得实例
     *
     * @return .
     */
    public static ImageUtil getInstance() {
        if (tools == null) {
            tools = new ImageUtil();
            return tools;
        }
        return tools;
    }

    /**
     * . 将byte[]转换成InputStream
     */
    public InputStream byte2InputStream(byte[] bt) {
        ByteArrayInputStream bais = new ByteArrayInputStream(bt);
        return bais;
    }

    /**
     * . 将InputStream转换成byte[]
     *
     * @param is .
     * @return .
     */
    public byte[] inputStream2Bytes(InputStream is) {
        String str = "";
        byte[] readByte = new byte[1024];
        try {
            while ((is.read(readByte, 0, 1024)) != -1) {
                str += new String(readByte).trim();
            }
            return str.getBytes();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * . 将Bitmap转换成InputStream
     *
     * @param bm .
     * @return .
     */
    public InputStream bitmap2InputStream(Bitmap bm) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bm.compress(Bitmap.CompressFormat.JPEG, 100, baos);
        InputStream is = new ByteArrayInputStream(baos.toByteArray());
        return is;
    }

    /**
     * . 将Bitmap转换成InputStream
     *
     * @param bm      .
     * @param quality .
     * @return .
     */
    public InputStream bitmap2InputStream(Bitmap bm, int quality) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bm.compress(Bitmap.CompressFormat.PNG, quality, baos);
        InputStream is = new ByteArrayInputStream(baos.toByteArray());
        return is;
    }

    /**
     * . 将InputStream转换成Bitmap
     *
     * @param is .
     * @return .
     */
    public Bitmap inputStream2Bitmap(InputStream is) {
        return BitmapFactory.decodeStream(is);
    }

    /**
     * . Drawable转换成InputStream
     *
     * @param db .
     * @return .
     */
    public InputStream drawable2InputStream(Drawable db) {
        Bitmap bitmap = this.drawable2Bitmap(db);
        return this.bitmap2InputStream(bitmap);
    }

    /**
     * . InputStream转换成Drawable
     *
     * @param is .
     * @return .
     */
    public Drawable inputStream2Drawable(InputStream is) {
        Bitmap bitmap = this.inputStream2Bitmap(is);
        return this.bitmap2Drawable(bitmap);
    }

    /**
     * . Drawable转换成byte[]
     *
     * @param db .
     * @return .
     */
    public byte[] drawable2Bytes(Drawable db) {
        Bitmap bitmap = this.drawable2Bitmap(db);
        return this.bitmap2Bytes(bitmap);
    }

    /**
     * . byte[]转换成Drawable
     */
    public Drawable bytes2Drawable(byte[] bt) {
        Bitmap bitmap = this.bytes2Bitmap(bt);
        return this.bitmap2Drawable(bitmap);
    }

    /**
     * . Bitmap转换成byte[]
     *
     * @param bm .
     * @return .
     */
    public byte[] bitmap2Bytes(Bitmap bm) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bm.compress(Bitmap.CompressFormat.PNG, 100, baos);
        return baos.toByteArray();
    }

    /**
     * . Bitmap转换成byte[]
     *
     * @param bm .
     * @return .
     */
    public byte[] bitmap2Bytes(Bitmap bm, int quality) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bm.compress(Bitmap.CompressFormat.PNG, quality, baos);
        return baos.toByteArray();
    }

    /**
     * . byte[]转换成Bitmap
     *
     * @param bt .
     * @return .
     */
    public Bitmap bytes2Bitmap(byte[] bt) {
        if (bt.length != 0) {
            return BitmapFactory.decodeByteArray(bt, 0, bt.length);
        }
        return null;
    }

    /**
     * . Drawable转换成Bitmap
     *
     * @return .
     */
    public Bitmap drawable2Bitmap(Drawable drawable) {
        Bitmap bitmap =
                Bitmap.createBitmap(drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight(), drawable
                        .getOpacity()
                        != PixelFormat.OPAQUE
                        ? Config.ARGB_8888
                        : Config.RGB_565);
        Canvas canvas = new Canvas(bitmap);
        drawable.setBounds(0, 0, drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight());
        drawable.draw(canvas);
        return bitmap;
    }

    /**
     * . Bitmap转换成Drawable
     *
     * @param bitmap .
     * @return .
     */
    public Drawable bitmap2Drawable(Bitmap bitmap) {
        @SuppressWarnings("deprecation")
        BitmapDrawable bd = new BitmapDrawable(bitmap);
        Drawable drawable = bd;
        return drawable;
    }

    /**
     * . 将彩色图转换为灰度图
     *
     * @param img .
     * @return 返回转换好的Drawable
     */
    public Drawable convertGreyImg(Drawable img) {
        img.mutate();
        ColorMatrix cm = new ColorMatrix();
        cm.setSaturation(0);
        ColorMatrixColorFilter cf = new ColorMatrixColorFilter(cm);
        img.setColorFilter(cf);
        return img;
    }

    /**
     * . 将彩色图转换为灰度图
     *
     * @param bm .
     * @return 返回转换好的Drawable
     */
    public Drawable convertGreyImg(Bitmap bm) {
        Drawable img = bitmap2Drawable(bm);
        img.mutate();
        ColorMatrix cm = new ColorMatrix();
        cm.setSaturation(0);
        ColorMatrixColorFilter cf = new ColorMatrixColorFilter(cm);
        img.setColorFilter(cf);
        return img;
    }

    /**
     * . 保存图片为PNG
     *
     * @param bitmap .
     * @param name   .
     */
    public void savePng(Bitmap bitmap, String name) {
        File file = new File(name);
        try {
            FileOutputStream out = new FileOutputStream(file);
            if (bitmap.compress(Bitmap.CompressFormat.PNG, 100, out)) {
                out.flush();
                out.close();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * . 保存图片为JPEG
     *
     * @param bitmap .
     * @param path   .
     */
    public void saveJpg(Bitmap bitmap, String path) {
        File file = new File(path);
        try {
            FileOutputStream out = new FileOutputStream(file);
            if (bitmap.compress(Bitmap.CompressFormat.JPEG, 100, out)) {
                out.flush();
                out.close();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * . 将Bitmap转换成指定大小
     *
     * @param bitmap .
     * @param width  .
     * @param height .
     * @return .
     */
    public Bitmap createBitmapBySize(Bitmap bitmap, int width, int height) {
        return Bitmap.createScaledBitmap(bitmap, width, height, true);
    }

    /**
     * . 将Bitmap转换成指定宽度,高度自适应
     *
     * @param bitmap .
     * @param width  .
     * @return .
     */
    public Bitmap createBitmapByWidth(Bitmap bitmap, int width) {
        int wd = bitmap.getWidth();
        int ht = bitmap.getHeight();
        ht = (int) (ht * (width / (float) wd));
        return createBitmapBySize(bitmap, width, ht);
    }

    /**
     * . 将Bitmap的宽度控制在一个值以内,如果小于这个值则直接返回
     *
     * @param bitmap .
     * @param width  .
     * @return .
     */
    public Bitmap createBitmapByMaxWidth(Bitmap bitmap, int width) {
        int wd = bitmap.getWidth();
        if (wd > width) {
            return createBitmapByWidth(bitmap, width);
        } else {
            return bitmap;
        }
    }

    /**
     * . 获取sd卡上的图片
     *
     * @param filepath .
     * @return .
     */
    public Bitmap getBitmapFromSd(String filepath) {
        File file = new File(filepath);
        if (file.exists()) {
            Bitmap bm = BitmapFactory.decodeFile(filepath);
            return bm;
        }
        return null;
    }

    /**
     * . 获取sd卡上的图片
     *
     * @param file .
     * @return .
     */
    public Bitmap getBitmapFromFile(File file) {
        if (file.exists()) {
            Bitmap bm = BitmapFactory.decodeFile(file.getPath());
            return bm;
        }
        return null;
    }

    /**
     * . 通告uri获取bitmap
     *
     * @param context .
     * @param uri     .
     * @return .
     */
    public Bitmap getBitmapFromUri(Context context, Uri uri) {
        try {
            // 外界的程序访问ContentProvider所提供数据 可以通过ContentResolver接口
            ContentResolver resolver = context.getContentResolver();
            // 读取uri所在的图片
            Bitmap bitmap = MediaStore.Images.Media.getBitmap(resolver, uri);
            return bitmap;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * . 将图片变为圆角
     *
     * @param bitmap .
     * @param pixels 数值越大,角度越大
     * @return .
     */
    public Bitmap toRoundCorner(Bitmap bitmap, int pixels) {
        Bitmap output = Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), Config.ARGB_8888);
        Canvas canvas = new Canvas(output);
        final int color = 0xff424242;
        final Paint paint = new Paint();
        final Rect rect = new Rect(0, 0, bitmap.getWidth(), bitmap.getHeight());
        final RectF rectF = new RectF(rect);
        final float roundPx = pixels;
        paint.setAntiAlias(true);
        canvas.drawARGB(0, 0, 0, 0);
        paint.setColor(color);
        canvas.drawRoundRect(rectF, roundPx, roundPx, paint);
        paint.setXfermode(new PorterDuffXfermode(Mode.SRC_IN));
        canvas.drawBitmap(bitmap, rect, rect, paint);
        return output;
    }

    /**
     * . 将图片变为默认角度的圆角图片
     *
     * @param bitmap .
     * @return .
     */
    public Bitmap toRoundCorner(Bitmap bitmap) {
        return toRoundCorner(bitmap, 15);
    }

    /**
     * . 高斯模糊
     *
     * @param bmp .
     * @return .
     */
    public static Bitmap convertToBlur(Bitmap bmp) {
        // 高斯矩阵
        int[] gauss = new int[]{1, 2, 1, 2, 4, 2, 1, 2, 1};

        int width = bmp.getWidth();
        int height = bmp.getHeight();
        Bitmap newBmp = Bitmap.createBitmap(width, height, Config.RGB_565);

        int pixR = 0;
        int pixG = 0;
        int pixB = 0;

        int pixColor = 0;

        int newR = 0;
        int newG = 0;
        int newB = 0;

        int delta = 16; // 值越小图片会越亮，越大则越暗

        int idx = 0;
        int[] pixels = new int[width * height];
        bmp.getPixels(pixels, 0, width, 0, 0, width, height);
        for (int i = 1, length = height - 1; i < length; i++) {
            for (int k = 1, len = width - 1; k < len; k++) {
                idx = 0;
                for (int m = -1; m <= 1; m++) {
                    for (int n = -1; n <= 1; n++) {
                        pixColor = pixels[(i + m) * width + k + n];
                        pixR = Color.red(pixColor);
                        pixG = Color.green(pixColor);
                        pixB = Color.blue(pixColor);

                        newR = newR + pixR * gauss[idx];
                        newG = newG + pixG * gauss[idx];
                        newB = newB + pixB * gauss[idx];
                        idx++;
                    }
                }

                newR /= delta;
                newG /= delta;
                newB /= delta;

                newR = Math.min(255, Math.max(0, newR));
                newG = Math.min(255, Math.max(0, newG));
                newB = Math.min(255, Math.max(0, newB));

                pixels[i * width + k] = Color.argb(255, newR, newG, newB);

                newR = 0;
                newG = 0;
                newB = 0;
            }
        }

        newBmp.setPixels(pixels, 0, width, 0, 0, width, height);

        return newBmp;
    }

    /**
     * . 宽度缩放
     *
     * @param filePath .
     * @param reqWidth .
     * @return .
     */
    public Bitmap compressBitmapFromResByWidth(String filePath, int reqWidth) {
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(filePath, options);
        options.inSampleSize = calculateInSampleSizeByWidth(options, reqWidth);
        options.inJustDecodeBounds = false;
        return BitmapFactory.decodeFile(filePath, options);
    }

    /**
     * . 压缩
     *
     * @param filePath  .
     * @param reqWidth  .
     * @param reqHeight .
     * @return .
     */
    public Bitmap compressBitmapFromRes(String filePath, int reqWidth, int reqHeight) {
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(filePath, options);
        options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight);
        options.inJustDecodeBounds = false;
        return BitmapFactory.decodeFile(filePath, options);
    }

    /**
     * . 获取最适合缩放值
     *
     * @param options   .
     * @param reqWidth  .
     * @param reqHeight .
     * @return .
     */
    private int calculateInSampleSize(BitmapFactory.Options options, int reqWidth, int reqHeight) {
        final int height = options.outHeight;
        final int width = options.outWidth;
        int inSampleSize = 1;

        if (height > reqHeight || width > reqWidth) {
            final int halfHeight = height / 2;
            final int halfWidth = width / 2;
            while ((halfHeight / inSampleSize) > reqHeight && (halfWidth / inSampleSize) > reqWidth) {
                inSampleSize *= 2;
            }
        }
        return inSampleSize;
    }

    /**
     * . 获取最适合缩放值
     *
     * @param options  .
     * @param reqWidth .
     * @return .
     */
    private int calculateInSampleSizeByWidth(BitmapFactory.Options options, int reqWidth) {
        final int width = options.outWidth;
        int inSampleSize = 1;

        if (width > reqWidth) {
            final int halfWidth = width / 2;
            while ((halfWidth / inSampleSize) > reqWidth) {
                inSampleSize *= 2;
            }
        }
        return inSampleSize;
    }







}
