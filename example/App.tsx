import React, { useState, lazy, Suspense } from 'react';
import KeepAlive from 'keep-alive-comp';
import './styles.css';

const List = lazy(() => import('./components/List'));

export default function App() {
  const [visible, setVisible] = useState(true);

  return (
    <div className="App">
      <h1>zr-virtual-list example</h1>
      <p>
        <button className="visible-toggle" onClick={() => setVisible(!visible)}>
          {visible ? '隐藏' : '显示'}
        </button>
      </p>
      <Suspense fallback="">
        <KeepAlive name="list">
          {(props) => visible && <List {...props} />}
        </KeepAlive>
      </Suspense>
    </div>
  );
}
