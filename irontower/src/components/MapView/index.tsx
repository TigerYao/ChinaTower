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
import styles from './index.less';
import IconCurrentPosition from '@/assets/images/map-current-position.png';
import IconInfoWindow from '@/assets/images/map-infowindow.png';
import iconStart from '@/assets/images/icon-track-start.png';
import iconEnd from '@/assets/images/icon-track-end.png';

// const ONE_REM = parseInt(document.documentElement.style.fontSize || '100', 10) || 100;
// const SCALE = ONE_REM / 100;

const BMapGL = (window as any).BMap;
let mapView: any;
let curPosMarker = null;
let infoBox = null;
let mapLabels = [];
let startMarker: any = null;
let endMarker: any = null;
// let mapStationLabels = [];

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

interface MapPolylineProps {
  lng?: string | number;
  lat?: string | number;
}

interface MapViewProps {
  labels?: Array<MapLableItemProps>;
  curPosition: MapLableItemProps; // 当前位置
  zoom?: number | string;
  onMapClick?: (e: EventListener) => void; // 地图单击事件
  id: string; // 组件id
  onError?: (err: any) => void; // 地图发生错误时调用
  onLabelClick?: (params: any) => void;
  // labelsType?: string; // labels是否来源于首页
  // stationLabels?: Array<MapLableItemProps>;
  polylineList: Array<MapPolylineProps>;
  status: string; // 电池状态，0完成借还，1使用中
}

/**
 * 地图组件
 * @param param0
 */
const MapView: FC<MapViewProps> = (
  {
    labels = [],
    curPosition,
    zoom = 16,
    onMapClick = () => {},
    id,
    onError = () => {},
    onLabelClick = () => {},
    polylineList = [],
    status = '0',
    // labelsType = '',
    // stationLabels = [],
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

    const html = `<div style="transform:translateX(-50%);">
      <div style="background-color: #373D52; height: 30px; border-radius:15px; padding: 0 7px; line-height:30px; color:#fff; font-size:12px">${content}</div>
      <div style="text-align:center; margin-top:-5px;">
        <img style="width:13px; height: 7px" src="${IconInfoWindow}" alt=""/>
      </div>
    </div>`;

    infoBox = new BMapGL.Label(html, {
      offset: new BMapGL.Size(0, offsetY - 30),
      position: new BMapGL.Point(lng, lat),
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
    const label = new BMapGL.Label(content, {
      offset: new BMapGL.Size(offset[0], offset[1]),
      position: new BMapGL.Point(lng, lat),
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
    // if (labelsType === 'indexMap') {
    //   mapStationLabels.push(label);
    // }
    return label;
  };

  // 渲染当前位置
  const renderCurPosMarker = (lng = curPosition.lng, lat = curPosition.lat) => {
    if (curPosMarker) {
      mapView.removeOverlay(curPosMarker);
    }
    const point = new BMapGL.Point(lng, lat);
    mapView.setCenter(point);

    curPosMarker = renderMarker({
      content: `<img style='width: 30px;height: 30px' src='${IconCurrentPosition}'}/>`,
      offset: [-15, -30],
      lat,
      lng,
      onClick: e => {
        if (curPosition.onClick) {
          curPosition.onClick(e);
        }

        if (curPosition.infoWindow) {
          showInfoWindow({
            content: curPosition.infoWindow.content,
            offset: [-20, -60],
            lat,
            lng,
          });
        }
      },
    });
  };

  const clearLabelOverlay = () => {
    // if (labelsType === 'indexMap') {
    //   mapStationLabels.forEach(label => {
    //     mapView.removeOverlay(label);
    //   });
    //   mapStationLabels = [];
    // }

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

  // 渲染label图
  const renderPolyline = () => {
    const pointLineList: any[] = [];
    polylineList.forEach(item => {
      pointLineList.push(new BMapGL.Point(item.lng, item.lat));
    });
    console.log('polylineList======', polylineList);
    /* const pointLineList = [
      new BMapGL.Point(115.675369,37.772869),
      new BMapGL.Point(115.68498203710938,37.77341175361983),
      new BMapGL.Point(115.69459507421875,37.76906961310405),
      new BMapGL.Point(115.7138211484375,37.76798403813384)
    ]; */
    const polyline = new BMapGL.Polyline(pointLineList, {
      enableEditing: false, // 是否启用线编辑，默认为false
      enableClicking: true, // 是否响应点击事件，默认为true
      strokeWeight: '1', // 折线的宽度，以像素为单位
      strokeOpacity: 0.8, // 折线的透明度，取值范围0 - 1
      strokeColor: '#0091FF', // 折线颜色
    });

    /* mapView.addOverlay(polyline);
    mapView.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放 */

    const len = polylineList.length;
    mapView.removeOverlay(polyline);
    mapView.removeOverlay(startMarker);
    mapView.removeOverlay(endMarker);

    startMarker = null;
    endMarker = null;

    if (!len) {
      return;
    }
    const startPoint = {
      lng: polylineList[0].lng,
      lat: polylineList[0].lat,
    };
    let endPoint = null;
    if (len >= 2) {
      endPoint = {
        lng: polylineList[len - 1].lng,
        lat: polylineList[len - 1].lat,
      };
    }
    if (startPoint) {
      startMarker = renderMarker({
        ...startPoint,
        content: `<img src="${iconStart}" style="height:30px; width:30px" alt="" />`,
        offset: [-15, -30],
      });
      mapView.addOverlay(startMarker); // 起点
    }
    if (status === '0') {
      endMarker = renderMarker({
        ...endPoint,
        content: `<img src="${iconEnd}" style="height:30px; width:30px" alt="" />`,
        offset: [-15, -30],
      });
      mapView.addOverlay(endMarker); // 终点
    }
    mapView.addOverlay(polyline); // 增加折线
  };

  // const renderStationLabels = () => {
  //   clearLabelOverlay(); // 先清楚覆盖物
  //   stationLabels.forEach((label, index) => {
  //     (function() {
  //       renderMarker({
  //         ...label,
  //         onClick: () => {
  //           if (onLabelClick) {
  //             onLabelClick(label, index);
  //           }
  //           if (label.infoWindow) {
  //             showInfoWindow(label);
  //           }
  //         },
  //       });
  //     })();
  //   });
  // };

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
      },
      fail: () => {
        Toast.hide();
        Toast.info('当前位置获取失败');
      },
    });
  };

  /**
   * 地图初始化
   */
  // 初始化地图
  const mapInit = () => {
    try {
      // const geolocation = new BMapGL.Geolocation();
      // geolocation.getCurrentPosition(
      //   function(r) {
      //     console.log(r);
      //     // if (this.getStatus() == BMAP_STATUS_SUCCESS) {
      //     //   console.log(r);
      //     // }
      //     // else {
      //     //   alert('failed' + this.getStatus());
      //     // }
      //   },
      //   { enableHighAccuracy: true },
      // );
      const { cityName } = getUserInfo();
      mapView = new BMapGL.Map(id);

      mapView.centerAndZoom(cityName, zoom);
      const point = new BMapGL.Point(curPosition);
      // // 创建点坐标
      mapView.centerAndZoom(point, zoom);
      mapView.setMapStyleV2({
        styleId: 'f3a5a3eef7bae25c2fdce41ef50fa3c1',
      });
      mapView.addEventListener('click', e => {
        hiddenInfoWindow();
        onMapClick(e);
      });
      renderPolyline();
      setTimeout(() => {
        /* getCurrPosition(); */
        renderPolyline();
      }, 200);
    } catch (error) {
      onError(error);
      Toast.fail('地图初始化失败');
    }
  };

  /**
   * 页面初始化
   */
  useEffect(() => {
    mapInit();
    setTimeout(() => {
      renderLabels();
    }, 300);
    resetIframeViewPort();
    return () => {
      backIframeViewPort();
    };
  }, []);
  // useEffect(() => {
  //   const {cityName} = getUserInfo();

  //   renderStationLabels();
  //   // new BMapGL.Point(curPosition.lat, curPosition.lng);
  //   if(curPosition.lat) {
  //     mapView.setCenter(new BMapGL.Point(curPosition.lat, curPosition.lng));
  //     if (stationLabels.length > 50) {
  //       mapView.setZoom(9);
  //     } else {
  //       mapView.setZoom(11);
  //     }
  //   } else if (stationLabels.length > 50) {
  //     mapView.setCenter(cityName, 9);
  //   } else {
  //     mapView.setCenter(cityName, 11);
  //   }

  // }, [stationLabels]);

  useImperativeHandle(
    ref,
    () => {
      return {
        goCurrentPosition: show => {
          getCurrPosition(show);
        },

        setCenter: (lat: string | number, lng: string | number) => {
          mapView.setCenter(new BMapGL.Point(lng, lat));
        },
        setCenterAndZoom: (cityName: string, zoom: number) => {
          mapView.centerAndZoom(cityName, zoom);
        },

        setZoom: (zooms: number) => {
          mapView.setZoom(zooms);
        },
        renderOverlayView: (labelItems: MapLableItemProps[]) => {
          renderOverlayView(labelItems);
        },
      };
    },
    [],
  );

  return (
    <div id={`wrapper${id}`} className={styles.mapContainer} ref={ref}>
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

export default memo(forwardRef(MapView));
