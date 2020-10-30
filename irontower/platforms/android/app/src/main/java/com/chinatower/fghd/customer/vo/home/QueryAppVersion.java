package com.chinatower.fghd.customer.vo.home;

/**
 * @auther EnzoChan
 * created:2020/8/31
 * desc:
 */
public class QueryAppVersion {
    private String appCode;

    public QueryAppVersion(String appCode) {
        this.appCode = appCode;
    }

    public String getAppCode() {
        return appCode;
    }

    public void setAppCode(String appCode) {
        this.appCode = appCode;
    }
}
