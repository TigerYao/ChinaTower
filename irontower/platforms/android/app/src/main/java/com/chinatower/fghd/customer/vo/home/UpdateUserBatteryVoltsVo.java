package com.chinatower.fghd.customer.vo.home;

/**
 * @auther EnzoChan
 * created:2020/8/27
 * desc:
 */
public class UpdateUserBatteryVoltsVo {

    private String batteryVolts;
    private String phoneOs;
    private String appVersion;
    private String phoneModel;
    private String driverId;


    public UpdateUserBatteryVoltsVo() {
    }

    public String getPhoneOs() {
        return phoneOs;
    }

    public void setPhoneOs(String phoneOs) {
        this.phoneOs = phoneOs;
    }

    public String getAppVersion() {
        return appVersion;
    }

    public void setAppVersion(String appVersion) {
        this.appVersion = appVersion;
    }

    public UpdateUserBatteryVoltsVo(String batteryVolts) {
        this.batteryVolts = batteryVolts;
    }

    public String getBatteryVolts() {
        return batteryVolts;
    }

    public void setBatteryVolts(String batteryVolts) {
        this.batteryVolts = batteryVolts;
    }

    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }

    public String getPhoneModel() {
        return phoneModel;
    }

    public void setPhoneModel(String phoneModel) {
        this.phoneModel = phoneModel;
    }
}
