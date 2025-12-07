"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, LogOut } from "lucide-react"; // Icons
import { calculateTotalEmissions } from "@/lib/esg-utils";

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [companyName, setCompanyName] = useState("");
    const [metrics, setMetrics] = useState<any[]>([]);
    const [totalEmissions, setTotalEmissions] = useState(0);

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
                setMetrics(metricsData);
                // Calculate emissions using shared logic
                setTotalEmissions(calculateTotalEmissions(metricsData));
            }

            setLoading(false);
        };

        fetchData();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading) return <div className="p-10">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{companyName}</h1>
                    <p className="text-slate-500">ESG Overview</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </Button>
                    <Link href="/dashboard/report">
                        <Button variant="secondary" className="mr-2">
                            View Report
                        </Button>
                    </Link>
                    <Link href="/dashboard/add">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Data
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards (Placeholders for now) */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Entries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.length}</div>
                    </CardContent>
                </Card>
                {/* We will make these real later */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Est. Carbon Footprint</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{totalEmissions.toFixed(2)} Tons</div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity List */}
            <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold">Recent Entries</h2>
                {metrics.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-slate-500">
                        No data found. Click "Add Data" to start tracking.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {metrics.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="font-bold capitalize">{item.category}</p>
                                        <p className="text-sm text-slate-500">{item.description}</p>
                                        {item.image_url && (
                                            <a href={item.image_url} target="_blank" className="text-xs text-blue-600 hover:underline">
                                                View Receipt
                                            </a>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{item.amount} {item.unit}</p>
                                        <p className="text-xs text-slate-400">{item.date_logged}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
