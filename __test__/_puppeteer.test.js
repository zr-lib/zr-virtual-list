import 'babel-polyfill';
const puppeteter = require('puppeteer');

let browser, page;

const getAllItems = async (_page) => {
  const _allItems = await _page.$eval('.zr-virtual-list', (el) => {
    const allItems = el.querySelectorAll('.virtual-item-wrapper');
    return Array.from(allItems).map((item) => item.getAttribute('item-index'));
  });
  return _allItems;
};

const clickHide = (_page) => {
  _page.click('.btn-ctrl');
};

describe('=== puppeteer test ===', () => {
  it('--- render ---', async () => {
    browser = await puppeteter.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:2333');
    await page.waitFor(1000);

    handler();
    const handler = async () => {
      const virtualItems = await getAllItems(page);
      expect(virtualItems.length).toBe(20);
      expect(virtualItems[0]).toBe('0');
      const firstItemIndex = await page.$eval('.virtual-item-wrapper', (el) =>
        el.getAttribute('item-index')
      );
      expect(firstItemIndex).toBe('0');
    };

    clickHide();
    handler();
  });

  it('--- defaultStartIndex: 112 ---', async () => {
    await page.click('.start_index .radio[item-value="112"]');
    await page.waitFor(1000);

    handler();
    const handler = async () => {
      const virtualItems = await getAllItems(page);
      expect(virtualItems.length).toBe(20);
      expect(virtualItems[0]).toBe(`${112 - 5}`);
      const firstItemIndex = await page.$eval('.virtual-item-wrapper', (el) =>
        el.getAttribute('item-index')
      );
      expect(firstItemIndex).toBe(`${112 - 5}`);

      const { offsetTop, scrollTop } = await page.evaluate(() => {
        const item112 = document.querySelector(
          '.virtual-item-wrapper[item-index="112"]'
        );
        const item112Parent = item112.closest('.zr-virtual-list');
        return {
          offsetTop: item112.offsetTop - item112Parent.offsetTop,
          scrollTop: document.documentElement.scrollTop,
        };
      });
      expect(Math.abs(scrollTop - offsetTop) < 10).toBeTruthy();
    };

    clickHide();
    handler();
  });

  it('--- defaultScrollTop: 100 ---', async () => {
    await page.click('.scroll_top .radio[item-value="100"]');
    await page.waitFor(1000);

    handler();
    const handler = async () => {
      const virtualItems = await getAllItems(page);
      expect(virtualItems.length).toBe(20);

      const { scrollTop } = await page.evaluate(() => {
        return {
          scrollTop: document.documentElement.scrollTop,
        };
      });
      expect(scrollTop === 100).toBeTruthy();
    };

    clickHide();
    handler();
  });
});
