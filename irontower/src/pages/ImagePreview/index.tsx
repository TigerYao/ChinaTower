import React, { useState, FC, useEffect } from 'react';
import { ImagePreviewModelState, ConnectProps, connect } from 'alita';
import { Carousel } from 'antd-mobile';
import styles from './index.less';

interface PageProps extends ConnectProps {
  ImagePreview: ImagePreviewModelState;
}

const ImagePreviewPage: FC<PageProps> = ({ ImagePreview, dispatch, location }) => {
  const [picObj, setPicObj] = useState(JSON.parse(location.query.picObj));
  const [selectedIndex, setselectedIndex] = useState(location.query.selectedIndex);

  const [curIndex, setCurIndex] = useState(Number(selectedIndex) + 1);

  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'ImagePreview/query',
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = ImagePreview;
  return (
    <div className={styles.center}>
      {picObj.length > 1 ? (
        <div>
          <div className={styles.index}> {curIndex + '/' + picObj.length}</div>
          <div className={styles.bannerBox}>
            <Carousel
              autoplay
              infinite
              dots={false}
              selectedIndex={Number(selectedIndex)}
              afterChange={index => setCurIndex(index + 1)}
            >
              {picObj.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <img
                  src={item.fileUrl}
                  alt=""
                  key={index}
                  onClick={() => {
                    // router.push({
                    //   pathname: '/ImagePreview',
                    //   query: {
                    //     picObj,
                    //   },
                    // });
                    // ImagePreview.preview({ visible :{ isOpen }, images : getImageSet(),activeIndex:index,zIndex:index});
                  }}
                />
              ))}
            </Carousel>
          </div>
        </div>
      ) : (
        <div className={styles.singleImage}>
          {picObj.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <img
              src={item.fileUrl}
              alt=""
              key={index}
              onClick={() => {
                // router.push({
                //   pathname: '/ImagePreview',
                //   query: {
                //     picObj,
                //   },
                // });
                // ImagePreview.preview({ visible :{ isOpen }, images : getImageSet(),activeIndex:index,zIndex:index});
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default connect(({ ImagePreview }: { ImagePreview: ImagePreviewModelState }) => ({
  ImagePreview,
}))(ImagePreviewPage);
