import { dateFormat,DATE_FORMAT } from "../dist/index.cjs";

describe("dateFormat", () => {
  it("测试 dateFormat 函数", () => {
    expect(dateFormat("2023-01-01 12:12:12",DATE_FORMAT.SHORT)).toBe("01-01");
  })
})