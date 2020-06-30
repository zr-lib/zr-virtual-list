import React from 'react';
import './styles.css';
export interface VirtualListProps {
    itemKey: string;
    list: any[];
    className?: string;
    visibleSize?: number;
    pullRefresh?: boolean;
    scrollContainer?: HTMLElement;
    onScroll?: (scrollTop: number) => void;
    children: (item: any, index: number) => React.ReactNode;
}
/**
 * 长列表虚拟滚动
 * @param {*} list: any[]; // 列表数据
 * @param {*} className?: string;
 * @param {*} visibleSize?: number; // 可视区域范围，默认41（上下各20条）
 * @param {*} pullRefresh?: boolean; // 是否开启下拉刷新
 * @param {*} scrollContainer?: HTMLElement; // 滚动容器，默认 window
 * @param {*} onScroll?: (scrollTop: number) => void; // 滚动回调
 * @param {*} children: (item: any, index: number) => React.ReactNode;
 */
declare const VirtualList: React.FC<VirtualListProps>;
export default VirtualList;
