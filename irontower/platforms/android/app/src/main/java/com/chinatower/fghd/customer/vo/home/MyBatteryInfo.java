package com.chinatower.fghd.customer.vo.home;

/**
 * @auther EnzoChan
 * created:2020/8/25
 * desc:
 */
public class MyBatteryInfo {


    /**
     * batteryId : BT106002012LDTY200320141
     * currentCapacity : 90
     * currentVoltage : 0
     * currentSpeed : 0
     * dayMileage : 0
     * countMileage : 0
     * onlineStatus : 1
     */

    /**
     * 电池编码
     */
    private String batteryId;
    /**
     * 剩余电量
     */
    private String currentCapacity;
    /**
     * 当前电压
     */
    private String currentVoltage;
    /**
     * 速度信息
     */
    private String currentSpeed;
    /**
     * 日行驶里程
     */
    private String dayMileage;
    /**
     * 累计行驶里程
     */
    private String countMileage;
    /**
     * 电池在线和离线状态:0离线1在线
     */
    private String onlineStatus;

    public String getBatteryId() {
        return batteryId;
    }

    public void setBatteryId(String batteryId) {
        this.batteryId = batteryId;
    }

    public String getCurrentCapacity() {
        return currentCapacity;
    }

    public void setCurrentCapacity(String currentCapacity) {
        this.currentCapacity = currentCapacity;
    }

    public String getCurrentVoltage() {
        return currentVoltage;
    }

    public void setCurrentVoltage(String currentVoltage) {
        this.currentVoltage = currentVoltage;
    }

    public String getCurrentSpeed() {
        return currentSpeed;
    }

    public void setCurrentSpeed(String currentSpeed) {
        this.currentSpeed = currentSpeed;
    }

    public String getDayMileage() {
        return dayMileage;
    }

    public void setDayMileage(String dayMileage) {
        this.dayMileage = dayMileage;
    }

    public String getCountMileage() {
        return countMileage;
    }

    public void setCountMileage(String countMileage) {
        this.countMileage = countMileage;
    }

    public String getOnlineStatus() {
        return onlineStatus;
    }

    public void setOnlineStatus(String onlineStatus) {
        this.onlineStatus = onlineStatus;
    }
}
