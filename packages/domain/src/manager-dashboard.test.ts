import { describe, expect, it } from "vitest";

import {
  getManagerDashboardData,
  isAvatarColor,
  mockManagerDashboard
} from "./manager-dashboard.js";

const HEATMAP_ROWS = 7;
const HEATMAP_COLS = 12;

describe("mockManagerDashboard", () => {
  it("uses the prototype's company + period strings", () => {
    expect(mockManagerDashboard.company.name).toBe("Acme Tech · HCM");
    expect(mockManagerDashboard.company.period).toBe("HR · Tháng 5 / 2026");
  });

  it("matches the prototype hero numbers (14.2M / 8% / 1.18M)", () => {
    expect(mockManagerDashboard.leak.spendVnd).toBe(14_200_000);
    expect(mockManagerDashboard.leak.offPatternPct).toBe(8);
    expect(mockManagerDashboard.leak.caughtVnd).toBe(1_180_000);
  });

  it("kpi counts agree with the prototype (87/118 approved · 12 review · 3 flagged · 142 employees)", () => {
    const { kpis } = mockManagerDashboard;
    expect(kpis.totalSpendVnd).toBe(14_200_000);
    expect(kpis.approvedCount).toBe(87);
    expect(kpis.approvedTotal).toBe(118);
    expect(kpis.needsReviewCount).toBe(12);
    expect(kpis.flaggedCount).toBe(3);
    expect(kpis.employees).toBe(142);
  });

  it("approved + needsReview + flagged stay within the approvedTotal envelope", () => {
    const { kpis } = mockManagerDashboard;
    const sum = kpis.approvedCount + kpis.needsReviewCount + kpis.flaggedCount;
    expect(sum).toBeLessThanOrEqual(kpis.approvedTotal);
  });

  it("ships at least 6 claims with unique ids and valid avatar tokens", () => {
    const claims = mockManagerDashboard.claims;
    expect(claims.length).toBeGreaterThanOrEqual(6);

    const ids = new Set(claims.map((claim) => claim.id));
    expect(ids.size).toBe(claims.length);

    for (const claim of claims) {
      expect(isAvatarColor(claim.avatarColor)).toBe(true);
      expect(claim.amountVnd).toBeGreaterThan(0);
      expect(["ok", "warn", "bad", "approved"]).toContain(claim.flag);
    }
  });

  it("ships exactly 3 leak patterns with rank 1..3 and one severity each", () => {
    const patterns = mockManagerDashboard.leakPatterns;
    expect(patterns).toHaveLength(3);
    expect(patterns.map((p) => p.rank)).toEqual([1, 2, 3]);
    expect(patterns[0].severity).toBe("high");
    expect(patterns[1].severity).toBe("warn");
    expect(patterns[2].severity).toBe("info");
  });

  it("heatmap is a 7×12 grid", () => {
    const heat = mockManagerDashboard.heatmap;
    expect(heat).toHaveLength(HEATMAP_ROWS);
    for (const row of heat) {
      expect(row).toHaveLength(HEATMAP_COLS);
    }
  });

  it("heatmap has between 4 and 6 flagged anomalies", () => {
    const flagged = mockManagerDashboard.heatmap
      .flat()
      .filter((cell) => cell.flag === true).length;
    expect(flagged).toBeGreaterThanOrEqual(4);
    expect(flagged).toBeLessThanOrEqual(6);
  });

  it("every heatmap level is in 0..4", () => {
    for (const cell of mockManagerDashboard.heatmap.flat()) {
      expect(cell.level).toBeGreaterThanOrEqual(0);
      expect(cell.level).toBeLessThanOrEqual(4);
    }
  });
});

describe("getManagerDashboardData", () => {
  it("resolves to the mock for now", async () => {
    const data = await getManagerDashboardData();
    expect(data).toBe(mockManagerDashboard);
  });
});

describe("isAvatarColor", () => {
  it("accepts every documented token", () => {
    for (const token of ["rose", "lime", "sky", "bg-2", "coral", "leaf", "grape"]) {
      expect(isAvatarColor(token)).toBe(true);
    }
  });

  it("rejects unknown tokens", () => {
    expect(isAvatarColor("indigo")).toBe(false);
    expect(isAvatarColor("")).toBe(false);
  });
});
