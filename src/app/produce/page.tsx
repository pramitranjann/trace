import AppShell from "@/components/shell/AppShell"
import ProduceMode from "@/components/produce/ProduceMode"

export default function ProducePage() {
  return (
    <AppShell title="Produce" showBack>
      <ProduceMode />
    </AppShell>
  )
}
