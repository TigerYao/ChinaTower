package com.chinatower.fghd.customer.vo.home;

import android.text.TextUtils;

/**
 * @auther EnzoChan
 * created:2020/8/26
 * desc:
 */
public class CabinetInfo {

    /**
     * cabinetId : CH4815JMLD190417006
     * cabinetStatus : 1
     * fullCount : 2
     */

    private String cabinetId;
    private String cabinetStatus;
    private String fullCount;
    private String emptyCabinCount;

    public String getCabinetId() {
        return cabinetId;
    }

    public void setCabinetId(String cabinetId) {
        this.cabinetId = cabinetId;
    }

    public String getCabinetStatus() {
        return cabinetStatus;
    }

    public void setCabinetStatus(String cabinetStatus) {
        this.cabinetStatus = cabinetStatus;
    }

    public String getFullCount() {
        if (TextUtils.isEmpty(fullCount)) {
            return emptyCabinCount;
        }
        return fullCount;
    }

    public void setFullCount(String fullCount) {
        this.fullCount = fullCount;
    }
}
