import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

export default {
  testMatch: ["**/__tests__/**/*.test.ts"],
  testEnvironment: "node", // node 与 jsdom
  transform: {
    ...tsJestTransformCfg
  }
};
