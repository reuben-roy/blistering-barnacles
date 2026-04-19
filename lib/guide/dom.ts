import type { GuideRevealAction } from "./types";

export const GUIDE_OPEN_NAV_GROUP_EVENT = "brokerdesk:guide-open-nav-group";

export function requestGuideReveal(action?: GuideRevealAction) {
  if (!action || typeof window === "undefined") return;

  if (action.type === "nav-group") {
    window.dispatchEvent(
      new CustomEvent(GUIDE_OPEN_NAV_GROUP_EVENT, {
        detail: { groupId: action.groupId, expandShell: action.expandShell === true },
      }),
    );
  }
}

export function queryGuideElement(selector: string) {
  if (typeof document === "undefined") return null;
  return document.querySelector<HTMLElement>(selector);
}

export function waitForNextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}
