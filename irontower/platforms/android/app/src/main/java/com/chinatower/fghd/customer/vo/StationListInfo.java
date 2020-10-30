package com.chinatower.fghd.customer.vo;

import java.io.Serializable;
import java.util.List;

/**
 * @auther EnzoChan
 * created:2020/9/7
 * desc:
 */
public class StationListInfo implements Serializable {


    /**
     * cabinetId : CH4815JMLD190417006
     * cabinetName : 福建省福州市鼓楼区
     * cabinetAddress : 福州市区2
     * cabinetStatus : 1
     * cabinCount : 12
     * bsBatteryInfoList : []
     * fullCount60 : 0
     * notFullCount60 : 0
     * fullCount48 : 0
     * notFullCount48 : 0
     * fullCount : 0
     * notFullCount : 0
     */

    private String cabinetId;
    private String cabinetName;
    private String cabinetAddress;
    private String cabinetStatus;
    private String cabinCount;
    private String fullCount60;
    private String notFullCount60;
    private String fullCount48;
    private String notFullCount48;
    private String fullCount;
    private String notFullCount;
    private List<?> bsBatteryInfoList;

    public String getCabinetId() {
        return cabinetId;
    }

    public void setCabinetId(String cabinetId) {
        this.cabinetId = cabinetId;
    }

    public String getCabinetName() {
        return cabinetName;
    }

    public void setCabinetName(String cabinetName) {
        this.cabinetName = cabinetName;
    }

    public String getCabinetAddress() {
        return cabinetAddress;
    }

    public void setCabinetAddress(String cabinetAddress) {
        this.cabinetAddress = cabinetAddress;
    }

    public String getCabinetStatus() {
        return cabinetStatus;
    }

    public void setCabinetStatus(String cabinetStatus) {
        this.cabinetStatus = cabinetStatus;
    }

    public String getCabinCount() {
        return cabinCount;
    }

    public void setCabinCount(String cabinCount) {
        this.cabinCount = cabinCount;
    }

    public String getFullCount60() {
        return fullCount60;
    }

    public void setFullCount60(String fullCount60) {
        this.fullCount60 = fullCount60;
    }

    public String getNotFullCount60() {
        return notFullCount60;
    }

    public void setNotFullCount60(String notFullCount60) {
        this.notFullCount60 = notFullCount60;
    }

    public String getFullCount48() {
        return fullCount48;
    }

    public void setFullCount48(String fullCount48) {
        this.fullCount48 = fullCount48;
    }

    public String getNotFullCount48() {
        return notFullCount48;
    }

    public void setNotFullCount48(String notFullCount48) {
        this.notFullCount48 = notFullCount48;
    }

    public String getFullCount() {
        return fullCount;
    }

    public void setFullCount(String fullCount) {
        this.fullCount = fullCount;
    }

    public String getNotFullCount() {
        return notFullCount;
    }

    public void setNotFullCount(String notFullCount) {
        this.notFullCount = notFullCount;
    }

    public List<?> getBsBatteryInfoList() {
        return bsBatteryInfoList;
    }

    public void setBsBatteryInfoList(List<?> bsBatteryInfoList) {
        this.bsBatteryInfoList = bsBatteryInfoList;
    }
}
