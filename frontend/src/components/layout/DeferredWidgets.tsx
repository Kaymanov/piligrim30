"use client";

import dynamic from "next/dynamic";

/**
 * Non-critical, below-the-fold widgets loaded lazily on the client.
 *
 * ChatWidget pulls in react-markdown (~40KB) and the modals aren't needed for
 * first paint. Deferring them keeps this JS out of the critical path and
 * lowers Total Blocking Time / unused JS on initial load.
 */
const ChatWidget = dynamic(
  () => import("@/components/chat/ChatWidget").then((m) => m.ChatWidget),
  { ssr: false },
);
const CallbackModal = dynamic(
  () => import("@/components/forms/CallbackModal").then((m) => m.CallbackModal),
  { ssr: false },
);
const LeadModal = dynamic(
  () => import("@/components/forms/LeadModal").then((m) => m.LeadModal),
  { ssr: false },
);

export function DeferredWidgets() {
  return (
    <>
      <ChatWidget />
      <CallbackModal />
      <LeadModal />
    </>
  );
}
