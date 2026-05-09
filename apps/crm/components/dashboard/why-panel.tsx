import Link from "next/link";

interface VsRow {
  dimension: string;
  us: React.ReactNode;
  them: string;
}

const VS_ROWS: VsRow[] = [
  {
    dimension: "Ghi nhận",
    us: (
      <>
        <strong className="font-semibold text-lime">Tự nhận xe máy</strong> qua GPS + cảm biến. 0 thao tác.
      </>
    ),
    them: "Bạn phải tự gõ từng chi tiêu"
  },
  {
    dimension: "Phân loại",
    us: (
      <>
        <strong className="font-semibold text-lime">Xăng, gửi xe, cà phê dọc đường</strong> — đúng kiểu Việt Nam
      </>
    ),
    them: 'Mục "Đi lại" chung chung'
  },
  {
    dimension: "Insight",
    us: (
      <>
        <strong className="font-semibold text-lime">Money Leak Detector</strong> tìm chỗ tiền chảy lặp đi lặp lại
      </>
    ),
    them: "Biểu đồ chi tiêu — bạn tự đọc tự hiểu"
  },
  {
    dimension: "Kết quả",
    us: (
      <>
        <strong className="font-semibold text-lime">Hoàn phí công ty 1 chạm</strong> — tiền vào ví thật
      </>
    ),
    them: "Cảm giác tội lỗi sau khi xem chi tiêu"
  }
];

interface WhyCard {
  icon: string;
  title: string;
  body: React.ReactNode;
}

const WHY_CARDS: WhyCard[] = [
  {
    icon: "🛵",
    title: "Built cho Việt Nam, không port từ phương Tây",
    body: "Hầu hết app commute global giả định ô tô và thẻ. Tụi mình bắt đầu từ xe máy, gửi xe lẻ, và proof không có hóa đơn."
  },
  {
    icon: "🪝",
    title: "Hook khác hẳn tracker thường",
    body: (
      <>
        Người ta cài MoMo để trả tiền. Cài Money Lover để ghi sổ. Cài Commute.vn vì{" "}
        <strong className="font-semibold text-paper">công ty hoàn lại tiền cho bạn 1 chạm</strong>.
      </>
    )
  },
  {
    icon: "🔁",
    title: "Một engine, hai mặt: cá nhân + công ty",
    body: "Cùng pattern detection chỉ ra rò rỉ cho bạn — và rò rỉ cho công ty bạn. Đó là moat: data flywheel B2B2C."
  }
];

export function WhyPanel() {
  return (
    <article className="relative overflow-hidden rounded-3xl border-[2.5px] border-foreground bg-foreground p-7 text-paper shadow-brutal md:p-10">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-coral/30 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 size-60 rounded-full bg-grape/25 blur-3xl"
      />
      <div className="relative z-[1]">
        <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            Sao không phải{" "}
            <em className="rounded bg-lime px-1.5 not-italic text-foreground">MoMo</em> hay{" "}
            <em className="rounded bg-lime px-1.5 not-italic text-foreground">Money Lover</em>?
          </h2>
          <span className="font-mono text-[11px] text-paper/55">{"// thẳng thật"}</span>
        </header>

        <div className="mb-6 overflow-hidden rounded-2xl border-[1.5px] border-paper/20">
          <div className="grid grid-cols-1 border-b border-paper/15 bg-paper/10 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-paper/70 md:grid-cols-[1fr_1.5fr_1.5fr]">
            <div className="border-b border-paper/15 bg-paper/5 p-3.5 md:border-b-0 md:border-r md:p-4">
              Yếu tố
            </div>
            <div className="border-b border-paper/15 bg-lime/10 p-3.5 text-lime md:border-b-0 md:border-r md:p-4">
              Commute.vn
            </div>
            <div className="p-3.5 md:p-4">MoMo / Money Lover / Spendee</div>
          </div>
          {VS_ROWS.map((row) => (
            <div
              key={row.dimension}
              className="grid grid-cols-1 border-b border-paper/12 last:border-b-0 md:grid-cols-[1fr_1.5fr_1.5fr]"
            >
              <div className="border-b border-paper/12 bg-paper/5 p-3.5 font-display text-sm font-semibold text-paper/85 md:border-b-0 md:border-r md:p-4">
                {row.dimension}
              </div>
              <div className="border-b border-paper/12 bg-lime/[0.06] p-3.5 text-[13px] leading-relaxed md:border-b-0 md:border-r md:p-4">
                {row.us}
              </div>
              <div className="p-3.5 text-[13px] leading-relaxed text-paper/65 md:p-4">{row.them}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-3.5 md:grid-cols-3">
          {WHY_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border-[1.5px] border-paper/20 bg-paper/5 p-5"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-xl border-[1.5px] border-foreground bg-lime text-lg shadow-[2px_2px_0_0_hsl(var(--foreground))]">
                {card.icon}
              </div>
              <h4 className="mb-1.5 font-display text-[15px] font-bold tracking-tight text-paper">
                {card.title}
              </h4>
              <p className="text-[13px] leading-relaxed text-paper/80">{card.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-7">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-paper/30 bg-paper/5 px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-paper/85 hover:bg-paper/10"
          >
            ← Quay lại bảng
          </Link>
        </div>
      </div>
    </article>
  );
}
