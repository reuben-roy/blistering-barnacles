"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { queryGuideElement } from "@/lib/guide/dom";
import { visibleGuideStepsForRoute } from "@/lib/guide/session";
import { useGuideSession } from "./GuideProvider";

type OverlayItem = {
  stepIndex: number;
  title: string;
  rect: DOMRect;
  isCurrent: boolean;
};

export function GuideOverlay() {
  const pathname = usePathname();
  const { activeSteps, currentStepIndex, isDesktopGuide, sessionStatus } = useGuideSession();
  const [items, setItems] = useState<OverlayItem[]>([]);

  useEffect(() => {
    if (!isDesktopGuide || sessionStatus !== "guiding") {
      setItems([]);
      return;
    }

    function measure() {
      const next = visibleGuideStepsForRoute(activeSteps, pathname, currentStepIndex).flatMap((step) => {
        const element = queryGuideElement(step.target.selector);
        if (!element) return [];

        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return [];

        return [
          {
            stepIndex: step.index,
            title: step.title,
            rect,
            isCurrent: step.index === currentStepIndex,
          },
        ];
      });

      setItems(next);
    }

    const runMeasure = () => requestAnimationFrame(measure);
    runMeasure();

    const observer = new MutationObserver(runMeasure);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
    });

    window.addEventListener("resize", runMeasure);
    window.addEventListener("scroll", runMeasure, true);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", runMeasure);
      window.removeEventListener("scroll", runMeasure, true);
    };
  }, [activeSteps, currentStepIndex, isDesktopGuide, pathname, sessionStatus]);

  if (!isDesktopGuide || !items.length || sessionStatus !== "guiding") {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[45] hidden md:block">
      {items.map((item) => {
        const inset = item.isCurrent ? 8 : 5;
        const badgeTop = Math.max(8, item.rect.top - 28);
        const badgeLeft = Math.max(8, item.rect.left);

        return (
          <div key={item.stepIndex}>
            <div
              className={`absolute rounded-xl border-2 shadow-[0_0_0_9999px_rgba(15,23,42,0.18)] ${
                item.isCurrent
                  ? "border-accent bg-blue-500/8"
                  : "border-sky-300 bg-blue-200/12"
              }`}
              style={{
                top: item.rect.top - inset,
                left: item.rect.left - inset,
                width: item.rect.width + inset * 2,
                height: item.rect.height + inset * 2,
              }}
            />
            <div
              className={`absolute flex max-w-[260px] items-center gap-2 rounded-full border px-2 py-1 text-xs font-medium shadow-sm ${
                item.isCurrent
                  ? "border-accent bg-surface text-text"
                  : "border-sky-200 bg-surface/95 text-muted"
              }`}
              style={{ top: badgeTop, left: badgeLeft }}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">
                {item.stepIndex + 1}
              </span>
              <span className="truncate">{item.title}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
