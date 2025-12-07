"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { calculateTotalEmissions, calculateItemImpact } from "@/lib/esg-utils";

export default function ReportPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [companyName, setCompanyName] = useState("");
    const [metrics, setMetrics] = useState<any[]>([]);
    const [totalCO2, setTotalCO2] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/auth"); return; }

            // Get Company Name
            const { data: companyData } = await supabase
                .from('companies')
                .select('company_name')
                .eq('user_id', user.id)
                .single();
            if (companyData) setCompanyName(companyData.company_name);

            // Get Metrics
            const { data: metricsData } = await supabase
                .from('metrics')
                .select('*')
                .eq('user_id', user.id);

            if (metricsData) {
                setMetrics(metricsData);
                // Calculate Total CO2 using shared logic
                setTotalCO2(calculateTotalEmissions(metricsData));
            }
            setLoading(false);
        };

        fetchData();
    }, [router]);

    const generatePDF = () => {
        const doc = new jsPDF();

        // 1. Header
        doc.setFontSize(22);
        doc.text(companyName, 14, 22);
        doc.setFontSize(12);
        doc.text("ESG Carbon Footprint Report", 14, 32);
        doc.line(14, 35, 196, 35); // Horizontal line

        // 2. Summary
        doc.setFontSize(14);
        doc.text(`Total Estimated Emissions: ${totalCO2.toFixed(2)} Tons CO2e`, 14, 45);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 52);

        // 3. The Table
        const tableData = metrics.map(m => [
            m.date_logged,
            m.category.toUpperCase(),
            m.description,
            `${m.amount} ${m.unit}`,
            `${calculateItemImpact(m).toFixed(2)} kg CO2`
        ]);

        autoTable(doc, {
            head: [['Date', 'Category', 'Description', 'Input', 'Est. Impact']],
            body: tableData,
            startY: 60,
        });

        // 4. Footer & Disclaimer
        doc.setFontSize(8);
        const disclaimer = "DISCLAIMER: This report is based on data provided by the user. [Your App Name] does not verify the accuracy of the data and this report does not constitute a certified audit or legal advice. Use at your own risk.";

        // Split text to fit page width
        const splitDisclaimer = doc.splitTextToSize(disclaimer, 180);
        doc.text(splitDisclaimer, 14, 275);

        // 5. Save
        doc.save(`${companyName.replace(/\s+/g, '_')}_ESG_Report.pdf`);
    };

    if (loading) return <div className="p-10">Calculating Emissions...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <h1 className="text-2xl font-bold">Carbon Impact Report</h1>
                </div>

                <Card className="mb-8 border-l-4 border-l-green-500">
                    <CardHeader>
                        <CardTitle>Total Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold text-slate-900">
                            {totalCO2.toFixed(3)} <span className="text-xl font-normal text-slate-500">Tons CO2e</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                            Based on {metrics.length} data entries.
                        </p>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button size="lg" onClick={generatePDF} className="bg-slate-900 hover:bg-slate-800">
                        <Download className="mr-2 h-4 w-4" /> Download Official PDF
                    </Button>
                </div>
            </div>
        </div>
    );
}
