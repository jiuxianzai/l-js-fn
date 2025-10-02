import { findIndex } from "../src/index";

describe("findIndex test", () => {
  it("应该返回第一个匹配元素索引", () => {
    const arr = [
      {
        name: "张三"
      },
      {
        name: "李四"
      }
    ];
    const index = findIndex(arr, item => item.name === "张三");
    expect(index).toBe(0);
  });

  it("找不到元素返回为-1", () => {
    const arr = [1, 2, 3];
    const index = findIndex(arr, item => item === 4);
    expect(index).toBe(-1);
  });

  it("如果数组为空，返回-1",() => {
    const index = findIndex([], item => item === 4);
    expect(index).toBe(-1);
  })
});
