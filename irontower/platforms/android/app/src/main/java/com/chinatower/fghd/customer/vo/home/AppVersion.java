package com.chinatower.fghd.customer.vo.home;

import java.io.Serializable;

/**
 * @auther EnzoChan
 * created:2020/8/31
 * desc:
 */
public class AppVersion implements Serializable {


    /**
     * appCode : exchange_ios
     * appName : 换电app
     * appVersion : 4.0.5
     * appVersionNo : 405
     * upgradeUrl : http://itunes.apple.com/app/id1514351725
     * isForceUpgrade : null
     * upgradeDescribe : 1、新增在线客服入口
     * 2、新增按权限显示换电柜
     * 3、新增我的车辆展示
     * 4、新增邀请码绑定记录
     * 5、优化换电柜详情布局
     * 6、优化电池运动轨迹
     * 7、优化用户体验
     * createTime : 2020-03-30 11:20:44
     */

    private String appCode;
    private String appName;
    private String appVersion;
    private String appVersionNo;
    private String upgradeUrl;
    private String isForceUpgrade;
    private String upgradeDescribe;
    private String createTime;

    public String getAppCode() {
        return appCode;
    }

    public void setAppCode(String appCode) {
        this.appCode = appCode;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getAppVersion() {
        return appVersion;
    }

    public void setAppVersion(String appVersion) {
        this.appVersion = appVersion;
    }

    public String getAppVersionNo() {
        return appVersionNo;
    }

    public void setAppVersionNo(String appVersionNo) {
        this.appVersionNo = appVersionNo;
    }

    public String getUpgradeUrl() {
        return upgradeUrl;
    }

    public void setUpgradeUrl(String upgradeUrl) {
        this.upgradeUrl = upgradeUrl;
    }

    public Boolean getIsForceUpgrade() {
        return isForceUpgrade.equals("1");
    }

    public void setIsForceUpgrade(String isForceUpgrade) {
        this.isForceUpgrade = isForceUpgrade;
    }

    public String getUpgradeDescribe() {
        return upgradeDescribe;
    }

    public void setUpgradeDescribe(String upgradeDescribe) {
        this.upgradeDescribe = upgradeDescribe;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }
}
