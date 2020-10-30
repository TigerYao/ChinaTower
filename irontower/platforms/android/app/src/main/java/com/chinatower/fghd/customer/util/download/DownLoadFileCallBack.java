package com.chinatower.fghd.customer.util.download;


import java.io.File;

public interface DownLoadFileCallBack {
	public void init();

	/**
	 * 开始下载，通知文件的大小
	 * @param fileSize
	 */
	public void beginDown(long fileSize);

	/**
	 * 下载中，返回进度
	 * @param fileSize
	 * @param downLoadSize
	 */
	public void downLoading(long fileSize, long downLoadSize);

	/**
	 * 下载完后
	 * @param file
	 * @param fileSize
	 * @param downLoadSize
	 * @param result 服务器返参
	 */
	public void finishDownLoad(File file, long fileSize, long downLoadSize);

	public void error(String msg);

}
