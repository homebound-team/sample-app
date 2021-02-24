import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  moduleNameMapper: {
    "^src/(.*)": "<rootDir>/src/$1",
  },
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/*.test.(ts|tsx)"],
  reporters: ["default", "jest-summary-reporter"],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
};

export default config;
