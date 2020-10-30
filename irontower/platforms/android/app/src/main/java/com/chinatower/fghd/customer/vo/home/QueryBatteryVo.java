package com.chinatower.fghd.customer.vo.home;

/**
 * @auther EnzoChan
 * created:2020/8/25
 * desc:
 */
public class QueryBatteryVo {

    private String driverId;

    private String batteryId;

    public QueryBatteryVo(String driverId,String batteryId) {
        this.driverId = driverId;
        this.batteryId = batteryId;
    }
}
