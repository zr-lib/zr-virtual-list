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

const List = shallow(
  <VirtualList
    itemKey="id"
    dataList={dataList}
    defaultStartIndex={10}
    defaultScrollTop={0}
  >
    {(item) => <div className="item">{item.id}</div>}
  </VirtualList>
);

describe('============= zr-virtual-list TEST =============', () => {
  it('-- 成功渲染 --', () => {
    const item0 = List.props();
    console.log(item0);
    // expect(item0.text()).toBe('id-0');
  });

  it('-- children 非函数不渲染 --', () => {
    const List = shallow(
      <VirtualList itemKey="id" dataList={dataList}>
        <div>renderItem2</div>
      </VirtualList>
    );
    expect(typeof List.children() === 'function').toBe(false);
    expect(List.html()).toBe(null);
  });

  it('-- 错误参数测试 --', () => {
    const props = List.props();
    console.log(props);
    // expect(props);
  });
});
