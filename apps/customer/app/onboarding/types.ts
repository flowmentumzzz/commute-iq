import { z } from "zod";

export const TRANSPORT_MODES = ["motorbike", "grab_be", "bus", "bike_walk"] as const;
export type TransportMode = (typeof TRANSPORT_MODES)[number];

export const HCMC_DISTRICTS = [
  "Q.1",
  "Q.3",
  "Q.4",
  "Q.5",
  "Q.7",
  "Q.10",
  "Bình Thạnh",
  "Tân Bình",
  "Phú Nhuận",
  "Thủ Đức",
  "Bình Tân",
  "Gò Vấp"
] as const;

export const HANOI_DISTRICTS = [
  "Hoàn Kiếm",
  "Ba Đình",
  "Đống Đa",
  "Hai Bà Trưng",
  "Tây Hồ",
  "Cầu Giấy",
  "Thanh Xuân",
  "Hà Đông",
  "Long Biên",
  "Nam Từ Liêm",
  "Bắc Từ Liêm"
] as const;

export const ALL_DISTRICTS = [...HCMC_DISTRICTS, ...HANOI_DISTRICTS] as const;

export const draftProfileSchema = z.object({
  homeLabel: z.string().trim().min(1, "Vui lòng nhập địa chỉ nhà."),
  homeDistrict: z.string().trim().min(1, "Chọn quận/huyện cho nhà."),
  workLabel: z.string().trim().min(1, "Vui lòng nhập địa chỉ văn phòng."),
  workDistrict: z.string().trim().min(1, "Chọn quận/huyện cho văn phòng."),
  primaryTransport: z.enum(TRANSPORT_MODES),
  vehicleModelId: z.string().trim().min(1).optional()
});

export type DraftProfile = z.infer<typeof draftProfileSchema>;

export type Step = "welcome" | "locations" | "transport";

export const STEP_ORDER: Step[] = ["welcome", "locations", "transport"];

export const TRANSPORT_OPTIONS: Array<{ id: TransportMode; emoji: string; label: string }> = [
  { id: "motorbike", emoji: "🛵", label: "Xe máy" },
  { id: "grab_be", emoji: "🚖", label: "Grab / Be" },
  { id: "bus", emoji: "🚌", label: "Buýt / Metro" },
  { id: "bike_walk", emoji: "🚲", label: "Xe đạp / Đi bộ" }
];

export const PROGRESS_STORAGE_KEY = "commute-iq:onboarding-progress";
