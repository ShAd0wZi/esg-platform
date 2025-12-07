export const CO2_FACTORS: Record<string, number> = {
    electricity: 0.5, // kg CO2 per kWh
    fuel: 2.3,        // kg CO2 per Liter
    waste: 1.2,       // kg CO2 per kg
    water: 0.001      // kg CO2 per Liter
};

export interface Metric {
    category: string;
    amount: number;
    image_url?: string; // Optional URL for receipt image
    // other fields are optional for calculation
    [key: string]: any;
}

/**
 * Calculates total CO2 emissions in Tons from a list of metrics.
 */
export function calculateTotalEmissions(metrics: Metric[]): number {
    let total = 0;
    metrics.forEach(item => {
        const factor = CO2_FACTORS[item.category.toLowerCase()] || 0;
        total += (item.amount * factor);
    });
    return total / 1000; // Convert kg to Tons
}

/**
 * Calculates impact for a single metric item in kg CO2.
 */
export function calculateItemImpact(item: Metric): number {
    const factor = CO2_FACTORS[item.category.toLowerCase()] || 0;
    return item.amount * factor;
}
