// @ts-nocheck

import React from 'react';
import { routes } from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/.umi/core/routes';
import { setLayoutInstance } from './KeepAliveModel';
const isKeepPath = (aliveList:any[],path:string)=>{
  let isKeep = false;
  aliveList.map(item=>{
    if(item === path){
      isKeep = true;
    }
    if(item instanceof RegExp && item.test(path)){
      isKeep = true;
    }
    if(typeof item === 'string' && item.toLowerCase() === path){
      isKeep = true;
    }
  })
  return isKeep;
}
const getKeepAliveViewMap = (routeList:any[],aliveList:any[])=>{
  let keepAliveMap = {};
  function find(routess: any[], list:any[]) {
    if(!routess|| !list ){
      return routess;
    }
    return routess.map(element => {
      if (!Array.isArray(element.routes)&&isKeepPath(list,element.path.toLowerCase())) {
        element.recreateTimes = 0;
        keepAliveMap[element.path.toLowerCase()] = element;
      }else{
        element.routes = find(element.routes,aliveList);
      }
      return element;
    });
  }
  find(routeList,aliveList)
  return keepAliveMap;
}

interface PageProps {
  location: {
    pathname: string;
  };
}
export default class BasicLayout extends React.PureComponent<PageProps> {
  constructor(props: any) {
    super(props);
    this.keepAliveViewMap = getKeepAliveViewMap(routes,props.keepalive);
  }
  componentDidMount() {
    setLayoutInstance(this);
  }

  keepAliveViewMap = {};

  alivePathnames: string[] = [];

  render() {
    const {
      location: { pathname },
    } = this.props;
    const showKeepAlive = !!this.keepAliveViewMap[pathname.toLowerCase()];
    if (showKeepAlive) {
      const index = this.alivePathnames.findIndex(
        tPathname => tPathname === pathname.toLowerCase(),
      );
      if (index === -1) {
        this.alivePathnames.push(pathname.toLowerCase());
      }
    }
    return (
      <>
        <div
          style={{ position: 'relative' }}
          hidden={!showKeepAlive}
          className="rumtime-keep-alive-layout"
        >
          {this.alivePathnames.map(curPathname => {
            const View = this.keepAliveViewMap[curPathname].component;
            return View ? (
              <div
                id={`BasicLayout-${curPathname}`}
                key={
                  curPathname + this.keepAliveViewMap[curPathname].recreateTimes
                }
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                }}
                hidden={curPathname !== pathname.toLowerCase()}
              >
                <View {...this.props} />
              </div>
            ) : null;
          })}
        </div>
        <div hidden={showKeepAlive} className="rumtime-keep-alive-layout-no">
          {!showKeepAlive && this.props.children}
        </div>
      </>
    )
  }
}
