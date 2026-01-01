"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, LogOut, Zap, Flame, Droplets, TrendingUp, CloudFog, Recycle, ShieldAlert, Scale, Trash2, User, Users } from "lucide-react";
import { Metric } from "@/lib/esg-utils";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [companyName, setCompanyName] = useState("");
    const [metrics, setMetrics] = useState<Metric[]>([]);

    // Derived KPI values

    // Flows (Sum up over time)
    const electricity = metrics
        .filter(m => m.category === 'electricity')
        .reduce((s, m) => s + (Number(m.amount) || 0), 0);

    // Support both 'fuel' (old) and 'diesel' (new) categories for Diesel
    const diesel = metrics
        .filter(m => m.category === 'fuel' || m.category === 'diesel')
        .reduce((s, m) => s + (Number(m.amount) || 0), 0);

    const petrol = metrics
        .filter(m => m.category === 'petrol')
        .reduce((s, m) => s + (Number(m.amount) || 0), 0);

    // Total Emissions Calculation (tonnes CO2e)
    // Electricity: 0.8 kg/kWh -> /1000 for tonnes
    // Diesel: 2.68 kg/L -> /1000 for tonnes
    // Petrol: 2.31 kg/L -> /1000 for tonnes
    const totalEmissions = (electricity * 0.8 / 1000) + (diesel * 2.68 / 1000) + (petrol * 2.31 / 1000);

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

    // Stocks (Status at a point in time) -> Take the most recent entry
    // Metrics are ordered by created_at desc in fetch
    const latestEmployeeMetric = metrics.find(m => m.category === 'employees');
    const employeesTotal = latestEmployeeMetric ? (Number(latestEmployeeMetric.amount) || 0) : 0;

    // Female Share
    const latestFemaleMetric = metrics.find(m => m.category === 'employees_female');
    const employeesFemale = latestFemaleMetric ? (Number(latestFemaleMetric.amount) || 0) : 0;

    const femaleSharePct = employeesTotal > 0 ? (employeesFemale / employeesTotal) * 100 : 0;

    const accidentRate = employeesTotal > 0 ? (accidentsTotal / employeesTotal) * 100 : 0;

    const latestGovYes = metrics.find(m => m.category === 'governance_yes');
    const govYes = latestGovYes ? (Number(latestGovYes.amount) || 0) : 0;

    const latestGovTotal = metrics.find(m => m.category === 'governance_total');
    const govTotal = latestGovTotal ? (Number(latestGovTotal.amount) || 6) : 6;

    const governanceScore = govTotal > 0 ? (govYes / govTotal) * 100 : 0;

    // Data Completeness Calculation
    // Required categories: electricity, fuel (diesel/petrol), waste, employees, accidents, governance
    const hasElectricity = electricity > 0;
    const hasFuel = diesel > 0 || petrol > 0;
    const hasWaste = wasteTotal > 0;
    const hasEmployees = employeesTotal > 0;
    const hasAccidents = metrics.some(m => m.category === 'accidents'); // Check existence even if 0
    const hasGovernance = metrics.some(m => m.category.startsWith('governance'));

    const requiredCats = [hasElectricity, hasFuel, hasWaste, hasEmployees, hasAccidents, hasGovernance];
    const completedCats = requiredCats.filter(Boolean).length;
    const completenessPct = (completedCats / requiredCats.length) * 100;


    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            // 1. Get User
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) console.error("Auth Error:", userError);
            if (!user) {
                router.push("/auth");
                return;
            }

            // 2. Get Company Details
            const { data: companyData, error: companyError } = await supabase
                .from('companies')
                .select('company_name')
                .eq('user_id', user.id)
                .single();

            if (companyError && companyError.code !== 'PGRST116') { // Ignore "Row not found" error for new users
                 console.error("Company Fetch Error:", companyError);
            }

            if (isMounted && companyData) setCompanyName(companyData.company_name);

            // 3. Get Metrics (The data they entered)
            const { data: metricsData, error: metricsError } = await supabase
                .from('metrics')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (metricsError) console.error("Metrics Fetch Error:", metricsError);

            if (isMounted && metricsData) {
                setMetrics(metricsData as Metric[]);
            }

            if (isMounted) setLoading(false);
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading) return <div className="p-10 flex min-h-screen items-center justify-center text-primary font-serif">Loading Dashboard...</div>;

    const getIconForCategory = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('electricity') || cat.includes('energy')) return <Zap className="h-5 w-5 text-yellow-600" />;
        if (cat.includes('fuel') || cat.includes('diesel') || cat.includes('petrol')) return <Flame className="h-5 w-5 text-orange-600" />;
        if (cat.includes('water')) return <Droplets className="h-5 w-5 text-blue-600" />;
        if (cat.includes('waste')) {
            if (cat.includes('recycle')) return <Recycle className="h-5 w-5 text-green-600" />;
            return <Trash2 className="h-5 w-5 text-stone-600" />;
        }
        if (cat.includes('employee') || cat.includes('social')) return <Users className="h-5 w-5 text-purple-600" />;
        return <TrendingUp className="h-5 w-5 text-primary" />;
    };

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

                {/* Data Completeness Bar */}
                <Card className="shadow-sm border-border/60 bg-card/50 backdrop-blur-sm p-4 flex items-center gap-4">
                    <div className="flex-1">
                        <div className="flex justify-between mb-2">
                            <h3 className="text-sm font-medium text-foreground">Data Completeness</h3>
                            <span className="text-sm text-muted-foreground">{Math.round(completenessPct)}%</span>
                        </div>
                        <Progress value={completenessPct} className="h-2" />
                    </div>
                </Card>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-4">
                    {/* Estimated Emissions */}
                    <Card className="shadow-sm border-border/60 bg-card/50 backdrop-blur-sm relative overflow-hidden">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Emissions</CardTitle>
                            <CloudFog className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="font-serif text-3xl font-bold text-foreground mb-1">
                                {totalEmissions.toFixed(1)} <span className="text-sm font-sans font-normal text-muted-foreground">tCO₂e</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Target: 200 tCO₂e</p>
                        </CardContent>
                    </Card>

                    {/* Accident Rate */}
                    <Card className="shadow-sm border-border/60 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Accident Rate</CardTitle>
                            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="font-serif text-3xl font-bold text-foreground">{accidentRate.toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground mt-1">{accidentsTotal} accidents / {employeesTotal} employees</p>
                        </CardContent>
                    </Card>

                    {/* Governance Score */}
                    <Card className="shadow-sm border-border/60 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Governance Score</CardTitle>
                            <Scale className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="font-serif text-3xl font-bold text-foreground">{governanceScore.toFixed(0)}%</div>
                            <p className="text-xs text-muted-foreground mt-1">{govYes} of {govTotal} policies</p>
                        </CardContent>
                    </Card>

                    {/* Female Employees */}
                    <Card className="shadow-sm border-border/60 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Female Employees</CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="font-serif text-3xl font-bold text-foreground">{femaleSharePct.toFixed(0)}%</div>
                            <p className="text-xs text-muted-foreground mt-1">{employeesFemale} / {employeesTotal}</p>
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
                                            <p className="text-xs text-muted-foreground">{new Date(item.date_logged || item.created_at).toLocaleDateString()}</p>
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
