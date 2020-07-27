# zr-virtual-list

## v1.0.1

- publish

## v1.0.3

- fix: scroll bug in some broswer(eg: Quark)

  `useEffect` => `useLayoutEffect` when `init`

## v1.0.4

- fix: Scroll bug caused by `defaultStartIndex` greater than `dataList.length`；因 `defaultStartIndex` 大于 `dataList.length` 造成滚动bug
