import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b">
                <h1 className="text-xl font-semibold">
                    Resume Analyzer
                </h1>

                <ThemeToggle />
            </header>

            {/* Page Content */}
            <main className="p-6">
                {children}
            </main>
        </div>
    )
}