package com.chinatower.fghd.customer.vo.home;

/**
 * @auther EnzoChan
 * created:2020/8/27
 * desc:
 */
public class QueryFirstTakeVo {

    private String cityId;
    private String driverId;

    public QueryFirstTakeVo(String cityId, String driverId) {
        this.cityId = cityId;
        this.driverId = driverId;
    }

    public String getCityId() {
        return cityId;
    }

    public void setCityId(String cityId) {
        this.cityId = cityId;
    }

    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }
}
