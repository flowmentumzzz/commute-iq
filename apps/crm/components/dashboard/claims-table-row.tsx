"use client";

import { useState, useTransition } from "react";

import type { AvatarColor, ClaimFlag, ClaimRow } from "@commute-iq/domain";

interface ClaimsTableRowProps {
  claim: ClaimRow;
}

const AVATAR_BG: Record<AvatarColor, string> = {
  rose: "bg-rose text-foreground",
  lime: "bg-lime text-foreground",
  sky: "bg-sky text-foreground",
  "bg-2": "bg-bg-2 text-foreground",
  coral: "bg-coral text-paper",
  leaf: "bg-leaf text-paper",
  grape: "bg-grape text-paper"
};

const FLAG_STYLES: Record<ClaimFlag, string> = {
  ok: "bg-lime text-foreground",
  warn: "bg-bg-2 text-foreground",
  bad: "bg-coral text-paper",
  approved: "bg-leaf text-paper"
};

const APPROVED_LABEL = "✓ approved";

interface RowState {
  flag: ClaimFlag;
  flagLabel: string;
}

export function ClaimsTableRow({ claim }: ClaimsTableRowProps) {
  const [state, setState] = useState<RowState>({ flag: claim.flag, flagLabel: claim.flagLabel });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleApprove = () => {
    if (state.flag !== "ok") return;
    const previous: RowState = { flag: state.flag, flagLabel: state.flagLabel };
    setState({ flag: "approved", flagLabel: APPROVED_LABEL });
    setError(null);

    startTransition(() => {
      void (async () => {
        try {
          const response = await fetch("/api/manager/claims/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: claim.id })
          });
          if (!response.ok) {
            throw new Error(`status ${response.status}`);
          }
        } catch {
          setState(previous);
          setError("Không duyệt được, thử lại nhé.");
        }
      })();
    });
  };

  const buttonLabel =
    state.flag === "approved" ? "Approved" : state.flag === "ok" ? "Duyệt" : "Xem";

  const buttonStyles =
    state.flag === "approved"
      ? "border-foreground bg-leaf text-paper opacity-90 cursor-default"
      : state.flag === "ok"
        ? "border-foreground bg-lime text-foreground hover:bg-foreground hover:text-lime"
        : "border-foreground bg-paper text-foreground hover:bg-foreground hover:text-lime";

  return (
    <div
      className="grid grid-cols-[32px_1.1fr_1.1fr_0.7fr_0.85fr_auto] items-center gap-2.5 border-b border-dashed border-foreground/15 px-1 py-3 last:border-b-0"
      data-testid="claim-row"
    >
      <div
        className={`flex size-[30px] items-center justify-center rounded-full border-[1.5px] border-foreground font-display text-[11px] font-bold ${AVATAR_BG[claim.avatarColor]}`}
      >
        {claim.avatarInitial}
      </div>
      <div>
        <strong className="block text-xs font-semibold text-foreground">{claim.employeeName}</strong>
        <span className="font-mono text-[10px] text-foreground/55">{claim.employeeRole}</span>
      </div>
      <div>
        <span className="block text-xs font-medium text-foreground">{claim.routeFromTo}</span>
        <span className="font-mono text-[10px] text-foreground/60">{claim.mode}</span>
      </div>
      <div className="font-display text-[13px] font-bold text-foreground">{claim.amountLabel}</div>
      <div>
        <span
          className={`inline-flex items-center gap-1 rounded-full border-[1.5px] border-foreground px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-tight ${FLAG_STYLES[state.flag]}`}
        >
          {state.flagLabel}
        </span>
        {error ? (
          <span
            role="alert"
            className="ml-2 font-mono text-[9px] text-coral"
          >
            {error}
          </span>
        ) : null}
      </div>
      <button
        type="button"
        onClick={handleApprove}
        disabled={state.flag === "approved" || isPending}
        className={`rounded-lg border-[1.5px] px-2.5 py-1 font-mono text-[10px] font-semibold transition-colors disabled:opacity-90 ${buttonStyles}`}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
