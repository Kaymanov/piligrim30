/**
 * Global event-based system to trigger modals/widgets from anywhere.
 */

export const MODAL_EVENTS = {
  OPEN_CHAT: "modal:open-chat",
  OPEN_CALLBACK: "modal:open-callback",
  OPEN_LEAD: "modal:open-lead",
} as const;

export function openChat() {
  window.dispatchEvent(new CustomEvent(MODAL_EVENTS.OPEN_CHAT));
}

export function openCallback() {
  window.dispatchEvent(new CustomEvent(MODAL_EVENTS.OPEN_CALLBACK));
}

export function openLeadModal() {
  window.dispatchEvent(new CustomEvent(MODAL_EVENTS.OPEN_LEAD));
}
