package com.ztesoft.baselib.views;


public interface IMyTaskCallBack {

    /**
     * 功能说明:用来执行工作的方法。
     *
     * @return
     * @throws null
     * @date 2013-8-14
     * @author suchangjun
     * @since v1.0
     */
    public Object doWork(Object params, int flag);

    /**
     * 功能说明:执行完工作用来回调方法。
     *
     * @return
     * @throws null
     * @date 2013-8-14
     * @author suchangjun
     * @since v1.0
     */
    public void afterWorkCallback(Object params, int flag);

}
