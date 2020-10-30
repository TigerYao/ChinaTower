package com.chinatower.fghd.customer.vo.home;

/**
 * @auther EnzoChan
 * created:2020/10/12
 * desc:
 */
public class OperateOfflineCabinetExcVo {


    /**
     * cityId : 110108
     * deptId : 110108
     * driverId : 505d9aef165344119d0b429af7db0738
     * excCipherText : 690546d1a225acc2e5a09c2c1e466f3df1bc49ad59dded4b930b85c4373a0efa170eef0dcf91e536347963b44331bc3c2d7f97fba0d9495f089e1bed157c6899d21e70ac2d36891b67319ef91d3d6eab7b298143ed72e313942587d418972b02b9e5af5179391fa8e5847acdd3b45c6454f68d27820a7818b7f5a2e22da274629bb3214e910321e7b988f3773f5e1474d02b199f880ededf3a315afe2591a23d
     * excMarking : 0
     * orgId : 110105
     * orgType : 1
     * provinceId : 110000
     */

    private String cityId;
    private String deptId;
    private String driverId;
    private String excCipherText;
    private String excMarking;
    private String orgId;
    private String orgType;
    private String provinceId;

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

    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }

    public String getExcCipherText() {
        return excCipherText;
    }

    public void setExcCipherText(String excCipherText) {
        this.excCipherText = excCipherText;
    }

    public String getExcMarking() {
        return excMarking;
    }

    public void setExcMarking(String excMarking) {
        this.excMarking = excMarking;
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

    public String getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(String provinceId) {
        this.provinceId = provinceId;
    }

    public static OperateOfflineCabinetExcVo getInstance(UserDetailInfo userDetailInfo) {
        OperateOfflineCabinetExcVo powerBusinessVo = new OperateOfflineCabinetExcVo();


        powerBusinessVo.setCityId(userDetailInfo.getCityId());
        powerBusinessVo.setDeptId(userDetailInfo.getDeptId());
        powerBusinessVo.setDriverId(userDetailInfo.getDriverId());
        powerBusinessVo.setOrgType(userDetailInfo.getOrgType());
        powerBusinessVo.setOrgId(userDetailInfo.getOrgId());
        powerBusinessVo.setProvinceId(userDetailInfo.getProvinceId());
        return powerBusinessVo;

    }
}
