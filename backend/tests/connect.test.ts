import { describe, expect, it } from "vitest";
import { parseFieldMask } from "../src/v2/connect";

describe("parseFieldMask", () => {
  it("解析 proto3 JSON 标准字符串形式(connect-web 实际发送的格式)", () => {
    expect(parseFieldMask("password")).toEqual(["password"]);
    expect(parseFieldMask("displayName,url")).toEqual(["display_name", "url"]);
    expect(parseFieldMask("identifierFilter")).toEqual(["identifier_filter"]);
  });

  it("解析对象形式 {paths:[...]}", () => {
    expect(parseFieldMask({ paths: ["password"] })).toEqual(["password"]);
    expect(parseFieldMask({ paths: ["displayName", "email"] })).toEqual(["display_name", "email"]);
  });

  it("解析数组形式", () => {
    expect(parseFieldMask(["password", "displayName"])).toEqual(["password", "display_name"]);
  });

  it("容忍逗号后空格", () => {
    expect(parseFieldMask("displayName, url")).toEqual(["display_name", "url"]);
  });

  it("缺省或非法输入返回空数组", () => {
    expect(parseFieldMask(undefined)).toEqual([]);
    expect(parseFieldMask(null)).toEqual([]);
    expect(parseFieldMask("")).toEqual([]);
    expect(parseFieldMask("  ")).toEqual([]);
    expect(parseFieldMask({})).toEqual([]);
    expect(parseFieldMask(42)).toEqual([]);
  });

  it("过滤 paths 中的非字符串项", () => {
    expect(parseFieldMask({ paths: ["password", 123, null] })).toEqual(["password"]);
  });
});
