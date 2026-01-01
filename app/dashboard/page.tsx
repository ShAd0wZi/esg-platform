"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, LogOut, Zap, Flame, Droplets, TrendingUp } from "lucide-react";
import { Metric } from "@/lib/esg-utils";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [companyName, setCompanyName] = useState("");
    const [metrics, setMetrics] = useState<Metric[]>([]);

    // Derived KPI values
    const electricity = metrics
        .filter(m => m.category === 'electricity')
        .reduce((s, m) => s + (Number(m.amount) || 0), 0);

    const diesel = metrics
        .filter(m => m.category === 'fuel')
        .reduce((s, m) => s + (Number(m.amount) || 0), 0);

    // Emissions: (Elec * 0.8) + (Diesel * 2.68)
    const totalEmissions = (electricity * 0.8) + (diesel * 2.68);

    const wasteTotal = metrics
        .filter(m => m.category === 'waste')
        .reduce((s, m) => s + (Number(m.amount) || 0), 0);

    const wasteRecycled = metrics
        .filter(m => m.category === 'waste_recycled')
        .reduce((s, m) => s + (Number(m.amount) || 0), 0);

    const recycleRate = wasteTotal > 0 ? (wasteRecycled / wasteTotal) * 100 : 0;

    const accidentsTotal = metrics
        .filter(m => m.category === 'accidents')
        .reduce((s, m) => s + (Number(m.amount) || 0), 0);

    // We take the latest employee count entry or sum if they are additive (assuming latest snapshot for now or sum if data is monthly)
    // For simplicity, let's sum them up but usually employee count is a status not a flow. 
    // However, to keep it simple with existing "summing" logic:
    const employeesTotal = metrics
        .filter(m => m.category === 'employees')
        .reduce((s, m) => s + (Number(m.amount) || 0), 0);

    // Accident Rate %
    const accidentRate = employeesTotal > 0 ? (accidentsTotal / employeesTotal) * 100 : 0;

    const govYes = metrics
        .filter(m => m.category === 'governance_yes')
        .reduce((s, m) => s + (Number(m.amount) || 0), 0);

    const govTotal = metrics
        .filter(m => m.category === 'governance_total')
        .reduce((s, m) => s + (Number(m.amount) || 0), 0);

    const governanceScore = govTotal > 0 ? (govYes / govTotal) * 100 : 0;

    // Mock trend - in real app, calculate from previous period
    const trend = -12;

    useEffect(() => {
        const fetchData = async () => {
            // 1. Get User
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth");
                return;
            }

            // 2. Get Company Details
            const { data: companyData } = await supabase
                .from('companies')
                .select('company_name')
                .eq('user_id', user.id)
                .single();

            if (companyData) setCompanyName(companyData.company_name);

            // 3. Get Metrics (The data they entered)
            const { data: metricsData } = await supabase
                .from('metrics')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (metricsData) {
                setMetrics(metricsData as Metric[]);
                // Calculate emissions using shared logic

            }

            setLoading(false);
        };

        fetchData();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading) return <div className="p-10 flex min-h-screen items-center justify-center text-primary font-serif">Loading Dashboard...</div>;

    const getIconForCategory = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('electricity') || cat.includes('energy')) return <Zap className="h-5 w-5 text-yellow-600" />;
        if (cat.includes('fuel') || cat.includes('gas')) return <Flame className="h-5 w-5 text-orange-600" />;
        if (cat.includes('water')) return <Droplets className="h-5 w-5 text-blue-600" />;
        return <TrendingUp className="h-5 w-5 text-primary" />;
    };

    // Calculate progress percentage (mock target of 1000 tons)
    const emissionTarget = 1000;




    return (
        <div className="min-h-screen bg-background">
            {/* Sticky Glass Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/40 bg-background/80 px-8 py-4 backdrop-blur-md">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-foreground">{companyName || "Company Dashboard"}</h1>
                    <p className="text-sm text-muted-foreground">ESG Overview</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleLogout} className="border-border/50 shadow-sm hover:bg-secondary/50">
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </Button>
                    <Link href="/dashboard/report">
                        <Button variant="secondary" className="shadow-sm bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-200">
                            View Report
                        </Button>
                    </Link>
                    <Link href="/dashboard/add">
                        <Button className="shadow-md bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Plus className="mr-2 h-4 w-4" /> Add Data
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="p-8 space-y-8 max-w-7xl mx-auto">
                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-4">
                    {/* Estimated Emissions */}
                    <Card className="shadow-sm border-border/60 bg-card/50 backdrop-blur-sm relative overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Est. Emissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="font-serif text-3xl font-bold text-foreground mb-1">
                                {(totalEmissions / 1000).toFixed(1)} <span className="text-sm font-sans font-normal text-muted-foreground">tCO₂e</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Target: 200 tCO₂e</p>
                            <Progress value={Math.min((totalEmissions / 1000 / 200) * 100, 100)} className="h-1 mt-2" />
                        </CardContent>
                    </Card>

                    {/* Waste Recycled */}
                    <Card className="shadow-sm border-border/60 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Waste Recycled</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="font-serif text-3xl font-bold text-foreground">{recycleRate.toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {wasteRecycled.toLocaleString()} kg / {wasteTotal.toLocaleString()} kg
                            </p>
                        </CardContent>
                    </Card>

                    {/* Accident Rate */}
                    <Card className="shadow-sm border-border/60 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Accident Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="font-serif text-3xl font-bold text-foreground">{accidentRate.toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground mt-1">{accidentsTotal} accidents / {employeesTotal} employees</p>
                        </CardContent>
                    </Card>

                    {/* Governance Score */}
                    <Card className="shadow-sm border-border/60 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Governance Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="font-serif text-3xl font-bold text-foreground">{governanceScore.toFixed(0)}%</div>
                            <p className="text-xs text-muted-foreground mt-1">{govYes} of {govTotal} policies</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-serif text-2xl font-bold text-foreground">Recent Activity</h2>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">View All</Button>
                    </div>

                    {metrics.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border/60 p-12 text-center text-muted-foreground bg-card/30">
                            <p>No data found. Click &quot;Add Data&quot; to start tracking.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {metrics.map((item) => (
                                <Card key={item.id} className="shadow-sm border-border/40 hover:shadow-md transition-shadow duration-200 bg-card/80">
                                    <CardContent className="flex items-center p-4 gap-4">
                                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                                            {getIconForCategory(item.category)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-foreground capitalize truncate">{item.category}</p>
                                            <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                                        </div>
                                        {item.image_url && (
                                            <a href={item.image_url} target="_blank" className="hidden sm:block text-xs font-medium text-primary hover:underline px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                                                Receipt
                                            </a>
                                        )}
                                        <div className="text-right shrink-0 min-w-[100px]">
                                            <p className="font-bold text-lg font-serif">{item.amount} <span className="text-xs font-sans font-normal text-muted-foreground">{item.unit}</span></p>
                                            <p className="text-xs text-muted-foreground">{new Date(item.date_logged).toLocaleDateString()}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
