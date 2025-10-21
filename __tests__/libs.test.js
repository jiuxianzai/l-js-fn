const {isEmpty} = require("../dist/index.cjs")

describe("test", () => {
  test("isEmpty", () => {
    expect(isEmpty([])).toBe(true);
  })

  test("isEmpty", () => {
    expect(isEmpty(["1"])).toBe(false);
  })
})
