import React, { useEffect, useState, useRef } from 'react';
import './styles.css';
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
const VirtualList = ({ itemKey, list, children, className = '', visibleSize = 10, scrollContainer, pullRefresh, onScroll, }) => {
    const scrollIndex = useRef(0);
    const firstTime = useRef(true);
    const [scrollTop, setScrollTop] = useState(0);
    useEffect(() => {
        if (Array.isArray(list)) {
            scrollHandler();
            scrollListener('add');
        }
        return () => {
            scrollListener('remove');
        };
    }, [list]);
    const scrollListener = (type) => {
        if (type === 'add') {
            if (scrollContainer) {
                scrollContainer.addEventListener('scroll', scrollHandler, false);
            }
            else {
                window.addEventListener('scroll', scrollHandler, false);
            }
        }
        else {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', scrollHandler, false);
            }
            else {
                window.removeEventListener('scroll', scrollHandler, false);
            }
        }
    };
    const scrollHandler = () => {
        const _scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        setScrollTop(_scrollTop);
        onVirtualScroll(_scrollTop);
        if (onScroll)
            onScroll(_scrollTop);
    };
    // 元素滚动
    const onVirtualScroll = (_scrollTop) => {
        const AllitemWrapper = document.querySelectorAll('.zr-virtual-list .virtual-item-wrapper');
        // 初次渲染
        if (firstTime.current) {
            firstTime.current = false;
            AllitemWrapper.forEach((el, index) => {
                handlItemWrapper(el, index);
            });
            return;
        }
        // 滚动渲染
        let filterElems = _scrollTop < scrollTop
            ? Array.from(AllitemWrapper)
                .slice(scrollIndex.current - visibleSize, scrollIndex.current)
                .reverse()
            : Array.from(AllitemWrapper).slice(scrollIndex.current, scrollIndex.current + visibleSize);
        console.log(scrollIndex.current);
        console.log(filterElems);
        filterElems.forEach((el) => {
            const index = Number(el.getAttribute('item-index'));
            handlItemWrapper(el, index);
        });
    };
    // ItemWrapper处理
    const handlItemWrapper = (el, index) => {
        const ioWrapper = new IntersectionObserver((entries) => {
            const wrapper = entries[0].target;
            const content = wrapper.querySelector('.virtual-item-content');
            const wrapperClientHeight = wrapper === null || wrapper === void 0 ? void 0 : wrapper.clientHeight;
            if (entries[0].intersectionRatio > 0) {
                scrollIndex.current = index;
                wrapper.style.height = '';
                content.classList.remove('virtual-item-hidden');
            }
            else {
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
    return (React.createElement("div", { className: `zr-virtual-list ${className}` }, list &&
        list.map((item, index) => (React.createElement("div", { key: itemKey || index, "item-index": index, className: "virtual-item-wrapper" },
            React.createElement("div", { className: "virtual-item-content" }, children(item, index)))))));
};
export default VirtualList;
