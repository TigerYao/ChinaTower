package com.chinatower.fghd.customer.vo.home;

/**
 * @auther EnzoChan
 * created:2020/8/27
 * desc:
 */
public class ExchangePowerBusinessVo {

    /**
     * : '0'
     */
    private String batteryMarking;
    private String batteryVolts;
    private String cabinetId;
    private String driverId;
    private String provinceId;
    private String cityId;
    private String deptId;
    private String orgId;
    private String orgType;


    public String getBatteryMarking() {
        return batteryMarking;
    }

    public void setBatteryMarking(String batteryMarking) {
        this.batteryMarking = batteryMarking;
    }

    public String getBatteryVolts() {
        return batteryVolts;
    }

    public void setBatteryVolts(String batteryVolts) {
        this.batteryVolts = batteryVolts;
    }

    public String getCabinetId() {
        return cabinetId;
    }

    public void setCabinetId(String cabinetId) {
        this.cabinetId = cabinetId;
    }

    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }

    public String getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(String provinceId) {
        this.provinceId = provinceId;
    }

    public String getCityId() {
        return cityId;
    }

    public void setCityId(String cityId) {
        this.cityId = cityId;
    }

    public String getDeptId() {
        return deptId;
    }

    public void setDeptId(String deptId) {
        this.deptId = deptId;
    }

    public String getOrgId() {
        return orgId;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    public String getOrgType() {
        return orgType;
    }

    public void setOrgType(String orgType) {
        this.orgType = orgType;
    }


    public static ExchangePowerBusinessVo getExchangePowerBusinessVo(UserDetailInfo userDetailInfo) {
        ExchangePowerBusinessVo powerBusinessVo = new ExchangePowerBusinessVo();


        powerBusinessVo.setBatteryMarking("0");
        powerBusinessVo.setBatteryVolts(userDetailInfo.getBatteryVolts());
        powerBusinessVo.setCityId(userDetailInfo.getCityId());
        powerBusinessVo.setDeptId(userDetailInfo.getDeptId());
        powerBusinessVo.setDriverId(userDetailInfo.getDriverId());
        powerBusinessVo.setOrgType(userDetailInfo.getOrgType());
        powerBusinessVo.setOrgId(userDetailInfo.getOrgId());
        powerBusinessVo.setProvinceId(userDetailInfo.getProvinceId());
        return powerBusinessVo;

    }
}
