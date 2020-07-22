# zr-virtual-list

React 长列表虚拟滚动

[English](./README.md) | 中文


## 依赖
React: 16.8.0+


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


## 用法

在线例子：[zr-virtual-list example](zero9527.github.io/zr-virtual-list)

组件：[example\List\index.tsx](./example/List/index.tsx)

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
