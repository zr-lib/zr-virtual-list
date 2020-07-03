import React, { useState, useEffect, useRef } from 'react';
import VirtualList from '../VirtualList';
import { KeepAliveAssist } from 'keep-alive-comp';
import './styles.css';
import useDebounce from '../../utils/useDebounce';

interface ListProps extends KeepAliveAssist {}

interface Item {
  id: string;
  count: number;
}

const List: React.FC<ListProps> = ({
  beforeRouteLeave,
  stateRestore,
  scrollRestore,
  getKeepAlive,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTop = useRef(0);
  const defaultPageIndex = useRef(2);
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
    defaultPageIndex.current = _state?.pageIndex || 0;
    setTimeout(() => {
      // document.body.scrollTop = _scrollTop;
      // document.documentElement.scrollTop = _scrollTop;
      scrollContainerRef.current.scrollTop = _scrollTop;
    }, 0);
  };

  const onScroll = (_scrollTop: number) => {
    const { state, scrollTop: scTop } = getKeepAlive() || {};
    scrollTop.current = _scrollTop ?? scTop;
    beforeRouteLeave(scrollTop.current, state);
  };

  const increment = (index: number) => {
    setData((prev) => {
      const newItem = {
        ...prev[index],
        count: prev[index].count + 1,
      };
      prev.splice(index, 1, newItem);
      return prev;
    });
  };

  const decrement = (index: number) => {
    setData((prev) => {
      const newItem = {
        ...prev[index],
        count: prev[index].count - 1,
      };
      prev.splice(index, 1, newItem);
      return prev;
    });
  };

  const onLoadMore = useDebounce((index: number) => {
    console.log('onLoadMore ', index);
    beforeRouteLeave(scrollTop.current, {
      pageIndex: index,
    });
  });

  const onVisibleChange = useDebounce((indexs) => {
    console.log('indexs: ', indexs);
  });

  return (
    <div id="scroll-container" ref={scrollContainerRef}>
      <VirtualList
        itemKey="id"
        dataList={data}
        defaultPageIndex={defaultPageIndex.current}
        getScrollContainer={() => document.getElementById('scroll-container')}
        onScroll={onScroll}
        onLoadMore={onLoadMore}
        onVisibleChange={onVisibleChange}
      >
        {(item: Item, index) => (
          <div
            className={`item ${index % 2 === 0 ? 'item-2n' : ''}`}
            key={item.id}
          >
            <p>
              <button onClick={() => decrement(index)}>count--</button>&nbsp;
              <button onClick={() => increment(index)}>count++</button>
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
