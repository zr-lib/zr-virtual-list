import React, { useEffect, useRef, useState, useCallback } from 'react';
import useThrottle from '../../utils/useThrottle';
import useDebounce from '../../utils/useDebounce';
import './styles.css';

export interface VirtualListProps {
  itemKey: string; // 唯一 key
  dataList: any[]; // 列表数据
  children: (item: any, index: number) => React.ReactNode;
  defaultStartIndex?: number; // 默认开始切割的位置
  defaultScrollTop?: number; // 默认的滚动位置
  className?: string;
  renderCount?: number; // 一次渲染的数量
  onScroll?: (scrollTop: number) => void; // 滚动回调
  getScrollContainer?: () => HTMLElement; // 滚动容器，默认 window
  onStartIndexChange?: (index: number) => void; // 返回开始切割的位置
}

/**
 * 长列表虚拟滚动
 * @description 说明：每次只渲染 renderCount 的数量
 * @param {*} props.itemKey: string; // 唯一 key
 * @param {*} props.dataList: any[]; // 列表数据
 * @param {*} props.children: (item: any, index: number) => React.ReactNode;
 * @param {*} defaultStartIndex?: number; // 默认开始切割的位置
 * @param {*} defaultScrollTop?: number; // 默认的滚动位置
 * @param {*} className?: string;
 * @param {*} renderCount?: number; // 一次渲染的数量
 * @param {*} onScroll?: (scrollTop: number) => void; // 滚动回调
 * @param {*} getScrollContainer?: () => HTMLElement; // 滚动容器，默认 window
 * @param {*} onStartIndexChange?: (index: number) => void; // 返回开始切割的位置
 */
const VirtualList: React.FC<VirtualListProps> = ({
  itemKey,
  dataList,
  children,
  defaultStartIndex,
  defaultScrollTop,
  className = '',
  renderCount = 20,
  onScroll,
  getScrollContainer,
  onStartIndexChange,
}) => {
  const virtualList = useRef<HTMLDivElement>(null);
  const scrollContainer = useRef<HTMLElement>(null); // 滚动容器
  const placeholder = useRef<HTMLDivElement>(null); // 前面不显示部分的占位
  const startIndex = useRef(0); // 默认开始切割的位置
  const itemScrollHeight = useRef(0); // 每个item占据的平均高度
  const [renderedDataList, setRenderedDataList] = useState<any[]>([]); // 已渲染的部分

  if (dataList !== undefined && dataList !== null && !Array.isArray(dataList)) {
    console.warn('[list]不是数组！');
    return <p style={{ color: '#ff5722' }}>list不是数组！</p>;
  }

  useEffect(() => {
    if (Array.isArray(dataList)) {
      startIndex.current = startIndex.current || defaultStartIndex || 0;
      onRenderHandler();
      if (defaultScrollTop) {
        setTimeout(() => {
          scrollContainer.current.scrollTop = defaultScrollTop;
        }, 0);
      }
    }
  }, [dataList, defaultStartIndex, defaultScrollTop]);

  useEffect(() => {
    init();
    scrollListener('add');

    return () => {
      scrollListener('remove');
    };
  }, [dataList]);

  // 初始化
  const init = () => {
    scrollContainer.current = getScrollWrapper();
    startIndexChange(startIndex.current);
    setTimeout(() => {
      itemScrollHeight.current =
        scrollContainer.current.scrollHeight / renderCount;
    }, 0);
  };

  // 根据 startIndex 切割需要渲染的部分
  const onRenderHandler = useCallback(() => {
    setRenderedDataList(() => {
      const newList = dataList
        .slice(startIndex.current, startIndex.current + renderCount)
        .map((item, index) => ({
          ...item,
          index: startIndex.current + index,
        }));
      return newList;
    });
  }, [dataList, renderCount]);

  // 滚动容器
  const getScrollWrapper = () => {
    const scrollWrapper =
      getScrollContainer?.() ??
      (document.body.scrollTop ? document.body : document.documentElement);
    return scrollWrapper;
  };

  const scrollListener = (type: 'add' | 'remove') => {
    if (getScrollContainer) {
      scrollContainer.current[`${type}EventListener`](
        'scroll',
        scrollHandler,
        false
      );
    } else {
      window[`${type}EventListener`]('scroll', scrollHandler, false);
    }
  };

  const scrollHandler = () => {
    const { scrollTop } = getScrollWrapper();
    const allItems = document.querySelectorAll('.virtual-item-wrapper');
    const firstVisibleItem = Array.from(allItems).find(
      (item: HTMLDivElement) => item.offsetTop >= scrollTop
    );

    if (firstVisibleItem) {
      const _startIndex = firstVisibleItem.getAttribute('item-index');
      // placeholder.current.style.height = scrollTop + 'px';
      startIndexChange(Number(_startIndex));
    }

    onScrollChange(scrollTop);
  };

  const onScrollChange = useThrottle((_scrollTop: number) => {
    if (onScroll) onScroll(_scrollTop);
  });

  const startIndexChange = useCallback(
    (_startIndex: number) => {
      startIndex.current = _startIndex > 10 ? _startIndex - 10 : 0;
      virtualList.current.setAttribute('start-index', `${startIndex.current}`);
      onRenderHandler();
      if (onStartIndexChange) onStartIndexChange(startIndex.current);
    },
    [dataList, renderCount]
  );

  const getItemKey = useCallback(
    (item: any) => {
      return itemKey && item[itemKey] ? item[itemKey] : item.index;
    },
    [itemKey]
  );

  return (
    <div
      ref={virtualList}
      className={`zr-virtual-list ${className}`}
      item-key={itemKey}
      render-count={renderCount}
      data-length={dataList.length}
    >
      <div ref={placeholder} />
      {renderedDataList.map((item) => (
        <div
          key={getItemKey(item)}
          item-index={item.index}
          className="virtual-item-wrapper"
        >
          {children(item, item.index)}
        </div>
      ))}
    </div>
  );
};
export default VirtualList;
// export default React.memo(
//   VirtualList,
//   (prevProps: VirtualListProps, nextProps: VirtualListProps) => {
//     if (
//       prevProps.dataList.length !== nextProps.dataList.length ||
//       prevProps.dataList[0]?.index !== nextProps.dataList[0]?.index
//     ) {
//       return false;
//     }
//     return true;
//   }
// );
