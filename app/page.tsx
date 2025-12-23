import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Shield, Zap, FileCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">

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
            <Button className="bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-24 md:pt-32 md:pb-32">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-slate-50 opacity-60"></div>

          <div className="container relative mx-auto max-w-6xl">
            <div className="flex flex-col items-center text-center space-y-8">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                <Zap className="h-4 w-4" />
                No monthly subscriptions
              </div>

              {/* Headline */}
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
                Generate your SMB ESG Report in{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                  15 minutes
                </span>
              </h1>

              {/* Subheading */}
              <p className="max-w-2xl text-lg text-slate-600 sm:text-xl leading-relaxed">
                Don&apos;t lose contracts because you can&apos;t fill out a sustainability questionnaire. Get compliance-ready reports designed for Logistics, Manufacturing, and Small Business.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="/auth">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 text-base shadow-lg shadow-emerald-600/20">
                    Start Free Draft <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                  <span>No Setup Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-emerald-600" />
                  <span>Pay Per Report</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-6 py-20 md:py-28 bg-white">
          <div className="container mx-auto max-w-6xl">

            {/* Section Header */}
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Simple Pricing. No Monthly Fees.
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Start for free, upgrade only when you need the official report
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">

              {/* Free Tier */}
              <Card className="border-2 border-slate-200 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="space-y-4 pb-8">
                  <div>
                    <CardTitle className="text-2xl">Draft Mode</CardTitle>
                    <CardDescription className="text-base mt-2">Get your data organized</CardDescription>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-slate-900">$0</div>
                    <div className="text-sm text-slate-500 mt-1">Forever free</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Unlimited data entry and storage</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Secure cloud storage</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Basic dashboard view</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <a href="/auth" className="w-full">
                    <Button variant="outline" className="w-full h-11 border-2 hover:bg-slate-50">
                      Sign Up Free
                    </Button>
                  </a>
                </CardFooter>
              </Card>

              {/* Paid Tier */}
              <Card className="border-2 border-emerald-500 shadow-2xl shadow-emerald-600/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-green-400"></div>

                <CardHeader className="space-y-4 pb-8">
                  <div className="inline-block">
                    <div className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                      MOST POPULAR
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Audit Ready</CardTitle>
                    <CardDescription className="text-base mt-2">For closing the deal</CardDescription>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-slate-900">$49</span>
                      <span className="text-lg text-slate-500">/report</span>
                    </div>
                    <div className="text-sm text-slate-500 mt-1">One-time payment</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-900 font-semibold">Official PDF certificate</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Evidence attachment links</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Supplier questionnaire CSV</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Email support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <a href="/auth" className="w-full">
                    <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20">
                      Get Started
                    </Button>
                  </a>
                </CardFooter>
              </Card>

            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-slate-50 py-12">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="text-xl font-bold text-slate-900">
                  ESG<span className="text-emerald-600">Fast</span>
                </div>
                <span className="text-slate-400">|</span>
                <p className="text-sm text-slate-600">
                  Built for the Supply Chain
                </p>
              </div>
              <p className="text-xs text-slate-500 max-w-md text-center md:text-right leading-relaxed">
                © 2025 ESGFast. This tool does not provide legal advice or certified audits. Users are responsible for the accuracy of their data.
              </p>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}