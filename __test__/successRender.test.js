import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import VirtualList from '../src/index';

configure({ adapter: new Adapter() });

const dataList = [];
for (let i = 0, len = 1000; i < len; i++) {
  dataList.push({ id: `id-${i}` });
}

const List = mount(
  <VirtualList
    itemKey="id"
    dataList={dataList}
    defaultStartIndex={10}
    defaultScrollTop={0}
  >
    {(item) => <div className="item">{item.id}</div>}
  </VirtualList>
);

describe('=== zr-virtual-list SUCCESS TEST ===', () => {
  it('--- 成功渲染 ---', () => {
    const renderList = List.render();
    const placeholder = renderList.find('.placeholder');
    console.log(renderList.html());
    console.log(renderList);

    expect(renderList.hasClass('zr-virtual-list')).toBeTruthy();
    expect(placeholder.attr('style')).toEqual('height: 0px;');
  });
});
