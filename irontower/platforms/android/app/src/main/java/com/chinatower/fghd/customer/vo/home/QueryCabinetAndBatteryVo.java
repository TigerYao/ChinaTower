package com.chinatower.fghd.customer.vo.home;

/**
 * @auther EnzoChan
 * created:2020/8/31
 * desc:
 */
public class QueryCabinetAndBatteryVo {

    private String stationId;


    public QueryCabinetAndBatteryVo(String stationId) {
        this.stationId = stationId;
    }

    public String getStationId() {
        return stationId;
    }

    public void setStationId(String stationId) {
        this.stationId = stationId;
    }
}
