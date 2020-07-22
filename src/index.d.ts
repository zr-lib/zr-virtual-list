/// <reference types="React" />
import React from 'react';

export interface TransformProps {
  itemScrollHeight: number;
  startIndex?: number;
  scrollTop?: number;
}

export interface VirtualListProps {
  itemKey: string; // uniqu key
  dataList: any[]; // data for VirtualList
  children: (item: any, index: number) => React.ReactNode;
  defaultStartIndex?: number; // Default starting position
  defaultScrollTop?: number; // Default scroll position
  className?: string;
  renderCount?: number; // Number of renders at one time
  onScroll?: (scrollTop: number) => void; // Scroll callback
  getScrollContainer?: () => HTMLElement; // Scroll container, default body
  onStartIndexChange?: (visibleItemIndex: number, startIndex: number) => void; // Return to the starting position
}

/**
 * VirtualList
 * @description Only render the number of renderCount each time
 * @param {*} props.itemKey: string; // uniqu key
 * @param {*} props.dataList: any[]; // data for VirtualList
 * @param {*} props.children: (item: any, index: number) => React.ReactNode;
 * @param {*} props.defaultStartIndex?: number; // Default starting position
 * @param {*} props.defaultScrollTop?: number; // Default scroll position
 * @param {*} props.className?: string;
 * @param {*} props.renderCount?: number; // Number of renders at one time
 * @param {*} props.onScroll?: (scrollTop: number) => void; // Scroll callback
 * @param {*} props.getScrollContainer?: () => HTMLElement; // Scroll container, default body
 * @param {*} props.onStartIndexChange?: (index: number) => void; // Return to the starting position
 */
declare const VirtualList: React.FC<VirtualListProps>;
export default VirtualList;
