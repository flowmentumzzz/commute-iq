import { ensureManagerAccess } from "../../../components/dashboard/auth-gate";
import { WhyPanel } from "../../../components/dashboard/why-panel";

interface PageSearchParams {
  demo?: string | string[];
}

interface WhyPageProps {
  searchParams?: PageSearchParams;
}

export default function ManagerWhyPage({ searchParams }: WhyPageProps) {
  ensureManagerAccess({ demoQuery: searchParams?.demo });

  return (
    <main className="min-h-screen bg-background bg-body-bloom px-5 py-10 md:px-10">
      <section className="mx-auto w-full max-w-5xl">
        <WhyPanel />
      </section>
    </main>
  );
}
