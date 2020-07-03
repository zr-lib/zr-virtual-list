import React, { useEffect, useRef, useState } from 'react';
import useThrottle from '../../utils/useThrottle';
import useDebounce from '../../utils/useDebounce';
import './styles.css';

export interface VirtualListProps {
  itemKey: string; // 唯一 key
  dataList: any[]; // 列表数据
  children: (item: any, index: number) => React.ReactNode;
  pageSize?: number; // 分页一页的数量（分段切割的段长度）
  defaultPageIndex?: number; // 默认切割的位置
  className?: string;
  reachBottom?: number; // 到底部的距离，触发下次加载
  visibleHeight?: number; // 可视区域范围，默认三个屏幕高度（上中下各一屏）
  getScrollContainer?: () => HTMLElement; // 滚动容器，默认 window
  onScroll?: (scrollTop: number) => void; // 滚动回调
  onLoadMore?: (pageIndex: number) => void;
  onVisibleChange?: (indexs: number[]) => void; // 返回可见的index集合
}

/**
 * 长列表虚拟滚动
 * @param {*} props.itemKey: string; // 唯一 key
 * @param {*} props.dataList: any[]; // 列表数据
 * @param {*} props.children: (item: any, index: number) => React.ReactNode;
 * @param {*} props.pageSize?: number; // 分页一页的数量（分段切割的段长度）
 * @param {*} props.defaultPageIndex?: number; // 默认切割的位置
 * @param {*} props.className?: string;
 * @param {*} props.reachBottom?: number; // 到底部的距离，触发下次加载
 * @param {*} props.visibleHeight?: number; // 可视区域范围，默认三个屏幕高度（上中下各一屏）
 * @param {*} props.getScrollContainer?: () => HTMLElement; // 滚动容器，默认 window
 * @param {*} props.onScroll?: (scrollTop: number) => void; // 滚动回调
 * @param {*} props.onLoadMore?: (pageIndex: number) => void;
 * @param {*} props.onVisibleChange?: (indexs: number[]) => void; // 返回可见的index集合
 */
const VirtualList: React.FC<VirtualListProps> = ({
  itemKey,
  dataList,
  children,
  pageSize = 100,
  defaultPageIndex = 0,
  className = '',
  reachBottom = 200,
  visibleHeight = 0,
  getScrollContainer,
  onScroll,
  onLoadMore,
  onVisibleChange,
}) => {
  const scrollContainer = useRef<HTMLElement>(null); // 滚动容器
  const pageIndex = useRef(0); // 当前页码，总页数dataList/pageSize
  const visibleIndexs = useRef<number[]>([]); // 可见的index集合
  const prevVisibleIndexs = useRef<number[]>([]); // 上次可见的index集合
  const _visibleHeight = useRef(0); // 可见的高度
  const AllitemWrapper = useRef<NodeListOf<Element> | any[]>([]); // 所有的ItemWrapper
  const [renderedDataList, setRenderedDataList] = useState<any[]>([]); // 已渲染的部分

  if (dataList !== undefined && dataList !== null && !Array.isArray(dataList)) {
    console.warn('list不是数组！');
    return <p style={{ color: '#ff5722' }}>list不是数组！</p>;
  }

  useEffect(() => {
    scrollContainer.current = getScrollWrapper();

    _visibleHeight.current =
      visibleHeight ||
      scrollContainer.current.offsetHeight * 2 ||
      window.innerHeight * 2;
  }, []);

  useEffect(() => {
    if (Array.isArray(dataList)) {
      // 长度小于 segmentLength，直接渲染
      if (dataList.length < pageSize) {
        setRenderedDataList(dataList);
      } else {
        setRenderedDataList([]);
        pageIndex.current =
          defaultPageIndex < dataList.length / pageSize
            ? defaultPageIndex
            : dataList.length / pageSize;

        for (let i = 0; i < pageIndex.current + 1; i++) {
          segmentRender(i);
        }
      }
    }
  }, [dataList]);

  // 按分页长度分段渲染
  const segmentRender = (index: number) => {
    const addItems = dataList.slice(index * pageSize, (index + 1) * pageSize);
    setRenderedDataList((prev) => [...prev, addItems]);
    if (onLoadMore && index > 0) onLoadMore(index);
  };

  useEffect(() => {
    AllitemWrapper.current = document.querySelectorAll(
      '.zr-virtual-list .virtual-item-wrapper'
    );
    init();
    scrollListener('add');

    return () => {
      scrollListener('remove');
    };
  }, [renderedDataList]);

  // 初始化
  const init = () => {
    if (AllitemWrapper.current.length < pageSize) {
      setTimeout(() => {
        AllitemWrapper.current.forEach((el: Element) => {
          handlItemWrapper(el);
        });
      }, 0);
    } else {
      const addItemWrappers: any[] = Array.from(AllitemWrapper.current).slice(
        AllitemWrapper.current.length - pageSize,
        AllitemWrapper.current.length
      );
      setTimeout(() => {
        addItemWrappers.forEach((el) => {
          handlItemWrapper(el);
        });
      }, 0);
    }
  };

  const getScrollWrapper = () => {
    const scrollWrapper =
      getScrollContainer?.() ??
      (document.body.scrollTop ? document.body : document.documentElement);
    return scrollWrapper;
  };

  const scrollListener = (type: 'add' | 'remove') => {
    if (type === 'add') {
      if (getScrollContainer) {
        scrollContainer.current.addEventListener(
          'scroll',
          scrollHandler,
          false
        );
      } else {
        window.addEventListener('scroll', scrollHandler, false);
      }
    } else {
      if (getScrollContainer) {
        scrollContainer.current.removeEventListener(
          'scroll',
          scrollHandler,
          false
        );
      } else {
        window.removeEventListener('scroll', scrollHandler, false);
      }
    }
  };

  const scrollHandler = () => {
    const { scrollTop, clientHeight, scrollHeight } = getScrollWrapper();
    if (
      scrollHeight - clientHeight - scrollTop <= reachBottom &&
      pageIndex.current < dataList.length / pageSize
    ) {
      pageIndex.current = pageIndex.current + 1;
      segmentRender(pageIndex.current);
    }

    onVirtualScroll(scrollTop);
    onScrollChange(scrollTop);
  };

  // 元素滚动
  const onVirtualScroll = (_scrollTop: number) => {
    visibleIndexs.current = [];
    AllitemWrapper.current.forEach((el: Element) => {
      handlItemWrapper(el);
    });
  };

  // ItemWrapper处理
  const handlItemWrapper = (el: Element) => {
    const ioWrapper = new IntersectionObserver((entries) => {
      const wrapper = entries[0].target as HTMLDivElement;
      const wrapperClientHeight = wrapper?.clientHeight;

      const { top, bottom } = entries[0].boundingClientRect;

      if (
        entries[0].intersectionRatio > 0 ||
        (top > 0 && top < _visibleHeight.current) ||
        (bottom < 0 && bottom > -_visibleHeight.current)
      ) {
        wrapper.style.height = '';
        wrapper.classList.remove('hidden');
        const index = wrapper.getAttribute('item-index');
        if (!visibleIndexs.current.includes(Number(index))) {
          visibleIndexs.current.push(Number(index));
        }
      } else {
        wrapper.style.height = `${wrapperClientHeight}px`;
        wrapper.classList.add('hidden');
      }

      updateVisibleIndex();
      ioWrapper.unobserve(el);
    });
    setTimeout(() => ioWrapper.observe(el), 0);
  };

  // onVisibleChange
  const updateVisibleIndex = useDebounce(() => {
    visibleIndexs.current = visibleIndexs.current.sort((x, y) => x - y);
    // 有监听事件 + 长度大于0 + 与上次不同 => 执行回调
    if (
      onVisibleChange &&
      visibleIndexs.current.length &&
      visibleIndexs.current.join('') !== prevVisibleIndexs.current.join('')
    ) {
      onVisibleChange(visibleIndexs.current);
    }
    prevVisibleIndexs.current = visibleIndexs.current;
  });

  const onScrollChange = useThrottle((_scrollTop: number) => {
    if (onScroll) onScroll(_scrollTop);
  });

  // 获取item在dataList里的下标index
  const getRealIndex = (subIndex, index) => {
    return subIndex * pageSize + index;
  };

  return (
    <div className={`zr-virtual-list ${className}`}>
      {Array.isArray(renderedDataList) &&
        renderedDataList.map((subDataList, subIndex) =>
          subDataList.map((item, index) => (
            <div
              key={
                itemKey && item[itemKey]
                  ? item[itemKey]
                  : getRealIndex(subIndex, index)
              }
              item-index={getRealIndex(subIndex, index)}
              className="virtual-item-wrapper"
            >
              <div className="virtual-item-content">
                {children(item, getRealIndex(subIndex, index))}
              </div>
            </div>
          ))
        )}
    </div>
  );
};

export default VirtualList;
