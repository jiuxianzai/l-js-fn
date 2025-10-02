import L from "../src/index";

describe("is校验库测试", () => {
  it("isImage", () => {
    const fileName = "test.png";
    expect(L.isImage(fileName)).toBe(true);
  });

  it("isImage", () => {
    const fileName = "https://www.baidu.com/test.png";
    expect(L.isImage(fileName)).toBe(true);
  });

  it("isImage", () => {
    const fileName = "https://www.baidu.com/test.txt";
    expect(L.isImage(fileName)).toBe(false);
  });
});
