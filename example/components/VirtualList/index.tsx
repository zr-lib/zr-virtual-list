import React, { useEffect } from 'react';
import './styles.css';

export interface VirtualListProps {
  itemKey: string;
  list: any[]; // 列表数据
  className?: string;
  visibleHeight?: number; // 可视区域范围，默认三个屏幕高度（上中下各一屏）
  scrollContainer?: HTMLElement; // 滚动容器，默认 window
  onScroll?: (scrollTop: number) => void; // 滚动回调
  children: (item: any, index: number) => React.ReactNode;
}

/**
 * 长列表虚拟滚动
 * @param {*} list: any[]; // 列表数据
 * @param {*} className?: string;
 * @param {*} visibleHeight?: number; // 可视区域范围，默认三个屏幕高度（上中下各一屏）
 * @param {*} scrollContainer?: HTMLElement; // 滚动容器，默认 window
 * @param {*} onScroll?: (scrollTop: number) => void; // 滚动回调
 * @param {*} children: (item: any, index: number) => React.ReactNode;
 */
const VirtualList: React.FC<VirtualListProps> = ({
  itemKey,
  list,
  children,
  className = '',
  visibleHeight = window.innerHeight * 2,
  scrollContainer,
  onScroll,
}) => {
  useEffect(() => {
    if (Array.isArray(list)) {
      scrollHandler();
      scrollListener('add');
    }
    return () => {
      scrollListener('remove');
    };
  }, [list]);

  const scrollListener = (type: 'add' | 'remove') => {
    if (type === 'add') {
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', scrollHandler, false);
      } else {
        window.addEventListener('scroll', scrollHandler, false);
      }
    } else {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', scrollHandler, false);
      } else {
        window.removeEventListener('scroll', scrollHandler, false);
      }
    }
  };

  const scrollHandler = () => {
    const _scrollTop =
      document.body.scrollTop || document.documentElement.scrollTop;
    onVirtualScroll(_scrollTop);
    if (onScroll) onScroll(_scrollTop);
  };

  // 元素滚动
  const onVirtualScroll = (_scrollTop: number) => {
    const AllitemWrapper = document.querySelectorAll(
      '.zr-virtual-list .virtual-item-wrapper'
    );
    AllitemWrapper.forEach((el) => {
      handlItemWrapper(el);
    });
  };

  // ItemWrapper处理
  const handlItemWrapper = (el: Element) => {
    const ioWrapper = new IntersectionObserver((entries) => {
      const wrapper = entries[0].target as HTMLDivElement;
      const content = wrapper.querySelector(
        '.virtual-item-content'
      ) as HTMLDivElement;
      const wrapperClientHeight = wrapper?.clientHeight;

      const { top, bottom } = entries[0].boundingClientRect;

      if (
        entries[0].intersectionRatio > 0 ||
        (top > 0 && top < visibleHeight) ||
        (bottom < 0 && bottom > -visibleHeight)
      ) {
        wrapper.style.height = '';
        content.classList.remove('virtual-item-hidden');
      } else {
        wrapper.style.height = `${wrapperClientHeight}px`;
        content.classList.add('virtual-item-hidden');
      }

      ioWrapper.unobserve(el);
    });
    ioWrapper.observe(el);
  };

  if (list && !Array.isArray(list)) {
    console.warn('list不是数组！');
    return null;
  }

  return (
    <div className={`zr-virtual-list ${className}`}>
      {list &&
        list.map((item, index) => (
          <div
            key={itemKey || index}
            item-index={index}
            className="virtual-item-wrapper"
          >
            <div className="virtual-item-content">{children(item, index)}</div>
          </div>
        ))}
    </div>
  );
};

export default VirtualList;
