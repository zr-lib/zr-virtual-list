import React, { useState, useEffect, useRef } from 'react';
import VirtualList from '../VirtualList';
import { KeepAliveAssist } from 'keep-alive-comp';
import './styles.css';
import useDebounce from '../../utils/useDebounce';

interface ListProps extends KeepAliveAssist {
  renderCount: number;
}

interface Item {
  id: string;
  count: number;
}

const List: React.FC<ListProps> = ({
  renderCount,
  beforeRouteLeave,
  stateRestore,
  scrollRestore,
  getKeepAlive,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTop = useRef(0);
  const defaultStartIndex = useRef(2);
  const [data, setData] = useState<any[] | undefined>([]);

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 10000; i++) {
      arr.push({ id: `id-${i}`, count: 0 });
    }
    setData(arr);
    restore();
  }, []);

  const restore = () => {
    const _scrollTop = scrollRestore();
    const _state = stateRestore();
    console.log(_scrollTop, _state);
    scrollTop.current = _scrollTop || 0;
    defaultStartIndex.current = _state?.startIndex || 0;
    setTimeout(() => {
      // document.body.scrollTop = _scrollTop;
      // document.documentElement.scrollTop = _scrollTop;
      scrollContainerRef.current.scrollTop = _scrollTop;
    }, 0);
  };

  const onScroll = (_scrollTop: number) => {
    scrollTop.current = _scrollTop;
    console.log(scrollTop.current);
    beforeRouteLeave(scrollTop.current, {});
  };

  const countHandler = (index: number, type: 'increment' | 'decrement') => {
    setData((prev) => {
      const newItem = {
        ...prev[index],
        count:
          type === 'increment' ? prev[index].count + 1 : prev[index].count - 1,
      };
      prev.splice(index, 1, newItem);
      return [...prev];
    });
  };

  const onStartIndexChange = useDebounce((index) => {
    console.log('index: ', index);
  });

  return (
    <div id="scroll-container" ref={scrollContainerRef}>
      <VirtualList
        itemKey="id"
        dataList={data}
        // renderCount={renderCount}
        // defaultStartIndex={defaultStartIndex.current}
        getScrollContainer={() => document.getElementById('scroll-container')}
        onScroll={onScroll}
        onStartIndexChange={onStartIndexChange}
      >
        {(item: Item, index) => (
          <div className={`item ${index % 2 === 0 ? 'item-2n' : ''}`}>
            <button onClick={() => console.log(item, index)}>item</button>
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
    </div>
  );
};

export default List;
