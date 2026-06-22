import AppShell from "@/components/shell/AppShell"
import QuickLesson from "@/components/quick/QuickLesson"

export default function QuickPage() {
  return (
    <AppShell title="Quick Lesson" showBack>
      <QuickLesson />
    </AppShell>
  )
}
