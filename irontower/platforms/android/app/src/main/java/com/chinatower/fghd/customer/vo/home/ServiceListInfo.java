package com.chinatower.fghd.customer.vo.home;

import java.util.List;

/**
 * @auther EnzoChan
 * created:2020/8/26
 * desc:
 */
public class ServiceListInfo {
    private List<ServiceDetailInfo> bsNetworkInfoList;

    public List<ServiceDetailInfo> getBsNetworkInfoList() {
        return bsNetworkInfoList;
    }

    public void setBsNetworkInfoList(List<ServiceDetailInfo> bsNetworkInfoList) {
        this.bsNetworkInfoList = bsNetworkInfoList;
    }
}
