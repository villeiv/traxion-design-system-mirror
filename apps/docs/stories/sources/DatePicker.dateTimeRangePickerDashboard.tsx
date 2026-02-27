import { useState } from "react";
import { differenceInHours } from "date-fns";
import { BarChart3, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import type { DateRange } from "@traxion-global/design-system/react";
import {
    DateTimeRangePicker,
    Label,
    StatCard,
} from "@traxion-global/design-system/react";

interface DashboardData {
    revenue: string;
    orders: number;
    conversionRate: string;
    netIncome: string;
}

function computeData(range: DateRange): DashboardData {
    const hours =
        range.from && range.to
            ? differenceInHours(range.to, range.from)
            : 0;
    const revenue = hours * 487.5;
    const netIncome = revenue * 0.34;
    return {
        revenue: `$${revenue.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
        orders: Math.floor(hours * 4.2),
        conversionRate: `${(3.8 + (hours % 7) * 0.1).toFixed(1)}%`,
        netIncome: `$${netIncome.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
    };
}

export default function DatePickerDateTimeRangePickerDashboard() {
    const [range, setRange] = useState<DateRange | undefined>();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DashboardData | null>(null);

    function handleChange(newRange: DateRange | undefined) {
        setRange(newRange);
        if (newRange?.from && newRange?.to) {
            setLoading(true);
            setTimeout(() => {
                setData(computeData(newRange));
                setLoading(false);
            }, 800);
        } else {
            setData(null);
        }
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-xl">
            <div className="flex gap-4 justify-between items-center">
                <Label className="whitespace-nowrap" >Selecciona un periodo para el reporte: </Label>
                <DateTimeRangePicker
                    value={range}
                    onChange={handleChange}
                    placeholder="Selecciona el periodo"
                    localeCode="es"
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <StatCard
                    label="Ingresos totales"
                    value={data ? data.revenue : "—"}
                    icon={<DollarSign className="h-5 w-5" />}
                    iconVariant="green"
                    trend={data ? 12 : undefined}
                    trendLabel="vs período anterior"
                    loading={loading}
                />
                <StatCard
                    label="Órdenes procesadas"
                    value={data ? data.orders : "—"}
                    icon={<ShoppingCart className="h-5 w-5" />}
                    iconVariant="primary"
                    trend={data ? 8 : undefined}
                    trendLabel="vs período anterior"
                    loading={loading}
                />
                <StatCard
                    label="Tasa de conversión"
                    value={data ? data.conversionRate : "—"}
                    icon={<TrendingUp className="h-5 w-5" />}
                    iconVariant="yellow"
                    trend={data ? -2 : undefined}
                    trendSentiment="negative"
                    trendLabel="vs período anterior"
                    loading={loading}
                />
                <StatCard
                    label="Ingreso neto"
                    value={data ? data.netIncome : "—"}
                    icon={<BarChart3 className="h-5 w-5" />}
                    iconVariant="secondary"
                    trend={data ? 15 : undefined}
                    trendLabel="vs período anterior"
                    loading={loading}
                />
            </div>
        </div>
    );
}
