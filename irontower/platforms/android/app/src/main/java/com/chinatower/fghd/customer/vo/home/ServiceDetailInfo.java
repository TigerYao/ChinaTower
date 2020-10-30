package com.chinatower.fghd.customer.vo.home;

import java.io.Serializable;

/**
 * @auther EnzoChan
 * created:2020/8/26
 * desc:
 */
public class ServiceDetailInfo implements Serializable {


    /**
     * nodeId : NP-11010120200722093735789788
     * nodeName : 1
     * nodeStatus : 1
     * nodeLongitude : 68。9
     * nodeLatitude : 68。9
     * nodeAddress : 68。9
     * provinceId : 110000
     * cityId : 110101
     * openTime : 00:00
     * closeTime : 00:00
     * operatorName : 师傅
     * operatorPhone : 18766666666
     * operatorEmail : 68。9
     * operateTime : 2020-07-01 00:00:00
     * deptId : 100000
     */

    private String nodeId;
    private String nodeName;
    private String nodeStatus;
    private String nodeLongitude;
    private String nodeLatitude;
    private String nodeAddress;
    private String provinceId;
    private String cityId;
    private String openTime;
    private String closeTime;
    private String operatorName;
    private String operatorPhone;
    private String operatorEmail;
    private String operateTime;
    private String deptId;

    public String getNodeId() {
        return nodeId;
    }

    public void setNodeId(String nodeId) {
        this.nodeId = nodeId;
    }

    public String getNodeName() {
        return nodeName;
    }

    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }

    public String getNodeStatus() {
        return nodeStatus;
    }

    public void setNodeStatus(String nodeStatus) {
        this.nodeStatus = nodeStatus;
    }

    public String getNodeLongitude() {
        return nodeLongitude;
    }

    public void setNodeLongitude(String nodeLongitude) {
        this.nodeLongitude = nodeLongitude;
    }

    public String getNodeLatitude() {
        return nodeLatitude;
    }

    public void setNodeLatitude(String nodeLatitude) {
        this.nodeLatitude = nodeLatitude;
    }

    public String getNodeAddress() {
        return nodeAddress;
    }

    public void setNodeAddress(String nodeAddress) {
        this.nodeAddress = nodeAddress;
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

    public String getOpenTime() {
        return openTime;
    }

    public void setOpenTime(String openTime) {
        this.openTime = openTime;
    }

    public String getCloseTime() {
        return closeTime;
    }

    public void setCloseTime(String closeTime) {
        this.closeTime = closeTime;
    }

    public String getOperatorName() {
        return operatorName;
    }

    public void setOperatorName(String operatorName) {
        this.operatorName = operatorName;
    }

    public String getOperatorPhone() {
        return operatorPhone;
    }

    public void setOperatorPhone(String operatorPhone) {
        this.operatorPhone = operatorPhone;
    }

    public String getOperatorEmail() {
        return operatorEmail;
    }

    public void setOperatorEmail(String operatorEmail) {
        this.operatorEmail = operatorEmail;
    }

    public String getOperateTime() {
        return operateTime;
    }

    public void setOperateTime(String operateTime) {
        this.operateTime = operateTime;
    }

    public String getDeptId() {
        return deptId;
    }

    public void setDeptId(String deptId) {
        this.deptId = deptId;
    }
}
