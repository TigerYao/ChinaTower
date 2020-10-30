package com.ztesoft.baselib.views;


import android.content.Context;
import android.os.AsyncTask;


/**
 * 主要用来执行异步操作：要求入参传入一个回调函数。
 *
 * @author ckf
 */
public class MyAsyncTask extends AsyncTask<Object, Integer, Object> {

    private IMyTaskCallBack myCallBack;

    private int flag;

//    private ProDialog mProDialog;

    /**
     * 功能说明:用来传入回调函数。
     *
     * @param myCallBack
     * @throws null
     * @date 2013-8-14
     * @author suchangjun
     * @since v1.0
     */
    public MyAsyncTask(IMyTaskCallBack myCallBack, int flag) {
        this.myCallBack = myCallBack;
        this.flag = flag;
    }

    /**
     * 功能说明:设置进度条。
     *
     * @param context
     * @param message
     * @throws null
     * @date 2013-9-4
     * @author suchangjun
     * @since v1.0
     */
    public void setProcess(Context context, String message) {
//        mProDialog = new ProDialog(context);
//        mProDialog.setMessage(message);
    }

    @Override
    protected void onProgressUpdate(Integer... values) {
        super.onProgressUpdate(values);
        if (flag == values[0]) {
//            if (mProDialog != null) {
//                // 不用再次修改消息内容。
//                CommhelperUtil.showProcessDialog(mProDialog, "");
//            }
        }

    }

    @Override
    protected Object doInBackground(Object... params) {

        if (myCallBack != null) {
            publishProgress(flag);
            return myCallBack.doWork(params != null ? params[0] : null, flag);
        }
        return null;
    }

    @Override
    protected void onPostExecute(Object result) {
        super.onPostExecute(result);
        if (myCallBack != null) {
//            CommhelperUtil.dismissProcessDialog(mProDialog);
            myCallBack.afterWorkCallback(result, flag);
        }
    }

}
