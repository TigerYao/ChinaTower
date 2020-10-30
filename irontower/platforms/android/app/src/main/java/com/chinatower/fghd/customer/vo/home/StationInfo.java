package com.chinatower.fghd.customer.vo.home;

import java.io.Serializable;
import java.util.List;

/**
 * @auther EnzoChan
 * created:2020/8/26
 * desc:
 */
public class StationInfo implements Serializable {


    /**
     * stationId : ZD-CHZD12DPC019091112
     * stationLongitude : 119.28
     * stationLatitude : 26.08
     * stationAddress : 福州市区2
     * greyFlag : 1
     * bsCabinetResponseList : [{"cabinetId":"CH4815JMLD190417006","cabinetStatus":"1","fullCount":"2"},{"cabinetId":"CDZD12GDTY200109135","cabinetStatus":"1","fullCount":"2"}]
     */

    private String stationId;
    private String stationLongitude;
    private String stationLatitude;
    private String stationAddress;
    /**
     * greyFlag (string, optional): 站点是否在置灰  0不置灰 1置灰
     */
    private String greyFlag;
    private List<CabinetInfo> bsCabinetResponseList;

    public String getStationId() {
        return stationId;
    }

    public void setStationId(String stationId) {
        this.stationId = stationId;
    }

    public String getStationLongitude() {
        return stationLongitude;
    }

    public void setStationLongitude(String stationLongitude) {
        this.stationLongitude = stationLongitude;
    }

    public String getStationLatitude() {
        return stationLatitude;
    }

    public void setStationLatitude(String stationLatitude) {
        this.stationLatitude = stationLatitude;
    }

    public String getStationAddress() {
        return stationAddress;
    }

    public void setStationAddress(String stationAddress) {
        this.stationAddress = stationAddress;
    }

    public String getGreyFlag() {
        return greyFlag;
    }

    public void setGreyFlag(String greyFlag) {
        this.greyFlag = greyFlag;
    }

    public List<CabinetInfo> getBsCabinetResponseList() {
        return bsCabinetResponseList;
    }

    public void setBsCabinetResponseList(List<CabinetInfo> bsCabinetResponseList) {
        this.bsCabinetResponseList = bsCabinetResponseList;
    }


}
