// @ts-nocheck
import React from 'react';

const KeepAliveLayout = (props:any) => {
  return React.createElement(require('./KeepAliveLayout').default, {
    keepalive:['/index'],
    ...props
  })
}
export {KeepAliveLayout}
