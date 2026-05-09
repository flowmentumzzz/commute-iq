import { getManagerDashboardData } from "@commute-iq/domain";

import { ensureManagerAccess } from "../components/dashboard/auth-gate";
import { ClaimsTable } from "../components/dashboard/claims-table";
import { CompanyLeak } from "../components/dashboard/company-leak";
import { DashboardHeader } from "../components/dashboard/header";
import { Heatmap } from "../components/dashboard/heatmap";
import { KpiRow } from "../components/dashboard/kpi-row";
import { LeakPatterns } from "../components/dashboard/leak-patterns";

interface PageSearchParams {
  demo?: string | string[];
}

interface PageProps {
  searchParams?: PageSearchParams;
}

export default async function CrmHomePage({ searchParams }: PageProps) {
  ensureManagerAccess({ demoQuery: searchParams?.demo });

  const data = await getManagerDashboardData();

  return (
    <main className="min-h-screen bg-background bg-body-bloom px-5 py-7 md:px-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/55">
          <span className="h-px flex-1 bg-foreground/25" aria-hidden />
          Bảng quản lý · HR / Finance
          <span className="h-px flex-1 bg-foreground/25" aria-hidden />
        </p>

        <article className="overflow-hidden rounded-3xl border-[2.5px] border-foreground bg-paper shadow-brutal">
          <DashboardHeader companyName={data.company.name} period={data.company.period} />
          <div className="p-5 md:p-6">
            <CompanyLeak
              spendVnd={data.leak.spendVnd}
              offPatternPct={data.leak.offPatternPct}
              caughtVnd={data.leak.caughtVnd}
            />
            <KpiRow
              totalSpendVnd={data.kpis.totalSpendVnd}
              approvedCount={data.kpis.approvedCount}
              approvedTotal={data.kpis.approvedTotal}
              needsReviewCount={data.kpis.needsReviewCount}
              flaggedCount={data.kpis.flaggedCount}
              employees={data.kpis.employees}
            />
            <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
              <ClaimsTable claims={data.claims} totalThisMonth={data.kpis.approvedTotal} />
              <div className="flex flex-col gap-4">
                <LeakPatterns patterns={data.leakPatterns} />
                <Heatmap grid={data.heatmap} />
              </div>
            </div>
          </div>
        </article>

        <p className="text-center font-mono text-[11px] text-foreground/45">
          Hackathon prototype · không phải dữ liệu thật · © 2026
        </p>
      </section>
    </main>
  );
}
