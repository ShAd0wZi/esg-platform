"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function AddData() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // --- State for all inputs ---

    // Environmental
    const [electricity, setElectricity] = useState("");
    const [diesel, setDiesel] = useState("");
    const [wasteGeneral, setWasteGeneral] = useState("");
    const [wasteRecycled, setWasteRecycled] = useState("");

    // Social
    const [employeesFemale, setEmployeesFemale] = useState("");
    const [employeesMale, setEmployeesMale] = useState("");
    const [employeesPermanent, setEmployeesPermanent] = useState("");
    const [employeesContract, setEmployeesContract] = useState("");
    const [accidentsRecordable, setAccidentsRecordable] = useState("0");
    const [accidentsFatalities, setAccidentsFatalities] = useState("0");

    // Governance (Toggles - store as boolean)
    const [govCodeConduct, setGovCodeConduct] = useState(false);
    const [govAntiBribery, setGovAntiBribery] = useState(false);
    const [govWhistleblower, setGovWhistleblower] = useState(false);
    const [govDataPrivacy, setGovDataPrivacy] = useState(false);
    const [govBoardOversight, setGovBoardOversight] = useState(false);
    const [govSupplierCode, setGovSupplierCode] = useState(false);

    // Common
    const [description, setDescription] = useState("");

    // Calculations for UI feedback
    const elecCo2 = (parseFloat(electricity) || 0) * 0.8;
    const dieselCo2 = (parseFloat(diesel) || 0) * 2.68;
    const totalEmissions = elecCo2 + dieselCo2;

    const totalEmployees = (parseInt(employeesFemale) || 0) + (parseInt(employeesMale) || 0);
    const totalWaste = (parseFloat(wasteGeneral) || 0) + (parseFloat(wasteRecycled) || 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("Please login");
            router.push("/auth");
            return;
        }

        // Prepare batch data
        // We will map our specific inputs to "category" strings that the dashboard expects.
        // Dashboard expects:
        // 'electricity', 'fuel' (diesel), 'waste', 'waste_recycled'
        // 'employees', 'accidents'
        // 'governance_yes' (count of yes), 'governance_total' (total policies checked - usually 6)

        // Correction: The previous dashboard prompt implies we store granular data.
        // However, to fit existing schema (category, amount, unit), we will create multiple rows.

        const entries = [];
        const timestamp = new Date().toISOString();

        // 1. Environmental
        if (electricity) entries.push({ user_id: user.id, category: 'electricity', amount: parseFloat(electricity), unit: 'kWh', description, created_at: timestamp });
        if (diesel) entries.push({ user_id: user.id, category: 'fuel', amount: parseFloat(diesel), unit: 'liters', description, created_at: timestamp });
        if (totalWaste > 0) entries.push({ user_id: user.id, category: 'waste', amount: totalWaste, unit: 'kg', description, created_at: timestamp });
        if (wasteRecycled) entries.push({ user_id: user.id, category: 'waste_recycled', amount: parseFloat(wasteRecycled), unit: 'kg', description, created_at: timestamp });

        // 2. Social
        if (totalEmployees > 0) entries.push({ user_id: user.id, category: 'employees', amount: totalEmployees, unit: 'count', description, created_at: timestamp });
        if (employeesFemale) entries.push({ user_id: user.id, category: 'employees_female', amount: parseInt(employeesFemale), unit: 'count', description, created_at: timestamp });
        if (parseInt(accidentsRecordable) >= 0) entries.push({ user_id: user.id, category: 'accidents', amount: parseInt(accidentsRecordable), unit: 'count', description, created_at: timestamp });

        // 3. Governance
        // We will calculate the score here or store raw "Yes" counts.
        // Let's store the total Yes count and the Total policies count so we can calc % later.
        let yesCount = 0;
        if (govCodeConduct) yesCount++;
        if (govAntiBribery) yesCount++;
        if (govWhistleblower) yesCount++;
        if (govDataPrivacy) yesCount++;
        if (govBoardOversight) yesCount++;
        if (govSupplierCode) yesCount++;

        entries.push({ user_id: user.id, category: 'governance_yes', amount: yesCount, unit: 'count', description, created_at: timestamp });
        entries.push({ user_id: user.id, category: 'governance_total', amount: 6, unit: 'count', description, created_at: timestamp });


        const { error } = await supabase
            .from('metrics')
            .insert(entries);

        if (error) {
            alert("Error: " + error.message);
        } else {
            router.push("/dashboard");
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-2xl my-8">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle>Log Comprehensive ESG Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Section 1: Environmental */}
                        <div className="space-y-4 border-b pb-4">
                            <h3 className="font-semibold text-lg text-slate-800">Environmental Data</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Electricity Consumption (kWh)</Label>
                                    <Input type="number" value={electricity} onChange={e => setElectricity(e.target.value)} placeholder="0" />
                                    <p className="text-xs text-muted-foreground">Est. {elecCo2.toLocaleString()} kg CO₂e</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Diesel Consumption (Liters)</Label>
                                    <Input type="number" value={diesel} onChange={e => setDiesel(e.target.value)} placeholder="0" />
                                    <p className="text-xs text-muted-foreground">Est. {dieselCo2.toLocaleString()} kg CO₂e</p>
                                </div>
                            </div>

                            <div className="p-3 bg-slate-100 rounded-md text-sm font-medium text-slate-700">
                                Total Estimated Emissions: {totalEmissions.toLocaleString()} kg CO₂e ({(totalEmissions / 1000).toFixed(2)} tCO₂e)
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>General Waste (kg)</Label>
                                    <Input type="number" value={wasteGeneral} onChange={e => setWasteGeneral(e.target.value)} placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Recycled Waste (kg)</Label>
                                    <Input type="number" value={wasteRecycled} onChange={e => setWasteRecycled(e.target.value)} placeholder="0" />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Social */}
                        <div className="space-y-4 border-b pb-4">
                            <h3 className="font-semibold text-lg text-slate-800">Social Data</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Female Employees</Label>
                                    <Input type="number" value={employeesFemale} onChange={e => setEmployeesFemale(e.target.value)} placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Male Employees</Label>
                                    <Input type="number" value={employeesMale} onChange={e => setEmployeesMale(e.target.value)} placeholder="0" />
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">Total Employees: {totalEmployees}</div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Permanent Staff</Label>
                                    <Input type="number" value={employeesPermanent} onChange={e => setEmployeesPermanent(e.target.value)} placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Contract Staff</Label>
                                    <Input type="number" value={employeesContract} onChange={e => setEmployeesContract(e.target.value)} placeholder="0" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Workplace Accidents (Recordable)</Label>
                                <Input type="number" value={accidentsRecordable} onChange={e => setAccidentsRecordable(e.target.value)} placeholder="0" />
                            </div>
                        </div>

                        {/* Section 3: Governance */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-slate-800">Governance Policies</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-slate-50">
                                    <input type="checkbox" checked={govCodeConduct} onChange={e => setGovCodeConduct(e.target.checked)} className="h-4 w-4" />
                                    <span className="text-sm">Code of Conduct</span>
                                </label>
                                <label className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-slate-50">
                                    <input type="checkbox" checked={govAntiBribery} onChange={e => setGovAntiBribery(e.target.checked)} className="h-4 w-4" />
                                    <span className="text-sm">Anti-bribery Policy</span>
                                </label>
                                <label className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-slate-50">
                                    <input type="checkbox" checked={govWhistleblower} onChange={e => setGovWhistleblower(e.target.checked)} className="h-4 w-4" />
                                    <span className="text-sm">Whistleblower Channel</span>
                                </label>
                                <label className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-slate-50">
                                    <input type="checkbox" checked={govDataPrivacy} onChange={e => setGovDataPrivacy(e.target.checked)} className="h-4 w-4" />
                                    <span className="text-sm">Data Protection Policy</span>
                                </label>
                                <label className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-slate-50">
                                    <input type="checkbox" checked={govBoardOversight} onChange={e => setGovBoardOversight(e.target.checked)} className="h-4 w-4" />
                                    <span className="text-sm">Board Oversight of ESG</span>
                                </label>
                                <label className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-slate-50">
                                    <input type="checkbox" checked={govSupplierCode} onChange={e => setGovSupplierCode(e.target.checked)} className="h-4 w-4" />
                                    <span className="text-sm">Supplier Code of Conduct</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t">
                            <Label>Description / Month for this Report</Label>
                            <Input
                                placeholder="e.g. 2024 Annual Report Data"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Saving Batch Data..." : "Submit All Data"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}