import { TransformProps } from '../index.d';

// 是否数字
export const isNumber = (value: any) => typeof value === 'number';

// 获取对应的数值 scrollTop=>itemIndex，startIndex=>scrollTop，
// 优先 scrollTop
export function transform_scrollTop_itemIndex({
  itemScrollHeight,
  scrollTop: _scrollTop,
  startIndex: _startIndex,
}: TransformProps) {
  if (_scrollTop !== undefined && _startIndex !== undefined) {
    console.log('优先使用[scrollTop]');
  }
  if (typeof _scrollTop === 'number') {
    // 获取itemIndex
    const itemIndex = Math.floor(_scrollTop / itemScrollHeight);
    return itemIndex;
  } else {
    // 获取scrollTop
    const scrollTop = Math.floor(itemScrollHeight * _startIndex!);
    return scrollTop;
  }
}
