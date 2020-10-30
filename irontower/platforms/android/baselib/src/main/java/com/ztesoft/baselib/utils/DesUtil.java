package com.ztesoft.baselib.utils;

import android.annotation.SuppressLint;
import android.util.Base64;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;

/**
 * @author 博森
 * @ClassName: DesUtil
 * @Description: DES加密解密类
 * @date 2015年5月26日 下午5:55:43
 */
public class DesUtil {

  /**
   * . DES 默认key
   */
  private static final String DEFAULT_KEY = "LQ{OP}?K";

  /**
   * @param dataSource 加密数据
   * @return 加密后数据 .
   * @Title: encode
   * @Description: DES加密 默认key
   * @author ys
   * @date 2015年5月26日 下午5:56:01
   */
  public static String encode(Object dataSource) {
    return encode(dataSource, DEFAULT_KEY);
  }

  /**
   * @param dataSource 目标数据
   * @param desKey     加密key
   * @return 机密后数据 .
   * @Title: encode
   * @Description: DES加密
   * @author 博森
   * @date 2015年5月26日 下午5:57:02
   */
  @SuppressLint("TrulyRandom")
  public static String encode(Object dataSource, String desKey) {
    if (dataSource != null && desKey != null) {
      try {
        byte[] rawKeyData = desKey.getBytes("UTF-8");
        // DES算法要求有一个可信任的随机数源
        // SecureRandom sr = new SecureRandom();
        // 从原始密匙数据创建一个DESKeySpec对象
        DESKeySpec dks = new DESKeySpec(rawKeyData);
        // 创建一个密匙工厂，然后用它把DESKeySpec转换成一个SecretKey对象
        SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
        SecretKey key = keyFactory.generateSecret(dks);
        // Cipher对象实际完成加密操作
        Cipher cipher = Cipher.getInstance("DES");
        // 用密匙初始化Cipher对象
        cipher.init(Cipher.ENCRYPT_MODE, key);
        // 现在，获取数据并加密
        String str = String.valueOf(dataSource);
        byte[] encryptedData = cipher.doFinal(str.getBytes("UTF-8"));
        return Base64.encodeToString(encryptedData, Base64.DEFAULT);
      } catch (UnsupportedEncodingException e) {
        e.printStackTrace();
      } catch (InvalidKeyException e) {
        e.printStackTrace();
      } catch (NoSuchAlgorithmException e) {
        e.printStackTrace();
      } catch (InvalidKeySpecException e) {
        e.printStackTrace();
      } catch (NoSuchPaddingException e) {
        e.printStackTrace();
      } catch (IllegalBlockSizeException e) {
        e.printStackTrace();
      } catch (BadPaddingException e) {
        e.printStackTrace();
      }
    }
    return null;
  }

  /**
   * @param dataSource 目标数据
   * @return 解密后数据 .
   * @Title: decode
   * @Description: DES解密 默认key
   * @author 博森
   * @date 2015年5月26日 下午5:57:45
   */
  public static String decode(String dataSource) {
    return decode(dataSource, DEFAULT_KEY);
  }

  /**
   * @param dataSource 目标数据
   * @param desKey     解密key
   * @return 解密数据 .
   * @Title: decode
   * @Description: DES解密
   * @author ys
   * @date 2015年5月26日 下午5:58:20
   */
  public static String decode(String dataSource, String desKey) {
    if (dataSource != null && desKey != null) {
      try {
        // DES算法要求有一个可信任的随机数源
        byte[] rawKeyData = desKey.getBytes("UTF-8");
        // SecureRandom sr = new SecureRandom();
        // 从原始密匙数据创建一个DESKeySpec对象
        DESKeySpec dks = new DESKeySpec(rawKeyData);
        // 创建一个密匙工厂，然后用它把DESKeySpec对象转换成一个SecretKey对象
        SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
        SecretKey key = keyFactory.generateSecret(dks);
        // Cipher对象实际完成解密操作
        Cipher cipher = Cipher.getInstance("DES");
        // 用密匙初始化Cipher对象
        cipher.init(Cipher.DECRYPT_MODE, key);
        // 正式执行解密操作
        byte[] decryptedData = cipher.doFinal(Base64.decode(dataSource, Base64.DEFAULT));
        return new String(decryptedData);
      } catch (UnsupportedEncodingException e) {
        e.printStackTrace();
      } catch (InvalidKeyException e) {
        e.printStackTrace();
      } catch (NoSuchAlgorithmException e) {
        e.printStackTrace();
      } catch (InvalidKeySpecException e) {
        e.printStackTrace();
      } catch (NoSuchPaddingException e) {
        e.printStackTrace();
      } catch (IllegalBlockSizeException e) {
        e.printStackTrace();
      } catch (BadPaddingException e) {
        e.printStackTrace();
      }
    }
    return null;
  }

}
