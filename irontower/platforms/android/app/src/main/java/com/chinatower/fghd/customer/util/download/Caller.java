package com.chinatower.fghd.customer.util.download;


import android.util.Log;

import com.chinatower.fghd.customer.Constant.Constant;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;

;

public class Caller {




    public static void downloadFileUrl(String path, String fileName, DownLoadFileCallBack callback) throws Exception {

        int fileSize = 0;
        int downLoadSize = 0;
        String url = null;
        url = path;
        URL myURL = new URL(url);
        File temp = null;
        File folder = new File(Constant.SDCARD_DOWNLOAD_PATH);
        //
        if (!folder.exists()) {
            folder.mkdirs();
        }
        temp = new File(folder, fileName);

        URLConnection conn = myURL.openConnection();
        conn.connect();
        InputStream is = conn.getInputStream();
        fileSize = conn.getContentLength();//
        if (fileSize <= 0)
            throw new Exception("文件无法打开");
        if (is == null)
            throw new Exception("stream is null");

        FileOutputStream fos = new FileOutputStream(temp);
        //
        byte buf[] = new byte[1024];
        callback.beginDown(fileSize);
        do {
            //
            int numread = is.read(buf);
            if (numread == -1) {
                break;
            }
            fos.write(buf, 0, numread);
            downLoadSize += numread;

            callback.downLoading(fileSize, downLoadSize);//
        } while (true);
        if (downLoadSize != fileSize) {
            File folder1 = new File(Constant.SDCARD_DOWNLOAD_PATH);//----------------
            temp = new File(folder1, fileName);
            temp.delete();
            temp = null;
        }
        callback.finishDownLoad(temp, fileSize, downLoadSize);//
        try {
            is.close();
        } catch (Exception ex) {
            Log.e("tag", "error: " + ex.getMessage() + ex);
        }
    }


}
