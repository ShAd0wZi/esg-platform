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

    const [category, setCategory] = useState("electricity");
    const [amount, setAmount] = useState("");
    const [unit, setUnit] = useState("kwh");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("Please login");
            router.push("/auth");
            return;
        }

        let uploadedImageUrl = null;

        // 1. Handle File Upload if exists
        if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`; // Create unique path

            const { data: fileData, error: uploadError } = await supabase
                .storage
                .from('bills')
                .upload(fileName, file);

            if (uploadError) {
                alert("Upload failed: " + uploadError.message);
                setLoading(false);
                return;
            }

            // Get the Public URL
            const { data: { publicUrl } } = supabase
                .storage
                .from('bills')
                .getPublicUrl(fileName);

            uploadedImageUrl = publicUrl;
        }

        // 2. Save Data to DB
        const { error } = await supabase
            .from('metrics')
            .insert([
                {
                    user_id: user.id,
                    category,
                    amount: parseFloat(amount),
                    unit,
                    description,
                    image_url: uploadedImageUrl // Save the link!
                }
            ]);

        if (error) {
            alert("Error: " + error.message);
        } else {
            router.push("/dashboard");
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle>Log ESG Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="electricity">Electricity</option>
                                <option value="fuel">Fuel / Transport</option>
                                <option value="waste">Waste</option>
                                <option value="water">Water</option>
                            </select>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-2/3 space-y-2">
                                <Label>Amount</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="w-1/3 space-y-2">
                                <Label>Unit</Label>
                                <Input
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    placeholder="kwh"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Proof (Optional)</Label>
                            <div className="flex items-center gap-2 rounded-md border border-dashed p-4">
                                <UploadCloud className="h-5 w-5 text-slate-400" />
                                <Input
                                    type="file"
                                    className="border-0 bg-transparent p-0 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-xs file:font-semibold hover:file:bg-slate-200"
                                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description / Month</Label>
                            <Input
                                placeholder="e.g. January Office Bill"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Uploading & Saving..." : "Save Entry"}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}