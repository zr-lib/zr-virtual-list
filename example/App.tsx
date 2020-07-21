import React, { useState, lazy, Suspense } from 'react';
import KeepAlive from 'keep-alive-comp';
import './styles.less';

const List = lazy(() => import('./List'));

const countList = [10, 20, 50, 100, 1000, 10000];
const indexList = [0, 6, 21, 56, 112, 2345];

export default function App() {
  const [dataLength, setDataLength] = useState(10000);
  const [renderCount, setRenderCount] = useState(20);
  const [startIndex, setStartIndex] = useState(6);

  const startIndexRadio = () => (
    <div className="render-radio">
      startIndex:
      {indexList.map((index) => (
        <span
          key={index}
          className={`radio ${startIndex === index ? 'checked' : ''}`}
          onClick={() => setStartIndex(index)}
        >
          {index}
        </span>
      ))}
    </div>
  );

  const renderCountRadio = () => (
    <div className="render-radio">
      renderCount:
      {countList.map((count) => (
        <span
          key={count}
          className={`radio ${renderCount === count ? 'checked' : ''}`}
          onClick={() => setRenderCount(count)}
        >
          {count}
        </span>
      ))}
    </div>
  );

  return (
    <>
      <h1 className="title">zr-virtual-list example</h1>
      <p>dataLength: {dataLength}</p>
      {startIndexRadio()}
      {renderCountRadio()}
      <Suspense fallback="loading...">
        <KeepAlive name="list">
          {(props) => (
            <List
              {...props}
              dataLength={dataLength}
              renderCount={renderCount}
              startIndex={startIndex}
            />
          )}
        </KeepAlive>
      </Suspense>
    </>
  );
}
