import { useCallback } from 'react';

// 节流
const useThrottle = (callback: (param: any) => any, delay: number = 16) => {
  let lastTime: number = 0;
  let canCallback = true;

  const restore = (time: number) => {
    lastTime = time;
    canCallback = false;
  };

  const runCallback = (args: any) => {
    callback(args);
  };

  return useCallback((args?: any) => {
    const thisTime = new Date().getTime();
    if (canCallback && thisTime - lastTime > delay) {
      restore(thisTime);
      runCallback(args);
      setTimeout(() => {
        canCallback = true;
      }, delay);
      return;
    }
  }, []);
};

export default useThrottle;
