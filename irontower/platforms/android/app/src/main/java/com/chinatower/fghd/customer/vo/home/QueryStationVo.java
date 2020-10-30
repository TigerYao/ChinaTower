package com.chinatower.fghd.customer.vo.home;

import com.chinatower.fghd.customer.vo.UserInfo;

/**
 * @auther EnzoChan
 * created:2020/8/25
 * desc:
 */
public class QueryStationVo {


    /**
     * stationLatitude : 26.322182432947034
     * stationLongitude : 118.6789047871628
     * stationStatus : 1
     * cityId : 110108
     * deptId : 110108
     * provinceId : 110000
     * stationType : 1
     * orgId :
     * orgType : 0
     */

    private double stationLatitude;
    private double stationLongitude;
    /**
     * 站点状态(0停用,-1在建,1入网,2维护) ,
     */
    private String stationStatus;
    private String cityId;
    private String deptId;
    private String provinceId;
    /**
     * 站点类型（1普通站点 2专属站点 3邮政站点）
     */
    private String stationType;
    private String orgId;
    private String orgType;

    public double getStationLatitude() {
        return stationLatitude;
    }

    public void setStationLatitude(double stationLatitude) {
        this.stationLatitude = stationLatitude;
    }

    public double getStationLongitude() {
        return stationLongitude;
    }

    public void setStationLongitude(double stationLongitude) {
        this.stationLongitude = stationLongitude;
    }

    public String getStationStatus() {
        return stationStatus;
    }

    public void setStationStatus(String stationStatus) {
        this.stationStatus = stationStatus;
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

    public String getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(String provinceId) {
        this.provinceId = provinceId;
    }

    public String getStationType() {
        return stationType;
    }

    public void setStationType(String stationType) {
        this.stationType = stationType;
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

    public QueryStationVo(double stationLatitude, double stationLongitude, String stationStatus, String cityId, String deptId, String provinceId, String stationType, String orgId, String orgType) {
        this.stationLatitude = stationLatitude;
        this.stationLongitude = stationLongitude;
        this.stationStatus = stationStatus;
        this.cityId = cityId;
        this.deptId = deptId;
        this.provinceId = provinceId;
        this.stationType = stationType;
        this.orgId = orgId;
        this.orgType = orgType;
    }

    public QueryStationVo() {
    }

    public static QueryStationVo getQueryStationVo(UserDetailInfo info) {
        QueryStationVo queryStationVo = new QueryStationVo();
        queryStationVo.setProvinceId(info.getProvinceId());
        queryStationVo.setOrgId(info.getOrgId());
        queryStationVo.setDeptId(info.getDeptId());
        queryStationVo.setCityId(info.getCityId());
        queryStationVo.setOrgType(info.getOrgType());
        queryStationVo.setStationStatus("1");
        if (info.getDriverType().equals("5")) {
            queryStationVo.setStationType("3");
        } else {
            String orgType = info.getOrgType();
            if (orgType.equals("0") || orgType.equals("1") || orgType.equals("2") || orgType.equals("3")) {
                queryStationVo.setStationType("1");
            } else if (orgType.equals("4")) {
                queryStationVo.setStationType("2");
            } else {
                queryStationVo.setStationType("");
            }
        }
        return queryStationVo;
    }

}
