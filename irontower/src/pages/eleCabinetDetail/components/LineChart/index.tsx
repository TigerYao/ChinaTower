import F2 from '@antv/f2/lib/index-all';
import React, { useState } from 'react';
import { WingBlank } from 'antd-mobile';
import { px2hd } from '@/utils';
import styles from './index.less';
import moment from 'moment';
import insertCss from 'insert-css';

interface ReportPieProps {
  title: string;
  data: [];
  subTitle: string;
  porjTotal: number;
  lastSubTitle?: string;
  colors?: any;
  unit?: string;
  id?: string;
}
let chart;
const Page: React.FC<ReportPieProps> = props => {
  const { title, data = [], id } = props;
  const [toolsTips, setToolsTips] = useState<any>({
    opacity: 0,
  });
  const [tipsInfo, setTipsInfo] = useState<any>({});

  let maxCount:number;
  let maxHour;

  React.useEffect(() => {
    // if (!chart) {

    chart = new F2.Chart({ id, pixelRatio: window.devicePixelRatio });
    // }
    showAntvChart(chart);
    insertCss(`
        .chart-wrapper {
          position: relative;
        }
        .f2-tooltip {
          -moz-box-shadow: 1px 1px 0.5px 0.5px rgba(0, 0, 0, 0.3);
          -webkit-box-shadow: 1px 1px 0.5px 0.5px rgba(0, 0, 0, 0.3);
          box-shadow: 1px 1px 0.5px 0.5px rgba(0, 0, 0, 0.3);
          position: absolute;
          z-index: 99;
          background-color: #1890ff;
          padding: 5px;
          border-radius: 3px;
          text-align: center;
          width: 120px;
          opacity: 0;
        }
        .f2-tooltip:after {
          content: " ";
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid #1890ff;
          position: absolute;
          left: 50%;
          margin-left: -6px;
          bottom: -8px;
        }
        .f2-tooltip span {
          display: block;
          color: #fff;
        }
        .f2-tooltip span:nth-child(1) {
          font-size: 11px !important;
        }
        .f2-tooltip span:nth-child(2) {
          font-size: 13px !important;
        }
      `);
  }, [data]);

  const showAntvChart = chart => {
    chart.clear();

    data.forEach(item => {
      if (!maxCount) {
        maxCount = item.count;
      } else {
        if (maxCount < item.count) {
          maxCount = item.count;
          maxHour = item.hour;
        }
      }
    });
    /**
     * y轴
     */
    chart.axis('count', {
      grid: {
        stroke: '#00BF8F',
        style: {
          lineDash: [1, 1],
          // 圆点大小
          lineWidth: px2hd(2),
        },
      },
      label: function label(text, index, total) {
        const textCfg = {};

        if (index === 0) {
          textCfg.textAlign = 'right';
        }
        textCfg.fill = '#999999';
        textCfg.fontSize = px2hd(20);
        return textCfg;
      },
    });
    /**
     * x轴
     */
    chart.axis('hour', {
      grid: {
        stroke: '#00BF8F',
        style: {
          lineDash: [1, 1],
          // 圆点大小
          lineWidth: px2hd(2),
        },
      },

      label: function label(text, index, total) {
        const textCfg = {};
        textCfg.fill = '#999999';
        textCfg.fontSize = px2hd(20);
        const countText = text.length > 1 ? text + ':00' : '0' + text + ':00';
        textCfg.text = index === total - 1 || index % 4 === 0 ? countText : '';
        if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      },
    });

    chart.tooltip({
      custom: true,
      showCrosshairs: true,
      crosshairsStyle: {
        lineDash: [1, 1],
        stroke: '#FE5C56',
        lineWidth: px2hd(3),
      },
      showItemMarker: true, // 是否展示每条记录项前面的 marker
      itemMarkerStyle: {
        radius: 17,
        symbol: 'circle',
        lineWidth: px2hd(180),
        stroke: '#FE5C56',
      },
      showTooltipMarker: true, // 是否显示 tooltipMarker
      tooltipMarkerStyle: {
        fill: '#FE5C56', // 设置 tooltipMarker 的样式
        lineWidth: px2hd(20),
        stroke: '#FE5C56',
      },
      snap: true,
      onChange: function onChange(ev) {
        const tooltipEl = document.querySelector('#f2-tooltip');
        const currentData = ev.items[0];
        const text = currentData.origin.count;

        // data.forEach()

        setTipsInfo({
          hour: currentData.origin.hour,
          count: text,
          isHidden: maxCount !== text,
        });
        // tooltipEl.innerHTML = [
        //   "<span style='font-size:40px;color: #333333'>" + text + '</span>',
        //   "<span style='font-size:30px;color: #999999;'>次换电</span>",
        // ].join('');
        // tooltipEl.html([ '<span>' + currentData.origin.date + '</span>', '<span>Web Visits: <b>' + text + '</b></span>' ].join(''));

        setToolsTips({
          ...toolsTips,
          opacity: 1,
          left: currentData.x - tooltipEl.offsetWidth / 2 + 'px',
          top: currentData.y - tooltipEl.offsetHeight - 15 + 'px',
        });

        // tooltipEl.css({
        //   opacity: 1,
        //   left: canvasOffsetLeft + currentData.x - tooltipEl.outerWidth() / 2 + 'px',
        //   top: canvasOffsetTop + currentData.y - tooltipEl.outerHeight() - 15 + 'px'
        // });
      },
      onHide: function onHide() {
        setToolsTips({
          ...toolsTips,
          // opacity: 0,
        });
      },
    });

    chart.source(data, {
      hour: {
        type: 'linear',
        tickCount: data.length ,
      },
      count: {
        type: 'linear',
        tickCount: data.length > 5 ? 5 : data.length,
        //向下取整
        max:((Math.floor(Number(maxCount)/4)+1)*4),
      },
    });
    chart
      .line()
      .position('hour*count')
      .style({
        // stroke: '#00BF8F',
        stroke: 'l(0) 0:#ADE28F 0.5:#5CD18F 1:#00BF90',
        // 圆点大小
        lineWidth: px2hd(8),
      })
      .shape('smooth');

    chart
      .point()
      .position('hour*count')
      // 大小
      .size(10)
      .adjust('stack')
      .style('medalType', {
        lineWidth: px2hd(3),
        fill: '#fff',
        stroke: function stroke(val) {
          return '#00BF8F';
        },
      });

    chart.guide().point({
      position: [maxHour, maxCount],
      style: {
        fill: '#FE5C56',
        // lineWidth: px2hd(3),
        r: 10,
      },
    });

    chart
      .area()
      .position('hour*count')
      .color('#00BF8F')
      .shape('smooth');

    chart.render();
  };

  return (
    <div className={styles.reportPie}>
      {/* <WingBlank size="lg"> */}
      {/* <div className={styles.titleDiv}>
          <span className={styles.title}>{title}</span>
        </div> */}
      <div className={styles.chartDiv} style={{ position: 'relative', overflow: 'visible' }}>
        <div
          id="f2-tooltip"
          className={styles.toolTips}
          style={{
            ...toolsTips,
          }}
        >
          <div className={styles.hour}>
            {tipsInfo.hour}点
            <span className={styles.top} hidden={tipsInfo.isHidden}>
              最高峰
            </span>
          </div>
          <div className={styles.countDiv}>
            <div className={styles.count}>{tipsInfo.count}</div>
            <div className={styles.exchange}>次换电</div>
          </div>
        </div>
        <canvas id={id} />
      </div>
      {/* </WingBlank> */}
    </div>
  );
};

export default Page;
