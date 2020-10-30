package com.chinatower.fghd.customer.util;

import android.content.Context;

import com.baidu.mapapi.model.LatLng;
import com.chinatower.fghd.customer.Constant.Constant;
import com.chinatower.fghd.customer.vo.UserInfo;
import com.chinatower.fghd.customer.vo.home.MyLatLng;
import com.chinatower.fghd.customer.vo.home.UserDetailInfo;
import com.ztesoft.baselib.utils.ShareManager;

import org.apache.commons.codec.binary.Base64;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.StreamCorruptedException;

/**
 * @auther EnzoChan
 * created:2020/8/24
 * desc:
 */
public class UserInfoUtils {

    public static void setUserInfo(Context mContext, UserInfo mBean) {
        try {
            // 创建字节输出流
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            // 创建对象输出流，并封装字节流
            ObjectOutputStream oos = new ObjectOutputStream(baos);
            // 将对象写入字节流
            oos.writeObject(mBean);
            // 将字节流编码成base64的字符窜
            String mBeanStr = new String(Base64.encodeBase64(baos.toByteArray()));
            //写入到本地
            ShareManager.setValue(mContext, Constant.USER_INFO, mBeanStr);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    public static UserInfo getUserInfo(Context mContext) {
        UserInfo mBean = null;
        try {
            //读取本地缓存数据
            String userInfo = ShareManager.getValue(mContext, Constant.USER_INFO);
            //读取字节
            byte[] base64 = Base64.decodeBase64(userInfo.getBytes());
            //封装到字节流
            ByteArrayInputStream bais = new ByteArrayInputStream(base64);
            //再次封装
            ObjectInputStream bis = new ObjectInputStream(bais);
            //转换成对象
            mBean = (UserInfo) bis.readObject();
        } catch (StreamCorruptedException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return mBean;
    }


    public static void setUserDetailInfo(Context mContext, UserDetailInfo mBean) {
        try {
            // 创建字节输出流
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            // 创建对象输出流，并封装字节流
            ObjectOutputStream oos = new ObjectOutputStream(baos);
            // 将对象写入字节流
            oos.writeObject(mBean);
            // 将字节流编码成base64的字符窜
            String mBeanStr = new String(Base64.encodeBase64(baos.toByteArray()));
            //写入到本地
            ShareManager.setValue(mContext, Constant.USER_DETAIL_INFO, mBeanStr);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static UserDetailInfo getUserDetailInfo(Context mContext) {
        UserDetailInfo mBean = null;
        try {
            //读取本地缓存数据
            String userInfo = ShareManager.getValue(mContext, Constant.USER_DETAIL_INFO);
            //读取字节
            byte[] base64 = Base64.decodeBase64(userInfo.getBytes());
            //封装到字节流
            ByteArrayInputStream bais = new ByteArrayInputStream(base64);
            //再次封装
            ObjectInputStream bis = new ObjectInputStream(bais);
            //转换成对象
            mBean = (UserDetailInfo) bis.readObject();
        } catch (StreamCorruptedException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return mBean;
    }


    public static void setLatLng(Context mContext, LatLng lastLLatLng) {
        try {
            // 创建字节输出流
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            // 创建对象输出流，并封装字节流
            ObjectOutputStream oos = new ObjectOutputStream(baos);
            MyLatLng mMyLatLng = new MyLatLng();
            mMyLatLng.latitude = lastLLatLng.latitude;
            mMyLatLng.longitude = lastLLatLng.longitude;
            // 将对象写入字节流
            oos.writeObject(mMyLatLng);
            // 将字节流编码成base64的字符窜
            String mBeanStr = new String(Base64.encodeBase64(baos.toByteArray()));
            //写入到本地
            ShareManager.setValue(mContext, Constant.LAST_LATLNG, mBeanStr);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    public static LatLng getLatLng(Context mContext) {
        LatLng mBean = null;
        try {
            //读取本地缓存数据
            String userInfo = ShareManager.getValue(mContext, Constant.LAST_LATLNG);
            //读取字节
            byte[] base64 = Base64.decodeBase64(userInfo.getBytes());
            //封装到字节流
            ByteArrayInputStream bais = new ByteArrayInputStream(base64);
            //再次封装
            ObjectInputStream bis = new ObjectInputStream(bais);
            //转换成对象
            MyLatLng mMyLatLng = (MyLatLng) bis.readObject();
            mBean = new LatLng(mMyLatLng.latitude, mMyLatLng.longitude);
        } catch (StreamCorruptedException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return mBean;
    }
}

