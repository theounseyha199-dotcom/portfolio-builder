import { describe, expect, it } from "vitest";
import { resumeRtkApi } from "./rtk-api";

describe("resume RTK Query endpoints", () => {
  it("registers read-only parse and typed import mutations", () => {
    expect(resumeRtkApi.endpoints.parseResume).toBeDefined();
    expect(resumeRtkApi.endpoints.importResume).toBeDefined();
  });
});
