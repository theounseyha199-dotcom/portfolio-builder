import config from "../next.config";
import { describe, expect, it } from "vitest";

describe("public asset proxy", () => {
  it("uses a same-origin public asset rewrite", async () => {
    const rewrites = await config.rewrites?.();
    expect(rewrites).toContainEqual({
      source: "/api/public/assets/:path*",
      destination: "http://localhost:8081/api/public/assets/:path*",
    });
  });
});
