import React, { useState, lazy, Suspense } from 'react';
import KeepAlive from 'keep-alive-comp';
import './styles.css';

const List = lazy(() => import('./components/List'));

const countList = [10, 20, 50, 100];

export default function App() {
  const [renderCount, setRenderCount] = useState(20);

  const onDatalengthChange = (count: number) => {
    setRenderCount(count);
  };

  const renderRadio = () => (
    <div className="render-count">
      <p>dataLength: 10000</p>
      renderCount:
      {countList.map((count) => (
        <span
          key={count}
          className={`radio ${renderCount === count ? 'checked' : ''}`}
          onClick={() => onDatalengthChange(count)}
        >
          {count}
        </span>
      ))}
    </div>
  );

  return (
    <div className="App">
      <h1>zr-virtual-list example</h1>
      {renderRadio()}
      <Suspense fallback="">
        <KeepAlive name="list">
          {(props) => <List {...props} renderCount={renderCount} />}
        </KeepAlive>
      </Suspense>
    </div>
  );
}
