import React, { useState, lazy, Suspense } from 'react';
import KeepAlive from 'keep-alive-comp';
import './styles.css';

const List = lazy(() => import('./components/List'));

const lengthList = [20, 100, 500, 1000, 3000, 10000];

export default function App() {
  const [visible, setVisible] = useState(true);
  const [renderCount, setRenderCount] = useState(20);

  const onDatalengthChange = (count: number) => {
    setRenderCount(count);
  };

  const renderRadio = () => (
    <p>
      renderCount:
      {lengthList.map((count) => (
        <span
          key={count}
          className={`radio ${renderCount === count ? 'checked' : ''}`}
          onClick={() => onDatalengthChange(count)}
        >
          {count}
        </span>
      ))}
    </p>
  );

  return (
    <div className="App">
      <h1>zr-virtual-list example</h1>
      <p>
        <button className="visible-toggle" onClick={() => setVisible(!visible)}>
          {visible ? '隐藏' : '显示'}
        </button>
      </p>
      {renderRadio()}
      <Suspense fallback="">
        <KeepAlive name="list">
          {(props) => visible && <List {...props} renderCount={renderCount} />}
        </KeepAlive>
      </Suspense>
    </div>
  );
}
