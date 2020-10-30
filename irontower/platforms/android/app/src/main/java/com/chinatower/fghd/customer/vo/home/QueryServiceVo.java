package com.chinatower.fghd.customer.vo.home;

/**
 * @auther EnzoChan
 * created:2020/8/26
 * desc:
 */
public class QueryServiceVo {


    /**
     * cityId : 410100
     * deptId : 110105
     * nodeId : NP-11010820200717185354192904
     * nodeType : 1
     * provinceId : 410000
     */

    private String cityId;
    private String deptId;
    /**
     * 网点编码
     */
    private String nodeId;
    /**
     * : 网点类型（1合作运营 2自有网点）
     */
    private String nodeType;
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

    public String getNodeId() {
        return nodeId;
    }

    public void setNodeId(String nodeId) {
        this.nodeId = nodeId;
    }

    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public String getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(String provinceId) {
        this.provinceId = provinceId;
    }


    public static QueryServiceVo getInstance(UserDetailInfo info) {
        QueryServiceVo queryServiceVo = new QueryServiceVo();

        queryServiceVo.setCityId(info.getCityId());
        queryServiceVo.setDeptId(info.getDeptId());
        queryServiceVo.setProvinceId(info.getProvinceId());
        queryServiceVo.setNodeType("1");

        return queryServiceVo;
    }
}
