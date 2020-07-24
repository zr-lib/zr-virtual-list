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
  defaultStartIndex?: number; // the first visible item index by default
  defaultScrollTop?: number; // default scrollTop of scroll container
  className?: string;
  renderCount?: number; // number of renders at one time
  onScroll?: (scrollTop: number) => void; // scroll callback
  getScrollContainer?: () => HTMLElement; // scroll container, default body/documentElement
  onStartIndexChange?: (visibleItemIndex: number, startIndex: number) => void; // startIndex change callback
}

/**
 * VirtualList
 * @description Only render the number of renderCount each time
 * @param {*} props.itemKey: string; // uniqu key
 * @param {*} props.dataList: any[]; // data for VirtualList
 * @param {*} props.children: (item: any, index: number) => React.ReactNode;
 * @param {*} props.defaultStartIndex?: number; // the first visible item index by default
 * @param {*} props.defaultScrollTop?: number; // default scrollTop of scroll container
 * @param {*} props.className?: string;
 * @param {*} props.renderCount?: number; // number of renders at one time
 * @param {*} props.onScroll?: (scrollTop: number) => void; // scroll callback
 * @param {*} props.getScrollContainer?: () => HTMLElement; // scroll container, default body/documentElement
 * @param {*} props.onStartIndexChange?: (visibleItemIndex: number, startIndex: number) => void; // startIndex change callback
 */
declare const VirtualList: React.FC<VirtualListProps>;
export default VirtualList;
