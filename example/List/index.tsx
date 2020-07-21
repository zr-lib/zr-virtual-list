import React, { useState, useEffect } from 'react';
import { KeepAliveAssist } from 'keep-alive-comp';
// import VirtualList from 'zr-virtual-list';
import VirtualList from '../VirtualList';
import './styles.less';

interface ListProps extends KeepAliveAssist {
  dataLength: number;
  renderCount: number;
  startIndex: number;
}

interface Item {
  id: string;
  count: number;
}

const List: React.FC<ListProps> = ({
  dataLength,
  renderCount,
  startIndex,
  beforeRouteLeave,
  stateRestore,
  scrollRestore,
  getKeepAlive,
}) => {
  const [scrollTop, setScrollTop] = useState(1000);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < dataLength; i++) {
      arr.push({ id: `id-${i}`, count: 0 });
    }
    setData(arr);
    restore();
  }, []);

  const restore = () => {
    const _scrollTop = scrollRestore!();
    const _state = stateRestore!();
    // console.log(_scrollTop, _state);
    // setScrollTop(_scrollTop || scrollTop);
    // setStartIndex(_state?.startIndex || startIndex);
  };

  const onScroll = (_scrollTop: number) => {
    console.log(_scrollTop);
    // setScrollTop(_scrollTop);
    beforeRouteLeave!(_scrollTop, {});
  };

  const countHandler = (index: number, type: 'increment' | 'decrement') => {
    console.log(index);
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

  const scrollToTop = () => {
    // virtualList.current.scrollToTop();
    setScrollTop(0);
    // setTimeout(() => {
    //   if (scrollTop > 0) toTop();
    // });
  };

  return (
    <>
      <p>
        <button onClick={scrollToTop}>scrollToTop</button>
      </p>
      {data && (
        <VirtualList
          itemKey="id"
          className="scroll-container"
          dataList={data}
          renderCount={renderCount}
          defaultScrollTop={scrollTop}
          defaultStartIndex={startIndex}
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
