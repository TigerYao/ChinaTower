package com.ztesoft.baselib.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

import android.graphics.Bitmap;
import android.graphics.Bitmap.CompressFormat;
import android.graphics.BitmapFactory;
import android.util.Base64;

/***
 * 转换成字节数组
 * 
 * @author kohui
 * 
 */
public class FormatTransfer {

	public static byte[] toHH(int n) {
		byte[] b = new byte[4];
		b[3] = (byte) (n & 0xff);
		b[2] = (byte) (n >> 8 & 0xff);
		b[1] = (byte) (n >> 16 & 0xff);
		b[0] = (byte) (n >> 24 & 0xff);
		return b;
	}

	public static byte[] toHH(short n) {
		byte[] b = new byte[2];
		b[1] = (byte) (n & 0xff);
		b[0] = (byte) (n >> 8 & 0xff);
		return b;
	}

	public static byte[] byteArrayCopy(byte[] abyte1, byte[] abyte2) {
		if (abyte1 == null)
			abyte1 = new byte[0];
		byte[] newbytes = new byte[abyte1.length + abyte2.length];
		System.arraycopy(abyte1, 0, newbytes, 0, abyte1.length);
		System.arraycopy(abyte2, 0, newbytes, abyte1.length, abyte2.length);
		return newbytes;
	}

	public static String bitmaptoString(Bitmap bitmap) {
		// 将Bitmap转换成字符串
		String string = null;
		bitmap = compressImage(bitmap, 100);
		ByteArrayOutputStream bStream = new ByteArrayOutputStream();
		bitmap.compress(CompressFormat.PNG, 100, bStream);
		byte[] bytes = bStream.toByteArray();
		LogUtils.d("huhui", "bytes.toByteArray().length--" + bytes.length / 1024);

		string = Base64.encodeToString(bytes, Base64.DEFAULT);
		return string;

	}

	/**
	 * 
	 * @param image
	 * @param options
	 *            压缩比
	 * @return
	 */
	private static Bitmap compressImage(Bitmap image, int options) {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		// int options = 100;
		image.compress(CompressFormat.JPEG, options, baos);// 质量压缩方法，这里100表示不压缩，把压缩后的数据存放到baos中
		while (baos.toByteArray().length / 1024 > 100) { // 循环判断如果压缩后图片是否大于100kb,大于继续压缩
			baos.reset();// 重置baos即清空baos
			options -= 10;// 每次都减少10
			image.compress(CompressFormat.JPEG, options, baos);// 这里压缩options%，把压缩后的数据存放到baos中

		}
		ByteArrayInputStream isBm = new ByteArrayInputStream(baos.toByteArray());// 把压缩后的数据baos存放到ByteArrayInputStream中
		Bitmap bitmap = BitmapFactory.decodeStream(isBm, null, null);// 把ByteArrayInputStream数据生成图片
		return bitmap;
	}

}
