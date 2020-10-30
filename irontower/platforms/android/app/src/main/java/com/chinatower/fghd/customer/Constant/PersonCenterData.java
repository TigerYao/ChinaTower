package com.chinatower.fghd.customer.Constant;

import android.content.Context;
import android.content.res.TypedArray;

import com.chinatower.fghd.customer.R;
import com.chinatower.fghd.customer.vo.home.PersonCenterInfo;

import java.util.ArrayList;
import java.util.List;

/**
 * @auther EnzoChan
 * created:2020/8/24
 * desc:
 */
public class PersonCenterData {
    private static List<PersonCenterInfo> personCenterList;

    /**
     * 由array_person_center.xml 中获取个人中心的配置
     *
     * @param context
     * @return
     */
    public static List<PersonCenterInfo> getPersonCenterList(Context context) {
        String[] menuNameStrings = context.getResources().getStringArray(R.array.person_center_menu_name);//获得String[]
        TypedArray mTypedArray = context.getResources().obtainTypedArray(R.array.person_center_menu_icon);
        String[] menuPushUrltrings = context.getResources().getStringArray(R.array.person_center_menu_push_url);
        personCenterList = new ArrayList<>();
        for (int i = 0; i < menuNameStrings.length; i++) {
            int imageId = mTypedArray.getResourceId(i, R.mipmap.drawer_exchange_recorder);//第一个参数为 ：所取图片在数组中的索引，第二个参数为：未找到时，返回的默认值id。
            PersonCenterInfo info = new PersonCenterInfo(menuNameStrings[i], imageId);
            info.setPushUrl(menuPushUrltrings[i]);
            personCenterList.add(info);
        }
        return personCenterList;
    }


}
