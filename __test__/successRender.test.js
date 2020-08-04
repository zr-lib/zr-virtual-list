import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import VirtualList from '../src/index';

configure({ adapter: new Adapter() });

jest.useFakeTimers();

let container = null;
beforeEach(() => {
  // 创建一个 DOM 元素作为渲染目标
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // 退出时进行清理
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const dataList = [];
for (let i = 0, len = 1000; i < len; i++) {
  dataList.push({ id: `id-${i}` });
}

const BaseList = (props) => (
  <VirtualList itemKey="id" dataList={dataList} {...props}>
    {(item) => <div className="item">{item.id}</div>}
  </VirtualList>
);

describe('=== zr-virtual-list SUCCESS TEST ===', () => {
  it('--- props ---', () => {
    const List = shallow(
      <BaseList defaultStartIndex={666} defaultScrollTop={0} />
    );
    const {
      itemKey,
      dataList: dataList1,
      defaultStartIndex,
      defaultScrollTop,
    } = List.props();
    expect(itemKey).toBe('id');
    expect(dataList1).toEqual(dataList);
    expect(defaultStartIndex).toBe(666);
    expect(defaultScrollTop).toBe(0);
  });

  it('--- render ---', () => {
    act(() => {
      render(<BaseList />, container);
      jest.advanceTimersByTime(30);
    });
    let allitemWrapper = container.querySelectorAll('.virtual-item-wrapper');
    expect(allitemWrapper.length).toBe(20);

    act(() => {
      render(<BaseList renderCount={10} />, container);
      jest.advanceTimersByTime(30);
    });
    allitemWrapper = container.querySelectorAll('.virtual-item-wrapper');
    expect(allitemWrapper.length).toBe(10);
  });

  // TODO：
  // 1、defaultStartIndex大于dataList.length
  // 2、defaultScrollTop不渲染东西，滚动如何测试？
  it('--- defaultStartIndex ---', () => {
    act(() => {
      render(<BaseList defaultStartIndex={666} />, container);
      jest.advanceTimersByTime(30);
    });
    const firstItem = container.querySelector('.virtual-item-wrapper');
    expect(firstItem.getAttribute('item-index')).toEqual('666');

    act(() => {
      render(<BaseList defaultStartIndex={1000} />, container);
      jest.advanceTimersByTime(100);
    });
    const firstItem1 = container.querySelector('.virtual-item-wrapper');
    expect(firstItem1).toBe(null);
  });

  // it('--- defaultScrollTop ---', () => {
  //   act(() => {
  //     render(<BaseList defaultScrollTop={1000} />, container);
  //     jest.advanceTimersByTime(100);
  //   });

  //   console.log(container.innerHTML);
  //   const firstItem = container.querySelector('.virtual-item-wrapper');
  //   expect(firstItem.getAttribute('item-index') - 0).toEqual(666);
  // });
});
