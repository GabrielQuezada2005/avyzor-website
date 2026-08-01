import { PortalDataView } from "@/components/portal/PortalDataView";

export default function PortalMessagesPage() {
  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-semibold text-white">Nachrichten</h2>
      <PortalDataView section="messages" />
    </div>
  );
}
