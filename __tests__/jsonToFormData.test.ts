import {jsonToFormData} from "../dist/index.cjs";


describe("jsonToFormData test", () => {
  it("测试转化普通formData对象", () => {
    let data = {
      userName: "张三",
      age: 23
    }
    let formData = jsonToFormData(data);
    let res = formDataToObject(formData);
    expect(res).toEqual({
      userName: "张三",
      age: "23"
    })
  })
})

/**
 * formData 转 json
 * @param formData
 */
function formDataToObject(formData: FormData): Record<string, any> {
  const obj: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    const strValue = value.toString();
    // 如果全是数字字符串，就转成 number
    obj[key] = /^\d+$/.test(strValue) ? Number(strValue) : strValue;
  }
  return obj;
}
