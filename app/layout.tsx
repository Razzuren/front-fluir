import "./globals.css"

export const metadata = {
  title: "Fluir",
  description: "A real-time text completion app using Flask and shadcn/ui.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">🩺 Fluir</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
        <footer className="bg-gray-100 mt-8">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
            Built with Next.js, Flask, and shadcn/ui.
          </div>
        </footer>
      </body>
    </html>
  );
}
