import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">

      {/* Navbar */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="text-xl font-bold tracking-tight text-slate-900">ESG<span className="text-green-600">Fast</span></div>
        <div className="flex gap-4">
          <a href="/auth">
            <Button variant="ghost">Log In</Button>
          </a>
          <a href="/auth">
            <Button>Get Started</Button>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
              Generate your SMB ESG Report in <span className="text-green-600">15 minutes</span>.
            </h1>
            <p className="max-w-[42rem] leading-normal text-slate-500 sm:text-xl sm:leading-8">
              Don't lose contracts because you can't fill out a sustainability questionnaire.
              Get compliance-ready reports designed for Logistics, Manufacturing, and Small Business.
            </p>
            <div className="space-x-4">
              <a href="/auth">
                <Button size="lg" className="h-11 px-8">
                  Start Report (Free Draft) <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-slate-50 py-16 md:py-24">
          <div className="container max-w-5xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-slate-900">
              Simple Pricing. No Monthly Fees.
            </h2>

            <div className="grid gap-8 md:grid-cols-2">

              {/* Free Tier */}
              <Card>
                <CardHeader>
                  <CardTitle>Draft Mode</CardTitle>
                  <CardDescription>Get your data organized.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">$0</div>
                  <ul className="mt-6 space-y-3 text-sm text-slate-600">
                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Unlimited Data Entry</li>
                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Secure Cloud Storage</li>
                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Basic Dashboard</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <a href="/auth" className="w-full">
                    <Button variant="outline" className="w-full">Sign Up Free</Button>
                  </a>
                </CardFooter>
              </Card>

              {/* Paid Tier */}
              <Card className="border-2 border-green-500 shadow-lg">
                <CardHeader>
                  <div className="mb-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                    MOST POPULAR
                  </div>
                  <CardTitle>Audit Ready</CardTitle>
                  <CardDescription>For closing the deal.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">$49 <span className="text-lg font-normal text-slate-500">/report</span></div>
                  <ul className="mt-6 space-y-3 text-sm text-slate-600">
                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> <span className="font-bold text-slate-900">Official PDF Certificate</span></li>
                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Evidence Attachment Links</li>
                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Supplier Questionnaire CSV</li>
                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Email Support</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <a href="/auth" className="w-full">
                    <Button className="w-full bg-green-600 hover:bg-green-700">Get Started</Button>
                  </a>
                </CardFooter>
              </Card>

            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-white py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-slate-600 md:text-left">
              Built for the Supply Chain. © 2025 ESG Fast.
            </p>
            <p className="text-center text-xs text-slate-400 max-w-sm">
              DISCLAIMER: This tool does not provide legal advice or certified audits. Users are responsible for the accuracy of their data.
            </p>
          </div>
        </footer>

      </main>
    </div>
  );
}