import React, {
  FC,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
  memo,
} from 'react';
import { Toast } from 'antd-mobile';
import {
  getCurrentPosition,
  resetIframeViewPort,
  backIframeViewPort,
  getUserInfo,
} from '@/utils/index';

import IconCurrentPosition from '@/assets/images/map-current-position.png';
import IconInfoWindow from '@/assets/images/map-infowindow.png';
import styles from './index.less';

// const BMap = (window as any).BMap;
let mapView: any;
const curPosMarker = null;
let infoBox = null;
let mapLabels = [];
let mapStationLabels = [];
let drivingLine: { clearResults: () => void; search: (arg0: any, arg1: any) => void } | null = null;

interface InfoWindowProps {
  content?: string;
  offsetY?: number;
}

interface MapLableItemProps {
  lng?: string | number;
  lat?: string | number;
  content?: string; // 添加点的样式
  infoWindow?: InfoWindowProps; // null 点击不展示
  onClick?: (labelItem: MapLableItemProps) => void;
  offset?: [number | string, number | string];
}

interface IndexMapViewProps {
  labels?: Array<MapLableItemProps>;
  curPosition: MapLableItemProps; // 当前位置
  initialPosition: MapLableItemProps;
  zoom?: number | string;
  onMapClick?: (e: EventListener) => void; // 地图单击事件
  onDragendListener?: (center: any) => void; // 地图拖动事件

  id: string; // 组件id
  onError?: (err: any) => void; // 地图发生错误时调用
  onLabelClick?: (params: any) => void;
  labelsType?: string; // labels是否来源于首页
  stationLabels?: Array<MapLableItemProps>;
}

/**
 * 地图组件
 * @param param0
 */
const IndexMapView: FC<MapViewProps> = (
  {
    labels = [],
    curPosition,
    initialPosition,
    zoom = 16,
    onMapClick = () => {},
    onDragendListener = () => {},
    id,
    onError = () => {},
    onLabelClick = () => {},
    labelsType = '',
    stationLabels = [],
  },
  ref,
) => {
  // 隐藏提示信息
  const hiddenInfoWindow = () => {
    if (infoBox) {
      mapView.removeOverlay(infoBox);
    }
  };

  // 展示提示信息
  const showInfoWindow = (infoWinItem: MapLableItemProps) => {
    const {
      lng,
      lat,
      infoWindow: { content, offsetY = 0 },
    } = infoWinItem;
    // 先删除原来的
    hiddenInfoWindow();

    const html = `<div style="position:absolute;z-index:555;transform:translateX(-50%);">
        <div style="background-color: #373D52; height: 30px; border-radius:15px; padding: 0 7px; line-height:30px; color:#fff; font-size:12px">${content}</div>
        <div style="text-align:center; margin-top:-5px;">
          <img style="width:13px; height: 7px" src="${IconInfoWindow}" alt=""/>
        </div>
      </div>`;

    infoBox = new BMap.Label(html, {
      offset: new BMap.Size(0, offsetY - 30),
      position: new BMap.Point(lng, lat),
    });
    infoBox.setStyle({
      border: 'none',
      background: 'transparent',
    });
    mapView.addOverlay(infoBox);
  };

  /**
   * 渲染标记
   * @param param0
   */
  const renderMarker = (labelItem: MapLableItemProps) => {
    const { content = '', onClick = () => {}, lng, lat, offset } = labelItem;
    const label = new BMap.Label(content, {
      offset: new BMap.Size(offset[0], offset[1]),
      position: new BMap.Point(lng, lat),
    });

    label.setStyle({
      border: 'none',
      background: 'transparent',
    });

    if (onClick) {
      label.addEventListener('click', e => {
        if (e.domEvent) {
          e.domEvent.stopPropagation();
        }
        onClick(e);
      });
    }
    mapView.addOverlay(label);
    if (labelsType === 'indexMap') {
      mapStationLabels.push(label);
    }
    return label;
  };

  // 渲染当前位置
  const renderCurPosMarker = (lng = curPosition.lng, lat = curPosition.lat) => {
    if (curPosMarker) {
      mapView.removeOverlay(curPosMarker);
    }
    const point = new BMap.Point(lng, lat);

    if ((window as any).navigator.userAgent.toLowerCase().indexOf('android') > -1) {
      // android
      mapView.centerAndZoom(point, zoom);
    } else {
      mapView.setCenter(point);
    }

    // curPosMarker = renderMarker({
    //   content: `<img style='width: 30px;height: 30px' src='${IconCurrentPosition}'}/>`,
    //   offset: [-15, -30],
    //   lat,
    //   lng,
    //   onClick: e => {
    //     if (curPosition.onClick) {
    //       curPosition.onClick(e);
    //     }

    //     if (curPosition.infoWindow) {
    //       showInfoWindow({
    //         content: curPosition.infoWindow.content,
    //         offset: [-20, -60],
    //         lat,
    //         lng,
    //       });
    //     }
    //   },
    // });
  };

  const clearLabelOverlay = () => {
    if (labelsType === 'indexMap') {
      mapStationLabels.forEach(label => {
        mapView.removeOverlay(label);
      });
      mapStationLabels = [];
    }

    mapLabels.forEach(label => {
      mapView.removeOverlay(label);
    });
    mapLabels = [];
  };

  const renderOverlayView = (items: MapLableItemProps[]) => {
    try {
      clearLabelOverlay(); // 先清楚覆盖物
      items.forEach((label, index) => {
        (function() {
          renderMarker({
            ...label,
            onClick: () => {
              if (onLabelClick) {
                onLabelClick(label, index);
              }
              if (label.infoWindow) {
                showInfoWindow(label);
              }
            },
          });
        })();
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 渲染label图
  const renderLabels = () => {
    clearLabelOverlay(); // 先清楚覆盖物
    labels.forEach((label, index) => {
      (function() {
        renderMarker({
          ...label,
          onClick: () => {
            if (onLabelClick) {
              onLabelClick(label, index);
            }
            if (label.infoWindow) {
              showInfoWindow(label);
            }
          },
        });
      })();
    });
  };

  const renderStationLabels = () => {
    clearLabelOverlay(); // 先清楚覆盖物
    stationLabels.forEach((label, index) => {
      (function() {
        renderMarker({
          ...label,
          onClick: () => {
            if (onLabelClick) {
              onLabelClick(label, index);
            }
            if (label.infoWindow) {
              showInfoWindow(label);
            }
          },
        });
      })();
    });
  };

  // 获取当前位置
  const getCurrPosition = show => {
    // renderCurPosMarker();
    if (show) {
      Toast.loading('定位中...');
    }
    getCurrentPosition({
      success: cor => {
        Toast.hide();
        renderCurPosMarker(cor.longitude, cor.latitude);
        if (onDragendListener && typeof onDragendListener === 'function') {
          onDragendListener({ lng: cor.longitude, lat: cor.latitude });
        }
      },
      fail: () => {
        Toast.hide();
        Toast.info('当前位置获取失败');
      },
    });
  };

  // 获取当前位置
  const getRefreshCurrPosition = show => {
    // renderCurPosMarker();
    // if (show) {
    //   Toast.loading('刷新中...');
    // }
    getCurrentPosition({
      success: cor => {
        Toast.hide();
        renderCurPosMarker(cor.longitude, cor.latitude);
      },
      fail: () => {
        Toast.hide();
        Toast.info('当前位置获取失败');
      },
    });
  };

  // useEffect(() => {
  //   if (initialPosition && mapView) {
  //     const point = new BMap.Point(initialPosition.lat, initialPosition.lng);
  //     // // // 创建点坐标
  //     mapView.centerAndZoom(point, zoom);
  //   }

  // }, [initialPosition])

  /**
   * 地图初始化
   */
  // 初始化地图
  const mapInit = () => {
    try {
      const { cityName } = getUserInfo();
      mapView = new BMap.Map(id);
      console.log(cityName);
      mapView.centerAndZoom(cityName, zoom);

      if ((window as any).navigator.userAgent.toLowerCase().indexOf('android') === -1) {
        // 不是android
        const point = new BMap.Point(initialPosition.lat, initialPosition.lng);
        // 创建点坐标
        mapView.centerAndZoom(point, zoom);
      }
      // mapView.setMapStyleV2({
      //   styleId: 'f3a5a3eef7bae25c2fdce41ef50fa3c1',
      // });
      mapView.addEventListener('click', e => {
        //   Toast.info('地图点击');
        hiddenInfoWindow();
        showCurrentPoint(true);
        clearDirvingRoute();
        onMapClick(e);
      });

      mapView.addEventListener('dragend', e => {
        const center = mapView.getCenter();
        // 请求数据
        // renderCurPosMarker(center.lng ,center.lat);
        onDragendListener(center);
      });

      const tmpPoint = { x1: 0, y1: 0, x2: 0, y2: 0 };
      mapView.addEventListener('touchstart', evt => {
        // console.log(evt)
        // console.log('X:', evt.touches[0].clientX)
        tmpPoint.x1 = tmpPoint.x2 = evt.touches[0].clientX;
        // console.log('Y:', evt.touches[0].clientY)
        tmpPoint.y1 = tmpPoint.y2 = evt.touches[0].clientY;
      });
      mapView.addEventListener('touchmove', evt => {
        // console.log('X:', evt.touches[0].clientX)
        tmpPoint.x2 = evt.touches[0].clientX;
        // console.log('Y:', evt.touches[0].clientY)
        tmpPoint.y2 = evt.touches[0].clientY;
      });
      mapView.addEventListener('touchend', evt => {
        // 如果x轴或者y轴移动超过10px，那么认为是拖动，而不是点击（touch），使用绝对值保证左右上下移动都可以计算正确
        if (Math.abs(tmpPoint.x1 - tmpPoint.x2) < 10 || Math.abs(tmpPoint.y1 - tmpPoint.y2) < 10) {
          // Toast.info('点击了地图');
          // console.log(tmpPoint);
          hiddenInfoWindow();
          showCurrentPoint(true);
          clearDirvingRoute();
          onMapClick(evt);
        } else {
          // Toast.info('拖动了地图');
          // console.log(tmpPoint);
        }
      });

      setTimeout(() => {
        getCurrPosition();
      }, 200);
    } catch (error) {
      console.log('地图初始化失败');
      onError(error);
      Toast.fail('地图初始化失败');
    }
  };

  /**
   * 页面初始化
   */
  useEffect(() => {
    setTimeout(() => {
      mapInit();
    }, 300);
    setTimeout(() => {
      renderLabels();
    }, 300);
    resetIframeViewPort();
    return () => {
      backIframeViewPort();
    };
  }, []);
  useEffect(() => {
    const { cityName } = getUserInfo();
    //   renderStationLabels();
    renderLabels();
    // new BMap.Point(curPosition.lat, curPosition.lng);
    // if (curPosition.lat) {
    //   mapView.setCenter(new BMap.Point(curPosition.lat, curPosition.lng));
    //   if (labels.length > 50) {
    //     mapView.setZoom(9);
    //   } else {
    //     mapView.setZoom(11);
    //   }
    // } else if (labels.length > 50) {
    //   mapView.setCenter(cityName, 9);
    // } else {
    //   mapView.setCenter(cityName, 11);
    // }
  }, [labels]);

  const showCurrentPoint = (show: boolean) => {
    console.log(curPosMarker);
    try {
      if (curPosMarker) {
        curPosMarker.setStyle({ display: show ? 'block' : 'none' });
      }
    } catch (error) {}
  };

  const searchComplete = (results, endPoint) => {
    // showCurrentPoint(false);
    if (drivingLine.getStatus() !== 0) {
      return;
    }
    let result = '';
    let hours = 0;
    let min = 0;
    let second = 0;

    const plan = results.getPlan(0);
    const duration = plan.getDuration(false); // 获取时间
    // console.log('distance:', duration);
    hours = Math.floor(duration / 3600);
    min = Math.floor((duration - hours * 3600) / 60);
    second = Math.floor((duration - hours * 3600 - min * 60) / 60);
    if (hours) {
      result += `${hours}小时`;
    }
    if (!(hours === 0 && min === 0)) {
      result += `${min}分钟`;
    }
    if (second) {
      result += `${second}秒`;
    }
    const distance = plan.getDistance(true);

    result = `${distance}&nbsp;&nbsp;&nbsp;&nbsp;${result}`;

    showInfoWindow({
      lat: endPoint.lat,
      lng: endPoint.lng,
      infoWindow: { content: result, offsetY: -50 },
    });
  };

  const clearDirvingRoute = () => {
    if (drivingLine) {
      drivingLine.clearResults();
      const overLays = mapView.getOverlays();
      for (let i = 0; i < overLays.length; i += 1) {
        if (overLays[i].toString().indexOf('Polyline') > 0) {
          // 删除折线
          mapView.removeOverlay(overLays[i]);
        }
      }
    }
  };

  //  骑行规划路线
  const drivingRoute = (startPoint: any, endPoint: any) => {
    clearDirvingRoute();
    drivingLine = new BMap.DrivingRoute(mapView, {
      renderOptions: {
        map: mapView,
        autoViewport: true,
      },
      onSearchComplete: results => {
        searchComplete(results, endPoint);
      },
    });

    drivingLine.setPolylinesSetCallback(result => {
      // drivingLine.clearResults();//6.22屏蔽代码，解决路线规划不出现
      const points: any[] = [];
      result[0].Pq.map(item => {
        points.push(new BMap.Point(item.lng, item.lat));
      });
      const polyline = new BMap.Polyline(points, {
        strokeColor: 'rgba(53,99,245,1)',
        strokeWeight: 5,
        strokeOpacity: 0.8,
      }); // 创建折线
      mapView.addOverlay(polyline); // 增加折线
    });

    drivingLine.setMarkersSetCallback((points: []) => {
      const endPoint = points[1];
      const { marker } = endPoint;
      marker.remove();
    });
    drivingLine.search(startPoint, endPoint);
  };

  useImperativeHandle(
    ref,
    () => ({
      goCurrentPosition: show => {
        getCurrPosition(show);
      },

      setCenter: (lat: string | number, lng: string | number) => {
        mapView.setCenter(new BMap.Point(lng, lat));
      },
      getCenter: () => mapView.getCenter(),
      setCenterAndZoom: (cityName: string, zoom: number) => {
        mapView.centerAndZoom(cityName, zoom);
      },

      setZoom: (zooms: number) => {
        mapView.setZoom(zooms);
      },
      renderOverlayView: (labelItems: MapLableItemProps[]) => {
        renderOverlayView(labelItems);
      },
      clearLabelOverlay: () => {
        clearLabelOverlay();
      },
      refreshCurrentPosition: show => {
        getRefreshCurrPosition(show);
      },

      clearDirvingRoute: () => {
        clearDirvingRoute();
      },

      hiddenInfoWindow: () => {
        hiddenInfoWindow();
      },

      drivingRoute: (
        startPoint: { lng: number; lat: number },
        endPoint: { lng: number; lat: number },
      ) => {
        drivingRoute(
          new BMap.Point(startPoint.lng, startPoint.lat),
          new BMap.Point(endPoint.lng, endPoint.lat),
        );
      },
    }),
    [],
  );

  return (
    <div id={`indexMapWrapper${id}`} className={styles.mapContainer} ref={ref}>
      <div
        id={id}
        className={styles.mapWrapper}
        style={{
          // transform: `scale(${SCALE * 2})`,
          flex: 1,
          width: '100%',
          height: '100%',
        }}
      ></div>
      ;
    </div>
  );
};

export default memo(forwardRef(IndexMapView));
