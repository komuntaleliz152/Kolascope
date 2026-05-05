"use client";

import { useState } from "react";
import { DollarSign, Calculator, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RateResult {
  minimumHourly: number;
  recommendedHourly: number;
  premiumHourly: number;
  monthlyTarget: number;
  billableHours: number;
}

export default function RatesPage() {
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [desiredProfit, setDesiredProfit] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [vacationWeeks, setVacationWeeks] = useState("4");
  const [result, setResult] = useState<RateResult | null>(null);

  function calculate() {
    const expenses = parseFloat(monthlyExpenses) || 0;
    const profit = parseFloat(desiredProfit) || 0;
    const hours = parseFloat(hoursPerWeek) || 40;
    const vacation = parseFloat(vacationWeeks) || 4;

    // Monthly target = expenses + desired profit
    const monthlyTarget = expenses + profit;

    // Billable hours per month (not all hours are billable — account for admin, marketing etc)
    const workWeeks = 52 - vacation;
    const billableHoursPerYear = workWeeks * hours * 0.75; // 75% billable
    const billableHoursPerMonth = billableHoursPerYear / 12;

    // Minimum rate just to cover costs
    const minimumHourly = Math.ceil(monthlyTarget / billableHoursPerMonth);

    // Recommended = minimum + 20% buffer for taxes, slow months
    const recommendedHourly = Math.ceil(minimumHourly * 1.2);

    // Premium = recommended + 30% for growth and savings
    const premiumHourly = Math.ceil(recommendedHourly * 1.3);

    setResult({
      minimumHourly,
      recommendedHourly,
      premiumHourly,
      monthlyTarget,
      billableHours: Math.round(billableHoursPerMonth),
    });
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rate Calculator</h1>
        <p className="text-white/50">Find out what you should charge per hour to hit your income goals.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calculator className="w-4 h-4 text-violet-400" /> Your Numbers
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Monthly expenses (USD) <span className="text-red-400">*</span></label>
            <p className="text-xs text-white/30">Rent, food, bills, subscriptions — everything you spend</p>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
              <input
                type="number"
                placeholder="e.g. 1500"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Desired monthly profit (USD) <span className="text-red-400">*</span></label>
            <p className="text-xs text-white/30">How much you want to save or invest each month</p>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
              <input
                type="number"
                placeholder="e.g. 500"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500"
                value={desiredProfit}
                onChange={(e) => setDesiredProfit(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Hours per week</label>
              <input
                type="number"
                placeholder="40"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Vacation weeks/yr</label>
              <input
                type="number"
                placeholder="4"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500"
                value={vacationWeeks}
                onChange={(e) => setVacationWeeks(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={calculate}
            disabled={!monthlyExpenses || !desiredProfit}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-11 font-medium"
          >
            <Calculator className="w-4 h-4 mr-2" /> Calculate My Rate
          </Button>
        </div>

        {/* Output */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Your Rates</h2>

          {result ? (
            <div className="space-y-4 flex-1">
              {/* Summary */}
              <div className="bg-white/5 rounded-xl p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Monthly target</span>
                  <span className="text-white">${result.monthlyTarget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Billable hours/month</span>
                  <span className="text-white">{result.billableHours}h</span>
                </div>
              </div>

              {/* Rate tiers */}
              <div className="space-y-3">
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-red-400">Minimum Rate</span>
                    <span className="text-2xl font-bold text-red-400">${result.minimumHourly}/hr</span>
                  </div>
                  <p className="text-xs text-white/30">Bare minimum to cover your expenses. Don't go below this.</p>
                </div>

                <div className="p-4 bg-violet-600/10 border border-violet-500/30 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-violet-400">Recommended Rate</span>
                    <span className="text-2xl font-bold text-violet-400">${result.recommendedHourly}/hr</span>
                  </div>
                  <p className="text-xs text-white/30">Includes 20% buffer for taxes and slow months. Use this as your standard rate.</p>
                </div>

                <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-green-400">Premium Rate</span>
                    <span className="text-2xl font-bold text-green-400">${result.premiumHourly}/hr</span>
                  </div>
                  <p className="text-xs text-white/30">For rush projects, difficult clients, or when you want to grow faster.</p>
                </div>
              </div>

              {/* Tip */}
              <div className="flex gap-2 text-xs text-blue-400/80 bg-blue-500/5 border border-blue-500/10 rounded-lg p-3">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Rates assume 75% of your hours are billable. The rest goes to admin, marketing, and unpaid work.
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/10 rounded-xl gap-3">
              <Calculator className="w-8 h-8 opacity-30" />
              <p className="text-sm">Your rates will appear here</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
