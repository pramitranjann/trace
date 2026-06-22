import Link from "next/link"
import AppShell from "@/components/shell/AppShell"
import ModeCard from "@/components/shell/ModeCard"

export default function HomePage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center gap-8 px-4 py-10 max-w-lg mx-auto w-full">
        {/* Hero */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-5xl font-black text-orange-500 tracking-tight">Trace</h1>
          <p className="text-gray-600 text-lg font-medium">
            Learn letters by seeing, hearing, and making them
          </p>
        </div>

        {/* Quick Lesson CTA */}
        <Link
          href="/quick"
          className="w-full flex items-center justify-between px-6 py-4 rounded-3xl bg-orange-500 text-white font-black text-xl shadow-lg hover:bg-orange-600 transition-colors"
        >
          <span>⚡ Start Quick Lesson</span>
          <span>→</span>
        </Link>

        {/* Mode cards */}
        <div className="flex flex-col gap-4 w-full">
          <ModeCard
            title="See"
            description="Recognize letters and words with your eyes"
            icon="👁️"
            href="/see"
            color="border-blue-400"
            bgColor="bg-blue-50"
            buttonColor="bg-blue-500"
          />
          <ModeCard
            title="Hear"
            description="Match sounds to letters and words"
            icon="👂"
            href="/hear"
            color="border-purple-400"
            bgColor="bg-purple-50"
            buttonColor="bg-purple-500"
          />
          <ModeCard
            title="Produce"
            description="Trace in the air or write on paper"
            icon="✍️"
            href="/produce"
            color="border-green-400"
            bgColor="bg-green-50"
            buttonColor="bg-green-500"
          />
        </div>

        {/* Letters preview */}
        <div className="flex gap-3 pt-2">
          {["A", "B", "C", "D", "E"].map((l) => (
            <div
              key={l}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-100 text-orange-500 font-black text-lg"
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
