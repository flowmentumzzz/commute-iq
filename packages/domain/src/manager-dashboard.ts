/**
 * Manager dashboard data layer (HR / Finance surface).
 *
 * Backs the manager dashboard in `apps/crm`. Returns a frozen mock today;
 * swap `getManagerDashboardData()` to a Supabase-backed reader once the
 * reimbursement-policy backend ships (single file change — keep the shape).
 */

export type ClaimFlag = "ok" | "warn" | "bad" | "approved";

export type AvatarColor = "rose" | "lime" | "sky" | "bg-2" | "coral" | "leaf" | "grape";

const AVATAR_COLORS: readonly AvatarColor[] = [
  "rose",
  "lime",
  "sky",
  "bg-2",
  "coral",
  "leaf",
  "grape"
];

export function isAvatarColor(value: string): value is AvatarColor {
  return (AVATAR_COLORS as readonly string[]).includes(value);
}

export interface ClaimRow {
  id: string;
  employeeName: string;
  employeeRole: string;
  avatarInitial: string;
  avatarColor: AvatarColor;
  routeFromTo: string;
  mode: string;
  amountVnd: number;
  amountLabel: string;
  flag: ClaimFlag;
  flagLabel: string;
}

export interface LeakPattern {
  rank: 1 | 2 | 3;
  severity: "high" | "warn" | "info";
  title: string;
  detail: string;
}

export interface HeatmapCell {
  level: 0 | 1 | 2 | 3 | 4;
  flag?: boolean;
}

export interface ManagerDashboardData {
  company: { name: string; period: string };
  leak: { spendVnd: number; offPatternPct: number; caughtVnd: number };
  kpis: {
    totalSpendVnd: number;
    approvedCount: number;
    approvedTotal: number;
    needsReviewCount: number;
    flaggedCount: number;
    employees: number;
  };
  claims: ClaimRow[];
  leakPatterns: LeakPattern[];
  heatmap: HeatmapCell[][];
}

const HEATMAP_ROWS = 7;
const HEATMAP_COLS = 12;

/**
 * Build the 7×12 mock heatmap. Cells default to level 0; we sprinkle a
 * plausible leaf-coloured ramp plus 5 coral anomalies.
 */
function buildMockHeatmap(): HeatmapCell[][] {
  const elevated: ReadonlyArray<readonly [number, number, 1 | 2 | 3 | 4]> = [
    [0, 1, 2], [0, 4, 3], [0, 7, 2], [0, 10, 1],
    [1, 0, 3], [1, 2, 2], [1, 5, 4], [1, 8, 3], [1, 11, 2],
    [2, 1, 2], [2, 3, 4], [2, 6, 3], [2, 9, 2],
    [3, 0, 2], [3, 4, 3], [3, 7, 4], [3, 10, 3],
    [4, 1, 1], [4, 5, 2], [4, 8, 3], [4, 11, 1],
    [5, 2, 1], [5, 6, 1], [5, 9, 2],
    [6, 3, 1], [6, 7, 1]
  ];
  const flags: ReadonlyArray<readonly [number, number]> = [
    [4, 7],
    [1, 10],
    [6, 4],
    [2, 11],
    [3, 2]
  ];

  const rows: HeatmapCell[][] = [];
  for (let r = 0; r < HEATMAP_ROWS; r += 1) {
    const row: HeatmapCell[] = [];
    for (let c = 0; c < HEATMAP_COLS; c += 1) {
      row.push({ level: 0 });
    }
    rows.push(row);
  }

  for (const [r, c, level] of elevated) {
    rows[r][c] = { level };
  }
  for (const [r, c] of flags) {
    rows[r][c] = { level: 4, flag: true };
  }

  return rows;
}

const dashboardData: ManagerDashboardData = {
  company: { name: "Acme Tech · HCM", period: "HR · Tháng 5 / 2026" },
  leak: { spendVnd: 14_200_000, offPatternPct: 8, caughtVnd: 1_180_000 },
  kpis: {
    totalSpendVnd: 14_200_000,
    approvedCount: 87,
    approvedTotal: 118,
    needsReviewCount: 12,
    flaggedCount: 3,
    employees: 142
  },
  claims: [
    {
      id: "c-001",
      employeeName: "Lê Mai Anh",
      employeeRole: "HR",
      avatarInitial: "L",
      avatarColor: "rose",
      routeFromTo: "Q.Bình Thạnh → Q.1",
      mode: "🛵 xe máy · 8 chuyến",
      amountVnd: 320_000,
      amountLabel: "320k",
      flag: "ok",
      flagLabel: "✓ ok"
    },
    {
      id: "c-002",
      employeeName: "Nguyễn Văn Phúc",
      employeeRole: "Eng",
      avatarInitial: "N",
      avatarColor: "lime",
      routeFromTo: "Q.7 → Q.1",
      mode: "🚖 xe công nghệ · OT 23:14",
      amountVnd: 185_000,
      amountLabel: "185k",
      flag: "ok",
      flagLabel: "✓ ok"
    },
    {
      id: "c-003",
      employeeName: "Trần Quốc Thắng",
      employeeRole: "Sales",
      avatarInitial: "T",
      avatarColor: "sky",
      routeFromTo: "Thủ Đức → Q.3",
      mode: "🛵 + ☕ 14× cà phê",
      amountVnd: 412_000,
      amountLabel: "412k",
      flag: "warn",
      flagLabel: "⚠ xem"
    },
    {
      id: "c-004",
      employeeName: "Phạm Hoàng Nam",
      employeeRole: "Ops",
      avatarInitial: "P",
      avatarColor: "bg-2",
      routeFromTo: "Q.5 → Q.1",
      mode: "🚖 xe công nghệ (claim 🛵)",
      amountVnd: 228_000,
      amountLabel: "228k",
      flag: "bad",
      flagLabel: "✗ sai mode"
    },
    {
      id: "c-005",
      employeeName: "Vũ Thị Hồng",
      employeeRole: "Mkt",
      avatarInitial: "V",
      avatarColor: "coral",
      routeFromTo: "Tân Bình → Q.1",
      mode: "🛵 không có mặt VP",
      amountVnd: 160_000,
      amountLabel: "160k",
      flag: "bad",
      flagLabel: "✗ trùng"
    },
    {
      id: "c-006",
      employeeName: "Đỗ Minh Khánh",
      employeeRole: "Eng",
      avatarInitial: "Đ",
      avatarColor: "leaf",
      routeFromTo: "Q.10 → Q.1",
      mode: "🛵 xe máy · 6 chuyến",
      amountVnd: 240_000,
      amountLabel: "240k",
      flag: "ok",
      flagLabel: "✓ ok"
    },
    {
      id: "c-007",
      employeeName: "Bùi Lan Hương",
      employeeRole: "Finance",
      avatarInitial: "B",
      avatarColor: "grape",
      routeFromTo: "Bình Tân → Q.1",
      mode: "🚌 metro + 🛵",
      amountVnd: 156_000,
      amountLabel: "156k",
      flag: "ok",
      flagLabel: "✓ ok"
    },
    {
      id: "c-008",
      employeeName: "Hoàng Tú Quyên",
      employeeRole: "Design",
      avatarInitial: "H",
      avatarColor: "rose",
      routeFromTo: "Q.4 → Q.1",
      mode: "🛵 + 🅿️ gửi xe lẻ",
      amountVnd: 198_000,
      amountLabel: "198k",
      flag: "warn",
      flagLabel: "⚠ xem"
    }
  ],
  leakPatterns: [
    {
      rank: 1,
      severity: "high",
      title: "3 claim trùng cùng tuyến tối thứ Sáu",
      detail: "2 nhân viên · 480k"
    },
    {
      rank: 2,
      severity: "warn",
      title: "8 nhân viên claim cao hơn pattern thường",
      detail: "trung bình +28% so với 3 tháng"
    },
    {
      rank: 3,
      severity: "info",
      title: "2 chuyến không có check-in văn phòng",
      detail: "claim 🛵 nhưng GPS ngoài Q.1"
    }
  ],
  heatmap: buildMockHeatmap()
};

export const mockManagerDashboard: ManagerDashboardData = dashboardData;

/**
 * Single read entry-point for the manager dashboard. Returns the in-memory
 * mock today; swap to a Supabase reader behind this function when manager
 * auth + reimbursement persistence land. Async signature is intentional so
 * the swap doesn't churn callers.
 */
export async function getManagerDashboardData(): Promise<ManagerDashboardData> {
  return mockManagerDashboard;
}
