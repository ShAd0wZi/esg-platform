import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Database, FileText, UploadCloud, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">

      {/* Navbar */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-50">
        <div className="text-2xl font-bold tracking-tight text-slate-900">
          ESG<span className="text-emerald-600">Fast</span>
        </div>
        <div className="flex gap-3">
          <a href="/auth">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">Log In</Button>
          </a>
          <a href="/auth">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Get Your Report</Button>
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50"></div>

          <div className="container relative mx-auto max-w-6xl text-center space-y-8">

            {/* Headline */}
            <h1 className="mx-auto max-w-5xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl leading-tight">
              ESG reports for export SMEs – <br className="hidden md:block" />
              from <span className="text-slate-500 line-through decoration-emerald-500/50 decoration-2">scattered data</span> to{" "}
              <span className="text-emerald-600">buyer-ready PDF</span> in 10 minutes.
            </h1>

            {/* Subhead */}
            <p className="mx-auto max-w-2xl text-lg text-slate-600 sm:text-xl leading-relaxed">
              Centralize your ESG data, upload proof, and export a report any buyer or bank can understand.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <a href="/auth">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 h-14 px-8 text-lg font-semibold shadow-xl shadow-emerald-600/20 w-full sm:w-auto">
                  Get your first ESG report free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="mailto:sales@esgfast.com">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium border-2 hover:bg-transparent hover:border-emerald-600 hover:text-emerald-600 w-full sm:w-auto bg-white">
                  Book a free setup call
                </Button>
              </a>
            </div>

          </div>
        </section>

        {/* Problem Section */}
        <section className="px-6 py-16 bg-white border-y border-slate-100">
          <div className="container mx-auto max-w-4xl">
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                The Problem
              </h2>
              <p className="text-xl text-slate-700 font-medium flex flex-col md:flex-row items-center justify-center gap-4">
                <span>Buyers asking for ESG data</span>
                <ArrowRight className="h-6 w-6 text-amber-500 rotate-90 md:rotate-0" />
                <span>You scramble with Excel and emails?</span>
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard + Solution Section */}
        <section className="px-6 py-20 md:py-28 bg-slate-50">
          <div className="container mx-auto max-w-6xl">

            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left: Solution Bullets */}
              <div className="space-y-10 order-2 lg:order-1">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-slate-900">The Solution</h2>
                  <p className="text-lg text-slate-600">Stop the chaos. Start reporting.</p>
                </div>

                <div className="space-y-6">
                  {/* Bullet 1 */}
                  <Card className="border-0 shadow-sm ring-1 ring-slate-200 bg-white">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                        <Database className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">Data Hub</h3>
                        <p className="text-slate-600">Centralize all your scattered ESG data in one secure place. No more lost spreadsheets.</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bullet 2 */}
                  <Card className="border-0 shadow-sm ring-1 ring-slate-200 bg-white">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">Evidence Locker</h3>
                        <p className="text-slate-600">Upload certifications, policies, and proof easily. Keep everything audit-ready.</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bullet 3 */}
                  <Card className="border-0 shadow-sm ring-1 ring-slate-200 bg-white">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">Instant PDF & CSV</h3>
                        <p className="text-slate-600">Export a professional report any buyer or bank can understand in seconds.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right: Visual Proof */}
              <div className="relative order-1 lg:order-2 group">
                <div className="absolute inset-0 bg-emerald-600 blur-3xl opacity-10 rounded-full group-hover:opacity-20 transition-opacity duration-700"></div>
                <div className="relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10 bg-white">
                  <Image
                    src="/dashboard-mockup.png"
                    alt="ESG Dashboard and Report Preview"
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  {/* Overlay badge (optional visual flourish) */}
                  <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur shadow-lg py-2 px-4 rounded-full flex items-center gap-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
                    <CheckCircle2 className="h-4 w-4" /> Buyer Ready
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-emerald-900 text-white px-6">
          <div className="container mx-auto max-w-4xl text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to streamline your ESG reporting?</h2>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              Join hundreds of export SMEs winning contracts with clear, compliant data.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/auth">
                <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 h-14 px-8 text-lg font-bold w-full sm:w-auto">
                  Get Started for Free
                </Button>
              </a>
            </div>
            <p className="text-sm text-emerald-400">No credit card required • Instant access</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-50 py-12 border-t border-slate-200">
          <div className="container mx-auto px-6 max-w-6xl text-center text-slate-500 text-sm">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
              <span className="font-bold text-slate-700">ESG<span className="text-emerald-600">Fast</span></span>
              <span className="hidden md:inline text-slate-300">|</span>
              <span>Made for Export SMEs</span>
            </div>
            <p>© 2025 ESGFast. All rights reserved.</p>
          </div>
        </footer>

      </main>
    </div>
  );
}