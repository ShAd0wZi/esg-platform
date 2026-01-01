"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, UploadCloud } from "lucide-react";

export default function AddData() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // --- State for all inputs ---

    // Environmental
    const [electricity, setElectricity] = useState("");
    const [fileElec, setFileElec] = useState<File | null>(null);

    const [diesel, setDiesel] = useState("");
    const [fileFuel, setFileFuel] = useState<File | null>(null);

    const [otherFuel, setOtherFuel] = useState("");
    const [otherFuelUnit, setOtherFuelUnit] = useState("kg");

    const [wasteGeneral, setWasteGeneral] = useState("");
    const [wasteRecycled, setWasteRecycled] = useState("");
    const [wasteHazardous, setWasteHazardous] = useState("");
    const [fileWaste, setFileWaste] = useState<File | null>(null);

    // Social
    const [employeesTotal, setEmployeesTotal] = useState("");
    const [employeesFemale, setEmployeesFemale] = useState("");
    const [employeesMale, setEmployeesMale] = useState("");
    const [employeesPermanent, setEmployeesPermanent] = useState("");
    const [employeesContract, setEmployeesContract] = useState("");

    const [accidentsRecordable, setAccidentsRecordable] = useState("0");
    const [accidentsFatalities, setAccidentsFatalities] = useState("0");

    // Governance (Toggles)
    const [govCodeConduct, setGovCodeConduct] = useState(false);
    const [govAntiBribery, setGovAntiBribery] = useState(false);
    const [govWhistleblower, setGovWhistleblower] = useState(false);
    const [govDataPrivacy, setGovDataPrivacy] = useState(false);
    const [govBoardOversight, setGovBoardOversight] = useState(false);
    const [govSupplierCode, setGovSupplierCode] = useState(false);
    const [fileGov, setFileGov] = useState<File | null>(null);

    // Common
    const [description, setDescription] = useState("");

    // Helpers
    const uploadFile = async (file: File, userId: string): Promise<string | null> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error } = await supabase.storage.from('bills').upload(fileName, file);
        if (error) {
            console.error("Upload failed", error);
            return null;
        }
        const { data } = supabase.storage.from('bills').getPublicUrl(fileName);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("Please login");
            router.push("/auth");
            return;
        }

        // Upload files
        let urlElec = null;
        let urlFuel = null;
        let urlWaste = null;
        let urlGov = null;

        if (fileElec) urlElec = await uploadFile(fileElec, user.id);
        if (fileFuel) urlFuel = await uploadFile(fileFuel, user.id);
        if (fileWaste) urlWaste = await uploadFile(fileWaste, user.id);
        if (fileGov) urlGov = await uploadFile(fileGov, user.id);

        const entries = [];
        const timestamp = new Date().toISOString();

        // 1. Environmental
        if (electricity) entries.push({ user_id: user.id, category: 'electricity', amount: parseFloat(electricity), unit: 'kWh', description, image_url: urlElec, created_at: timestamp });
        if (diesel) entries.push({ user_id: user.id, category: 'fuel', amount: parseFloat(diesel), unit: 'liters', description, image_url: urlFuel, created_at: timestamp });
        if (otherFuel) entries.push({ user_id: user.id, category: 'fuel_other', amount: parseFloat(otherFuel), unit: otherFuelUnit, description, created_at: timestamp });

        // Waste
        const wTotal = (parseFloat(wasteGeneral) || 0) + (parseFloat(wasteRecycled) || 0) + (parseFloat(wasteHazardous) || 0);
        if (wTotal > 0) entries.push({ user_id: user.id, category: 'waste', amount: wTotal, unit: 'kg', description, image_url: urlWaste, created_at: timestamp });
        if (wasteRecycled) entries.push({ user_id: user.id, category: 'waste_recycled', amount: parseFloat(wasteRecycled), unit: 'kg', description, created_at: timestamp });
        if (wasteHazardous) entries.push({ user_id: user.id, category: 'waste_hazardous', amount: parseFloat(wasteHazardous), unit: 'kg', description, created_at: timestamp });

        // 2. Social
        if (employeesTotal) {
            entries.push({ user_id: user.id, category: 'employees', amount: parseInt(employeesTotal), unit: 'count', description, created_at: timestamp });
        } else {
            // Fallback calc if total not explicitly entered but parts are
            const sumEmp = (parseInt(employeesFemale) || 0) + (parseInt(employeesMale) || 0);
            if (sumEmp > 0) entries.push({ user_id: user.id, category: 'employees', amount: sumEmp, unit: 'count', description, created_at: timestamp });
        }

        if (employeesFemale) entries.push({ user_id: user.id, category: 'employees_female', amount: parseInt(employeesFemale), unit: 'count', description, created_at: timestamp });
        if (employeesMale) entries.push({ user_id: user.id, category: 'employees_male', amount: parseInt(employeesMale), unit: 'count', description, created_at: timestamp });
        if (employeesPermanent) entries.push({ user_id: user.id, category: 'employees_permanent', amount: parseInt(employeesPermanent), unit: 'count', description, created_at: timestamp });
        if (employeesContract) entries.push({ user_id: user.id, category: 'employees_contract', amount: parseInt(employeesContract), unit: 'count', description, created_at: timestamp });

        if (parseInt(accidentsRecordable) >= 0) entries.push({ user_id: user.id, category: 'accidents', amount: parseInt(accidentsRecordable), unit: 'count', description, created_at: timestamp });
        if (parseInt(accidentsFatalities) >= 0) entries.push({ user_id: user.id, category: 'fatalities', amount: parseInt(accidentsFatalities), unit: 'count', description, created_at: timestamp });

        // 3. Governance
        let yesCount = 0;
        if (govCodeConduct) yesCount++;
        if (govAntiBribery) yesCount++;
        if (govWhistleblower) yesCount++;
        if (govDataPrivacy) yesCount++;
        if (govBoardOversight) yesCount++;
        if (govSupplierCode) yesCount++;

        entries.push({ user_id: user.id, category: 'governance_yes', amount: yesCount, unit: 'count', description, image_url: urlGov, created_at: timestamp });
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
            <Card className="w-full max-w-3xl my-8">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle>Log ESG Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Section 1: Environmental */}
                        <div className="space-y-6 border-b pb-6">
                            <h3 className="font-semibold text-xl text-slate-800">Environmental Fields</h3>

                            {/* Electricity */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                <div className="space-y-2">
                                    <Label>Electricity Consumption</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="number" value={electricity} onChange={e => setElectricity(e.target.value)} placeholder="Value" />
                                        <span className="text-sm font-medium text-slate-500 w-12">kWh</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Utility Bill (Evidence)</Label>
                                    <Input type="file" onChange={e => setFileElec(e.target.files?.[0] || null)} className="text-sm" />
                                </div>
                            </div>

                            {/* Fuel */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                <div className="space-y-2">
                                    <Label>Diesel/Fuel Consumption</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="number" value={diesel} onChange={e => setDiesel(e.target.value)} placeholder="Value" />
                                        <span className="text-sm font-medium text-slate-500 w-12">Liters</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Fuel Invoice (Evidence)</Label>
                                    <Input type="file" onChange={e => setFileFuel(e.target.files?.[0] || null)} className="text-sm" />
                                </div>
                            </div>

                            {/* Other Fuel */}
                            <div className="space-y-2">
                                <Label>Other Fuels (Optional)</Label>
                                <div className="flex items-center gap-2 max-w-md">
                                    <Input type="number" value={otherFuel} onChange={e => setOtherFuel(e.target.value)} placeholder="Value" />
                                    <Input value={otherFuelUnit} onChange={e => setOtherFuelUnit(e.target.value)} placeholder="Unit (e.g. kg)" className="w-32" />
                                </div>
                            </div>

                            {/* Waste */}
                            <div className="space-y-4 pt-2">
                                <Label className="text-base">Waste Management</Label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Total Generatd (kg)</Label>
                                        <Input type="number" value={wasteGeneral} onChange={e => setWasteGeneral(e.target.value)} placeholder="0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Recycled (kg)</Label>
                                        <Input type="number" value={wasteRecycled} onChange={e => setWasteRecycled(e.target.value)} placeholder="0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Hazardous (kg)</Label>
                                        <Input type="number" value={wasteHazardous} onChange={e => setWasteHazardous(e.target.value)} placeholder="Optional" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Recycling Receipts (Evidence)</Label>
                                    <Input type="file" onChange={e => setFileWaste(e.target.files?.[0] || null)} className="text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Social */}
                        <div className="space-y-6 border-b pb-6">
                            <h3 className="font-semibold text-xl text-slate-800">Social Fields</h3>

                            <div className="space-y-4">
                                <Label className="text-base">Workforce</Label>
                                <div className="space-y-2">
                                    <Label>Total Employees</Label>
                                    <Input type="number" value={employeesTotal} onChange={e => setEmployeesTotal(e.target.value)} placeholder="Total Count" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Female</Label>
                                        <Input type="number" value={employeesFemale} onChange={e => setEmployeesFemale(e.target.value)} placeholder="0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Male</Label>
                                        <Input type="number" value={employeesMale} onChange={e => setEmployeesMale(e.target.value)} placeholder="0" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Permanent</Label>
                                        <Input type="number" value={employeesPermanent} onChange={e => setEmployeesPermanent(e.target.value)} placeholder="0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Contract/Temp</Label>
                                        <Input type="number" value={employeesContract} onChange={e => setEmployeesContract(e.target.value)} placeholder="0" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <Label className="text-base">Health & Safety</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Recordable Accidents</Label>
                                        <Input type="number" value={accidentsRecordable} onChange={e => setAccidentsRecordable(e.target.value)} placeholder="0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Fatalities</Label>
                                        <Input type="number" value={accidentsFatalities} onChange={e => setAccidentsFatalities(e.target.value)} placeholder="0" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Governance */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-xl text-slate-800">Governance Fields</h3>
                                <div className="w-1/3">
                                    <Label className="text-xs mb-1 block">Policy Docs (Evidence)</Label>
                                    <Input type="file" onChange={e => setFileGov(e.target.files?.[0] || null)} className="text-sm" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input type="checkbox" checked={govCodeConduct} onChange={e => setGovCodeConduct(e.target.checked)} className="h-4 w-4 accent-primary" />
                                    <span className="text-sm">Code of Conduct</span>
                                </label>
                                <label className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input type="checkbox" checked={govAntiBribery} onChange={e => setGovAntiBribery(e.target.checked)} className="h-4 w-4 accent-primary" />
                                    <span className="text-sm">Anti-bribery / Corruption Policy</span>
                                </label>
                                <label className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input type="checkbox" checked={govWhistleblower} onChange={e => setGovWhistleblower(e.target.checked)} className="h-4 w-4 accent-primary" />
                                    <span className="text-sm">Whistleblower Policy</span>
                                </label>
                                <label className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input type="checkbox" checked={govDataPrivacy} onChange={e => setGovDataPrivacy(e.target.checked)} className="h-4 w-4 accent-primary" />
                                    <span className="text-sm">Data Protection / Privacy Policy</span>
                                </label>
                                <label className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input type="checkbox" checked={govBoardOversight} onChange={e => setGovBoardOversight(e.target.checked)} className="h-4 w-4 accent-primary" />
                                    <span className="text-sm">Board Oversight of ESG</span>
                                </label>
                                <label className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input type="checkbox" checked={govSupplierCode} onChange={e => setGovSupplierCode(e.target.checked)} className="h-4 w-4 accent-primary" />
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
                            {loading ? "Uploading & Saving..." : "Submit ESG Data"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}