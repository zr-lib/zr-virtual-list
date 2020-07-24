import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import VirtualList from '../src/index';

configure({ adapter: new Adapter() });

const dataList = [];
for (let i = 0, len = 1000; i < len; i++) {
  dataList.push({
    id: `id-${i}`,
  });
}

const baseList = (props) => (
  <VirtualList itemKey="id" dataList={dataList} {...props}>
    {(item) => <div className="item">{item.id}</div>}
  </VirtualList>
);

describe('=== zr-virtual-list FAILED TEST ===', () => {
  it('--- children 非函数不渲染 ---', () => {
    const List = shallow(baseList({ children: <div>renderItem2</div> }));
    expect(typeof List.children() === 'function').toBe(false);
    expect(List.render().text()).toBe('');
  });

  it('--- dataList 非数组不渲染 ---', () => {
    const List = shallow(baseList({ dataList: 1 }));
    expect(List.render().text()).toBe('');
  });

  it('--- defaultStartIndex 小于0不渲染 ---', () => {
    const List = shallow(baseList({ defaultStartIndex: -1 }));
    expect(List.render().text()).toBe('');
  });

  it('--- renderCount 小于0不渲染 ---', () => {
    const List = shallow(baseList({ renderCount: -1 }));
    expect(List.render().text()).toBe('');
  });
});
