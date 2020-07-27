# zr-virtual-list 

React Virtual scrolling of long lists

English | [中文](./README_zh.md)


## Dependencies
React: 16.8.0+


## Install

```
npm i zr-virtual-list
```


## Params
For the first rendering, if `defaultScrollTop`/`defaultStartIndex` exists at the same time, `defaultScrollTop` is used first; after that, the changed one is used

- itemKey: string; // unique key
- dataList: any[]; // data for VirtualList
  children: (item: any, index: number) => React.ReactNode;
- defaultStartIndex?: number; // the first visible item index by default
- defaultScrollTop?: number; // default scrollTop
- className?: string;
- renderCount?: number; // number of renders at one time
- onScroll?: (scrollTop: number) => void; // scroll callback
- getScrollContainer?: () => HTMLElement; // scroll container, default body
- onStartIndexChange?: (visibleItemIndex: number, startIndex: number) => void; // startIndex change callback

```typescript
export interface VirtualListProps {
  itemKey: string; // unique key
  dataList: any[]; // data for VirtualList
  children: (item: any, index: number) => React.ReactNode;
  defaultStartIndex?: number; // the first visible item index by default
  defaultScrollTop?: number; // default scrollTop
  className?: string;
  renderCount?: number; // number of renders at one time
  onScroll?: (scrollTop: number) => void; // scroll callback
  getScrollContainer?: () => HTMLElement; // scroll container, default body
  onStartIndexChange?: (visibleItemIndex: number, startIndex: number) => void; // startIndex change callback
}
```


## Usage

online example: [zr-virtual-list example](https://zero9527.github.io/zr-virtual-list)

component: [example\List\index.tsx](./example/List/index.tsx)


```jsx
// example\List\index.tsx
import React, { useState, useEffect, useRef } from 'react';
import VirtualList from 'zr-virtual-list';
// import VirtualList from '../src';
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
    0
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

  const onStartIndexChange = (visibleItemIndex: number, startIndex: number) => {
    console.log(visibleItemIndex, startIndex);
  };

  const onVisibleChange = () => {
    setVisible(!visible);
  };

  return (
    <>
      <div className="header">
        <h2 className="title">zr-virtual-list example</h2>
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
      </div>
      {visible && (
        <VirtualList
          itemKey="id"
          className="scroll-container"
          dataList={data}
          renderCount={renderCount}
          defaultScrollTop={defaultScrollTop}
          defaultStartIndex={defaultStartIndex}
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
