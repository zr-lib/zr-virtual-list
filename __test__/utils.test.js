import { isNumber, transform_scrollTop_itemIndex } from '../src/utils';

describe('=== utils TEST ===', () => {
  it('--- isNumber ---', () => {
    expect(isNumber(11)).toBeTruthy();
    expect(isNumber(undefined)).toBeFalsy();
    expect(isNumber('11')).toBeFalsy();
    expect(isNumber(null)).toBeFalsy();
    expect(isNumber(true)).toBeFalsy();
    expect(isNumber(false)).toBeFalsy();
  });

  it('--- transform_scrollTop_itemIndex ---', () => {
    const itemScrollHeight = 100;
    const startIndex = 6;
    const scrollTop = 600;

    const transform_scrollTop = transform_scrollTop_itemIndex({
      itemScrollHeight,
      startIndex,
    });
    expect(transform_scrollTop).toEqual(600);

    const transform_itemIndex = transform_scrollTop_itemIndex({
      itemScrollHeight,
      scrollTop,
    });
    expect(transform_itemIndex).toEqual(6);

    const transform_scrollTop1 = transform_scrollTop_itemIndex({
      itemScrollHeight,
      scrollTop,
      startIndex,
    });
    expect(transform_scrollTop1).toEqual(6);
  });
});
