package com.ztesoft.baselib.utils;

import android.os.CountDownTimer;

/**
 * @User: ys
 * @Date: 2015-06-08 15:38
 * @Desc: desc
 */
public class AdornTimer extends CountDownTimer {

  private ITimerListener timerListener;

  public AdornTimer(long seconds) {
    super(seconds * 1000, 1000);
  }

  @Override
  public void onFinish() {
    timerListener.onFinish();
  }

  @Override
  public void onTick(long millisUntilFinished) {
    timerListener.onTick(millisUntilFinished / 1000);
  }

  public ITimerListener getTimerListener() {
    return timerListener;
  }

  public void setTimerListener(ITimerListener timerListener) {
    this.timerListener = timerListener;
  }


  public interface ITimerListener {

    void onFinish();

    void onTick(long seconds);
  }
}
