"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function Onboarding() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [companyName, setCompanyName] = useState("");
    const [industry, setIndustry] = useState("");
    const [employees, setEmployees] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 1. Get the current logged in user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            alert("Error: You must be logged in!");
            setLoading(false);
            return;
        }

        // 2. Insert data into Supabase
        const { error } = await supabase
            .from('companies')
            .insert([
                {
                    user_id: user.id,
                    company_name: companyName,
                    industry: industry,
                    employee_count: parseInt(employees)
                }
            ]);

        if (error) {
            console.error(error);
            alert("Error saving profile: " + error.message);
        } else {
            // Success! Redirect to dashboard (we will build this next)
            alert("Company Profile Created!");
            router.push("/dashboard");
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create Company Profile</CardTitle>
                    <CardDescription>Tell us about your organization to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="name">Company Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Acme Solar"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Input
                                id="industry"
                                placeholder="e.g. Manufacturing"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="employees">Employee Count</Label>
                            <Input
                                id="employees"
                                type="number"
                                placeholder="e.g. 50"
                                value={employees}
                                onChange={(e) => setEmployees(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Saving..." : "Create Profile"}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}