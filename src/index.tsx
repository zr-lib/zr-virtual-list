import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import useThrottle from './utils/useThrottle';
import './styles.css';

interface TransformProps {
  startIndex?: number;
  scrollTop?: number;
}

export interface VirtualListProps {
  itemKey: string; // 唯一 key
  dataList: any[]; // 列表数据
  children: (item: any, index: number) => React.ReactNode;
  defaultStartIndex?: number; // 默认开始切割的位置
  defaultScrollTop?: number; // 默认的滚动位置
  className?: string;
  renderCount?: number; // 一次渲染的数量
  onScroll?: (scrollTop: number) => void; // 滚动回调
  getScrollContainer?: () => HTMLElement; // 滚动容器，默认 body
  onStartIndexChange?: (index: number) => void; // 返回开始切割的位置
}

/**
 * 长列表虚拟滚动
 * @description 说明：每次只渲染 renderCount 的数量
 * @param {*} props.itemKey: string; // 唯一 key
 * @param {*} props.dataList: any[]; // 列表数据
 * @param {*} props.children: (item: any, index: number) => React.ReactNode;
 * @param {*} props.defaultStartIndex?: number; // 默认开始切割的位置
 * @param {*} props.defaultScrollTop?: number; // 默认的滚动位置
 * @param {*} props.className?: string;
 * @param {*} props.renderCount?: number; // 一次渲染的数量
 * @param {*} props.onScroll?: (scrollTop: number) => void; // 滚动回调
 * @param {*} props.getScrollContainer?: () => HTMLElement; // 滚动容器，默认 window
 * @param {*} props.onStartIndexChange?: (index: number) => void; // 返回开始切割的位置
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
  const startIndex = useRef(0); // 开始切割的位置
  const scrollTop = useRef(0); // 滚动位置
  const itemScrollHeight = useRef(0); // 每个item占据的平均高度
  const placeholder1 = useRef<HTMLDivElement>(null); // 前占位
  const placeholder2 = useRef<HTMLDivElement>(null); // 后占位
  const [renderDataList, setRenderDataList] = useState<any[]>([]); // 已渲染的部分

  if (!Array.isArray(dataList)) {
    console.warn('[list] is not Array!');
    return <p style={{ color: '#ff5722' }}>[list] is not Array!</p>;
  }

  if (renderCount < 0) {
    console.warn('[renderCount] can not less than 0!');
    return (
      <p style={{ color: '#ff5722' }}>[renderCount] can not less than 0!</p>
    );
  }

  useEffect(() => {
    if (renderCount < 10) console.warn('建议[renderCount] >= 10');
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

  useLayoutEffect(() => {
    if (Array.isArray(dataList)) {
      init();
      onRenderHandler(startIndex.current);
      scrollListener('add');
    }

    return () => {
      scrollListener('remove');
    };
  }, [dataList, defaultStartIndex, defaultScrollTop, renderCount]);

  // 初始化
  const init = () => {
    scrollContainer.current = getScrollWrapper();
    setTimeout(() => {
      itemScrollHeight.current =
        itemScrollHeight.current ||
        scrollContainer.current?.scrollHeight! / renderCount;

      // 优先 startIndex
      scrollTop.current = startIndex.current
        ? transform_scrollTop_startIndex({
            startIndex: startIndex.current,
          })
        : scrollTop.current || defaultScrollTop || 0;

      // onRenderHandler(startIndex.current);
      setPlaceholderHeight();
      scrollContainer.current!.scrollTop = scrollTop.current;
    }, 0);
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

  // 获取对应的数值 scrollTop <=> startIndex，优先 startIndex
  const transform_scrollTop_startIndex = ({
    scrollTop: _scrollTop,
    startIndex: _startIndex,
  }: TransformProps) => {
    if (_scrollTop !== undefined && _startIndex !== undefined) {
      console.log('优先使用[startIndex]');
    }
    if (typeof _startIndex === 'number') {
      // 获取scrollTop
      const scrollTop = Math.floor(itemScrollHeight.current * _startIndex);
      return scrollTop;
    } else {
      // 获取itemIndex
      const itemIndex = Math.floor(_scrollTop! / itemScrollHeight.current);
      return itemIndex;
    }
  };

  // 滚动容器
  const getScrollWrapper = () => {
    const scrollWrapper =
      getScrollContainer?.() ??
      (document.body.scrollTop ? document.body : document.documentElement);
    return scrollWrapper;
  };

  const scrollListener = (type: 'add' | 'remove') => {
    if (getScrollContainer) {
      scrollContainer.current![`${type}EventListener`](
        'scroll',
        scrollHandler,
        false
      );
    } else {
      window[`${type}EventListener`]('scroll', scrollHandler, false);
    }
  };

  const scrollHandler = () => {
    const { scrollTop: _scrollTop } = getScrollWrapper();
    scrollTop.current = _scrollTop;
    const itemIndex = transform_scrollTop_startIndex({ scrollTop: _scrollTop });
    startIndexChange(itemIndex);
    onScrollChange(_scrollTop);
  };

  const onScrollChange = useThrottle((_scrollTop: number) => {
    if (onScroll) onScroll(_scrollTop);
  });

  const startIndexChange = (itemIndex: number) => {
    // itemIndex 往前推的数量
    const leftCount = Math.floor(renderCount / 4);
    if (itemIndex - leftCount === startIndex.current) return;

    startIndex.current = itemIndex > leftCount ? itemIndex - leftCount : 0;

    setPlaceholderHeight();
    onRenderHandler(startIndex.current);
    if (onStartIndexChange) onStartIndexChange(startIndex.current);
  };

  // 手动设置占位高度
  const setPlaceholderHeight = () => {
    placeholder1.current!.style.height = getPlaceholderHegiht('before') + 'px';
    placeholder2.current!.style.height = getPlaceholderHegiht('after') + 'px';
  };

  // 前后占位的高度
  const getPlaceholderHegiht = useCallback(
    (type: 'before' | 'after') => {
      const before =
        startIndex.current === 0
          ? 0
          : itemScrollHeight.current * startIndex.current;
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

export default VirtualList;
