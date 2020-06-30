import React, { useState, useEffect } from 'react';
import VirtualList from '../VirtualList';
import './styles.css';

const List = () => {
  const [data, setData] = useState<any[] | undefined>();

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 500; i++) {
      arr.push(i);
    }
    setData(arr);
  }, []);

  return (
    <VirtualList itemKey="" visibleHeight={window.innerHeight} list={data}>
      {(item, index) => (
        <div className={`item ${index % 2 === 0 ? 'item-2n' : ''}`} key={item}>
          {(item + '').split('').map((it, i) => (
            <p key={`${it}-${i}`}>{it}</p>
          ))}
        </div>
      )}
    </VirtualList>
  );

  return (
    <div className="list">
      {data &&
        data.map((item, index) => (
          <p className="item">
            {index + 1}、{item}
            {index + 1}、{item}
            {index + 1}、{item}
          </p>
        ))}
    </div>
  );
};

export default List;
