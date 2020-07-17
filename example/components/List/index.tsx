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
  const [scrollTop, setScrollTop] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
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
    setScrollTop(_scrollTop || 0);
    setStartIndex(_state?.startIndex || 0);
  };

  const onScroll = (_scrollTop: number) => {
    setScrollTop(_scrollTop);
    beforeRouteLeave(_scrollTop, {});
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
    <VirtualList
      itemKey="id"
      className="scroll-container"
      dataList={data}
      renderCount={renderCount}
      defaultScrollTop={scrollTop}
      defaultStartIndex={startIndex}
      getScrollContainer={() => document.querySelector('.scroll-container')}
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
  );
};

export default List;
