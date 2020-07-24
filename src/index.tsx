import React, { useEffect, useRef, useState, useCallback } from 'react';
import { VirtualListProps } from './index.d';
import { isNumber, transform_scrollTop_itemIndex } from './utils';
import './styles.css';

/**
 * VirtualList 长列表虚拟滚动
 * @description 说明：每次只渲染 renderCount 的数量
 * @param {*} props.itemKey: string; // 唯一 key
 * @param {*} props.dataList: any[]; // 列表数据
 * @param {*} props.children: (item: any, index: number) => React.ReactNode;
 * @param {*} props.defaultStartIndex?: number; // 默认第一个可视的item下标
 * @param {*} props.defaultScrollTop?: number; // 默认的滚动位置
 * @param {*} props.className?: string;
 * @param {*} props.renderCount?: number; // 一次渲染的数量
 * @param {*} props.onScroll?: (scrollTop: number) => void; // 滚动回调
 * @param {*} props.getScrollContainer?: () => HTMLElement; // 滚动容器，默认 body/documentElement
 * @param {*} props.onStartIndexChange?: (visibleItemIndex: number, startIndex: number) => void; // startIndex 回调函数
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
  const scrollContainer = useRef<HTMLElement | null>(null); // 滚动容器
  const virtualList = useRef<HTMLDivElement | null>(null);
  const startIndex = useRef<number | undefined>(); // 开始切割的位置
  const _defaultStartIndex = useRef<number | undefined>(); // 上次的 defaultStartIndex
  const scrollTop = useRef<number | undefined>(); // 滚动位置
  const _defaultScrollTop = useRef<number | undefined>(); // 上次的 defaultScrollTop
  const itemScrollHeight = useRef(0); // 每个item占据的平均高度
  const placeholder1 = useRef<HTMLDivElement>(null); // 前占位
  const placeholder2 = useRef<HTMLDivElement>(null); // 后占位
  const [renderDataList, setRenderDataList] = useState<any[]>([]); // 已渲染的部分
  const initTimer = useRef<NodeJS.Timeout>();

  if (typeof children !== 'function') {
    console.error('[children] should be function!');
    return null;
  }

  if (!Array.isArray(dataList)) {
    console.error('[list] is not Array!');
    return null;
  }

  if (renderCount < 0) {
    console.error('[renderCount] can not less than 0!');
    return null;
  }

  useEffect(() => {
    if (renderCount < 10) console.warn('Suggest: [renderCount] >= 10');
  }, []);

  useEffect(() => {
    if (typeof defaultScrollTop === 'number') {
      scrollTop.current = defaultScrollTop;
    }
  }, [defaultScrollTop]);

  useEffect(() => {
    if (typeof defaultStartIndex === 'number') {
      startIndex.current = defaultStartIndex;
    }
  }, [defaultStartIndex]);

  useEffect(() => {
    if (Array.isArray(dataList)) {
      if (initTimer.current) clearTimeout(initTimer.current);
      initTimer.current = setTimeout(() => init(), 10);
    }

    return () => {
      scrollListener('remove');
    };
  }, [dataList, defaultStartIndex, defaultScrollTop, renderCount]);

  // 初始化
  const init = () => {
    scrollContainer.current = getScrollWrapper();
    // 方便后续计算 itemScrollHeight.current
    onRenderHandler(startIndex.current || 0);

    let offset = 0;
    if (!getScrollContainer && virtualList.current) {
      offset = virtualList.current.offsetTop;
    }
    itemScrollHeight.current =
      itemScrollHeight.current ||
      (scrollContainer.current?.scrollHeight! - offset) / renderCount;

    setScrollTopHandler();
    setPlaceholderHeight();
    scrollListener('add');
  };

  // 设置 scrollTop.current 逻辑
  const setScrollTopHandler = () => {
    // defaultScrollTop 是否变化
    const use_defaultScrollTop =
      isNumber(defaultScrollTop) &&
      _defaultScrollTop.current !== defaultScrollTop;

    // defaultStartIndex 是否变化
    const use_defaultStartIndex =
      isNumber(defaultStartIndex) &&
      _defaultStartIndex.current !== defaultStartIndex;

    _defaultScrollTop.current = defaultScrollTop;
    _defaultStartIndex.current = defaultStartIndex;

    // 首次渲染，如果 `defaultScrollTop`/`defaultStartIndex` 同时存在，
    // 优先使用 `defaultScrollTop`；之后使用变化的那个
    if (use_defaultScrollTop) {
      scrollTop.current = defaultScrollTop;
      // defaultScrollTop 转化为 itemIndex
      const transform_itemIndex = transform_scrollTop_itemIndex({
        itemScrollHeight: itemScrollHeight.current,
        scrollTop: defaultScrollTop,
      });
      startIndex.current = transform_itemIndex || 0;
      onRenderHandler(startIndex.current);
    } else if (use_defaultStartIndex) {
      // defaultStartIndex 转化为 scrollTop
      const transform_scrollTop = transform_scrollTop_itemIndex({
        itemScrollHeight: itemScrollHeight.current,
        startIndex: defaultStartIndex,
      });
      scrollTop.current = transform_scrollTop || 0;
    } else {
      scrollTop.current = scrollTop.current || 0;
    }

    // 设置滚动容器 scrollTop
    setTimeout(() => setContainerScrollTop(), 0);
  };

  // 根据 startIndex 切割需要渲染的部分
  const onRenderHandler = useCallback(
    (_startIndex: number) => {
      setRenderDataList(() => {
        return dataList
          .slice(_startIndex, _startIndex + renderCount)
          .map((item, index) => ({
            ...item,
            index: _startIndex + index,
          }));
      });
    },
    [dataList, renderCount]
  );

  // 滚动容器
  const getScrollWrapper = () => {
    if (!getScrollContainer) {
      return document.body.scrollTop ? document.body : document.documentElement;
    }
    if (getScrollContainer && !getScrollContainer()) {
      console.warn('[getScrollContainer] return an invalid Element!');
      return null;
    }
    return getScrollContainer();
  };

  // 设置滚动容器的 scrollTop
  const setContainerScrollTop = () => {
    if (!getScrollContainer) {
      document.body.scrollTop = scrollTop.current!;
      document.documentElement.scrollTop = scrollTop.current!;
    } else {
      scrollContainer.current!.scrollTop = scrollTop.current!;
    }
  };

  const scrollListener = (type: 'add' | 'remove') => {
    if (getScrollContainer) {
      if (!scrollContainer.current) return;
      scrollContainer.current![`${type}EventListener`](
        'scroll',
        scrollHandler,
        true
      );
    } else {
      window[`${type}EventListener`]('scroll', scrollHandler, true);
    }
  };

  const scrollHandler = () => {
    const scrollWrapper = getScrollWrapper();
    if (!scrollWrapper) return;

    const { scrollTop: _scrollTop } = scrollWrapper;
    scrollTop.current = _scrollTop;
    const transform_itemIndex = transform_scrollTop_itemIndex({
      itemScrollHeight: itemScrollHeight.current,
      scrollTop: _scrollTop,
    });
    startIndexChange(transform_itemIndex);
    if (onScroll) onScroll(_scrollTop);
  };

  const startIndexChange = (itemIndex: number) => {
    // itemIndex 往前推的数量
    const leftCount = Math.floor(renderCount / 4);
    if (itemIndex - leftCount === startIndex.current) return;

    startIndex.current = itemIndex > leftCount ? itemIndex - leftCount : 0;

    setPlaceholderHeight();
    onRenderHandler(startIndex.current);
    if (onStartIndexChange) onStartIndexChange(itemIndex, startIndex.current);
  };

  // 手动设置占位高度
  const setPlaceholderHeight = () => {
    if (!placeholder1.current || !placeholder2.current) return;
    placeholder1.current!.style.height = getPlaceholderHegiht('before') + 'px';
    placeholder2.current!.style.height = getPlaceholderHegiht('after') + 'px';
  };

  // 前后占位的高度
  const getPlaceholderHegiht = useCallback(
    (type: 'before' | 'after') => {
      const before =
        startIndex.current === 0
          ? 0
          : itemScrollHeight.current * startIndex.current!;
      if (type === 'before') return before > 0 ? before : 0;

      const after =
        itemScrollHeight.current * (dataList.length - renderCount) - before;
      return after > 0 ? after : 0;
    },
    [dataList, renderCount]
  );

  // 获取itemKey
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
      <div
        ref={placeholder1}
        className="placeholder"
        style={{ height: getPlaceholderHegiht('before') + 'px' }}
      />
      {renderDataList.map((item) => (
        <div
          key={getItemKey(item)}
          item-index={item.index}
          className="virtual-item-wrapper"
        >
          {children(item, item.index)}
        </div>
      ))}
      <div
        ref={placeholder2}
        className="placeholder"
        style={{ height: getPlaceholderHegiht('after') + 'px' }}
      />
    </div>
  );
};

VirtualList.displayName = 'VirtualList';

export default VirtualList;
