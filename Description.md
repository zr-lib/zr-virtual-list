# zr-virtual-list 长列表虚拟滚动

React 长列表虚拟滚动

## 依赖
React: 16.8.0+

源码使用了 `React Hook`

## 下载

```
npm i zr-virtual-list
```


## 参数

首次渲染，如果 `defaultScrollTop`/`defaultStartIndex` 同时存在，优先使用 `defaultScrollTop`；之后使用变化的那个

- itemKey: string; // 唯一 key
- dataList: any[]; // 列表数据
  children: (item: any, index: number) => React.ReactNode;
- defaultStartIndex?: number; // 默认开始切割的位置
- defaultScrollTop?: number; // 默认的滚动位置
- className?: string;
- renderCount?: number; // 一次渲染的数量
- onScroll?: (scrollTop: number) => void; // 滚动回调
- getScrollContainer?: () => HTMLElement; // 滚动容器，默认 body
- onStartIndexChange?: (visibleItemIndex: number, startIndex: number) => void; // 返回开始切割的位置

```typescript
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
  onStartIndexChange?: (visibleItemIndex: number, startIndex: number) => void; // 返回开始切割的位置
}
```


## 实现

### 渲染结构
#### 前占位、后占位

1. 前占位

    根据 `startIndex` 与 `item的平均高度` 算出来的

2. 后占位

```ts
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
```

#### 渲染的内容

> 经过小测，`renderCount` 为 20 时，大概快速滑动（手机端，每秒50个左右吧，电脑上鼠标拉着滚动条滑动还没出现过），偶尔会出现轻微的空白问题，可以接受，通过设置 `renderCount` 也可以改善

- 根据 `defaultStartIndex`/`defaultScrollTop` 渲染 `renderCount` 的数量；

- 通过 `transform_scrollTop_itemIndex` 方法转换得到 `scrollTop`/`itemIndex`，然后 `onRenderHandler` 方法渲染，再接着设置滚动容器的 `scrollTop`；

- 首次渲染，将 `startIndex` 的那个 `item` 显示在顶部，为了防止快速滑动导致的空白问题，

```ts
const scrollHandler = () => {
  const { scrollTop: _scrollTop } = getScrollWrapper();
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

  virtualList.current!.scrollTop = scrollTop.current!;
  startIndex.current = itemIndex > leftCount ? itemIndex - leftCount : 0;

  setPlaceholderHeight();
  onRenderHandler(startIndex.current);
  if (onStartIndexChange) onStartIndexChange(startIndex.current, itemIndex);
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
```

### 滚动与显示

1. 根据 **滚动位置** `scrollTop`，获取对应的 `itemIndex`（在`dataList`里的序号）
2. 根据 `itemIndex`（在 `dataList` 里的下标），获取对应的 **滚动位置** `scrollTop`

```ts
// 获取对应的数值 scrollTop=>itemIndex，startIndex=>scrollTop，
// 优先 scrollTop
export function transform_scrollTop_itemIndex({
  itemScrollHeight,
  scrollTop: _scrollTop,
  startIndex: _startIndex,
}: TransformProps) {
  if (_scrollTop !== undefined && _startIndex !== undefined) {
    console.log('优先使用[scrollTop]');
  }
  if (typeof _scrollTop === 'number') {
    // 获取itemIndex
    const itemIndex = Math.floor(_scrollTop / itemScrollHeight);
    return itemIndex;
  } else {
    // 获取scrollTop
    const scrollTop = Math.floor(itemScrollHeight * _startIndex!);
    return scrollTop;
  }
}
```

### 默认值与状态恢复

首次渲染，如果 `defaultScrollTop`/`defaultStartIndex` 同时存在，优先使用 `defaultScrollTop`；之后使用变化的那个

```ts
// 设置处理 scrollTop.current
const setScrollTopHandler = () => {
  // defaultScrollTop 是否变化
  const use_defaultScrollTop =
    isNumber(defaultScrollTop) &&
    _defaultScrollTop.current !== defaultScrollTop;

  // defaultStartIndex 是否变化
  const use_defaultStartIndex =
    isNumber(defaultStartIndex) &&
    _defaultStartIndex.current !== defaultStartIndex;

  // 首次渲染，如果 `defaultScrollTop`/`defaultStartIndex` 同时存在，
  // 优先使用 `defaultScrollTop`；之后使用变化的那个
  if (use_defaultScrollTop) {
    _defaultScrollTop.current = defaultScrollTop;
    scrollTop.current = defaultScrollTop;
  } else if (use_defaultStartIndex) {
    _defaultStartIndex.current = defaultStartIndex;

    // defaultStartIndex 转化为 scrollTop
    const transform_scrollTop = transform_scrollTop_itemIndex({
      itemScrollHeight: itemScrollHeight.current,
      startIndex: defaultStartIndex,
    });
    scrollTop.current = transform_scrollTop || 0;
  } else {
    scrollTop.current = scrollTop.current || 0;
  }
};
```

### 


## 用法

在线例子：[zr-virtual-list example](zero9527.github.io/zr-virtual-list)

组件：[example\List\index.tsx]("./example/List/index.tsx")

```jsx
// example\List\index.tsx
import React, { useState, useEffect, useRef } from 'react';
import VirtualList from 'zr-virtual-list';
import RadioGroup from '../RadioGroup';
import './styles.less';

interface ListProps {}

interface Item {
  id: string;
  count: number;
}

const countList = [10, 20, 50, 100, 500, 3000];
const indexList = [undefined, 0, 6, 21, 112, 666, 2345];
const scrollList = [undefined, 0, 100, 1800, 8888, 22000];

const List: React.FC<ListProps> = () => {
  const [data, setData] = useState<any[]>([]);
  const scrollTop1 = useRef<number | undefined>();
  const [visible, setVisible] = useState(true);
  const [renderCount, setRenderCount] = useState(20);
  const [defaultStartIndex, setDefaultStartIndex] = useState<
    number | undefined
  >(666);
  const [defaultScrollTop, setDefaultScrollTop] = useState<number | undefined>(
    100
  );

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 10000; i++) {
      arr.push({ id: `id-${i}`, count: 0 });
    }
    setData(arr);
  }, []);

  useEffect(() => {
    if (visible && scrollTop1.current) {
      setDefaultScrollTop(scrollTop1.current);
    }
  }, [visible]);

  useEffect(() => {
    if (defaultScrollTop === undefined) {
      scrollTop1.current = undefined;
    }
  }, [defaultScrollTop]);

  const onScroll = (_scrollTop: number) => {
    console.log(_scrollTop);
    scrollTop1.current = _scrollTop;
  };

  const countHandler = (index: number, type: 'increment' | 'decrement') => {
    setData((prev) => {
      const newItem = {
        ...prev![index],
        count:
          type === 'increment'
            ? prev![index].count + 1
            : prev![index].count - 1,
      };
      prev!.splice(index, 1, newItem);
      return [...prev!];
    });
  };

  const onStartIndexChange = (index: number) => {
    // console.log('index: ', index);
  };

  const onVisibleChange = () => {
    setVisible(!visible);
  };

  return (
    <>
      <p>dataLength: {data.length}</p>
      <RadioGroup
        name="renderCount"
        value={renderCount}
        setValue={setRenderCount}
        dataList={countList}
      />
      <RadioGroup
        name="defaultStartIndex"
        value={defaultStartIndex}
        setValue={setDefaultStartIndex}
        dataList={indexList}
      />
      <RadioGroup
        name="defaultScrollTop"
        value={defaultScrollTop}
        setValue={setDefaultScrollTop}
        dataList={scrollList}
      />
      <p>
        <button onClick={onVisibleChange}>
          {visible ? 'Hide List' : 'Show List'}
        </button>
      </p>
      {visible && (
        <VirtualList
          itemKey="id"
          className="scroll-container"
          dataList={data}
          renderCount={renderCount}
          defaultScrollTop={defaultScrollTop}
          defaultStartIndex={defaultStartIndex}
          getScrollContainer={() =>
            document.querySelector('.scroll-container')! as HTMLElement
          }
          onScroll={onScroll}
          onStartIndexChange={onStartIndexChange}
        >
          {(item: Item, index) => (
            <div className={`item ${index % 2 === 0 ? 'item-2n' : ''}`}>
              <p>
                <button onClick={() => countHandler(index, 'decrement')}>
                  count--
                </button>
                &nbsp;
                <button onClick={() => countHandler(index, 'increment')}>
                  count++
                </button>
              </p>
              <p>id: {item.id}</p>
              <p>count: {item.count}</p>
            </div>
          )}
        </VirtualList>
      )}
    </>
  );
};

export default List;
```
