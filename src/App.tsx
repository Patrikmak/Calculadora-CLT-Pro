/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Wallet, 
  Clock, 
  Umbrella, 
  TrendingUp, 
  Info, 
  ChevronRight,
  DollarSign,
  Percent,
  Users,
  FileText,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { 
  calculateSalary, 
  calculateVacation, 
  calculateOvertime,
  calculateTermination,
  TerminationType
} from './lib/calculator';

type Tab = 'salary' | 'hours' | 'vacation' | 'termination';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('salary');

  // Salary State
  const [grossSalary, setGrossSalary] = useState<number | string>(3500);
  const [dependents, setDependents] = useState<number | string>(0);
  const [otherDiscounts, setOtherDiscounts] = useState<number | string>(0);
  const [bonuses, setBonuses] = useState<number | string>(0);
  const [showTaxDetails, setShowTaxDetails] = useState(false);

  // Hours State
  const [monthlyHours, setMonthlyHours] = useState<number | string>(220);
  const [overtimeHours, setOvertimeHours] = useState<number | string>(10);
  const [overtimePercent, setOvertimePercent] = useState<number>(50);

  // Vacation State
  const [vacationDays, setVacationDays] = useState<number>(30);
  const [sellTenDays, setSellTenDays] = useState<boolean>(false);
  const [unusedVacationDays, setUnusedVacationDays] = useState<number | string>(0);

  // Termination State
  const [terminationType, setTerminationType] = useState<TerminationType>('sem-justa-causa');
  const [startDate, setStartDate] = useState<string>('2023-01-01');
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [fgtsBalance, setFgtsBalance] = useState<number | string>(5000);

  // Validation Helpers
  const parseSafe = (val: number | string) => {
    const n = Number(val);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  const salaryResult = useMemo(() => 
    calculateSalary(parseSafe(grossSalary) + parseSafe(bonuses), parseSafe(dependents), parseSafe(otherDiscounts)), 
    [grossSalary, dependents, otherDiscounts, bonuses]
  );
  
  const hoursResult = useMemo(() => 
    calculateOvertime(parseSafe(grossSalary), parseSafe(monthlyHours) || 1, parseSafe(overtimeHours), overtimePercent), 
    [grossSalary, monthlyHours, overtimeHours, overtimePercent]
  );
  
  const vacationResult = useMemo(() => 
    calculateVacation(parseSafe(grossSalary), vacationDays, sellTenDays, parseSafe(dependents), parseSafe(unusedVacationDays), parseSafe(bonuses)), 
    [grossSalary, vacationDays, sellTenDays, dependents, unusedVacationDays, bonuses]
  );

  const terminationResult = useMemo(() => 
    calculateTermination(
      parseSafe(grossSalary), 
      new Date(startDate), 
      new Date(endDate), 
      terminationType, 
      parseSafe(fgtsBalance),
      parseSafe(unusedVacationDays),
      parseSafe(bonuses)
    ), 
    [grossSalary, startDate, endDate, terminationType, fgtsBalance, unusedVacationDays, bonuses]
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleNumberInput = (setter: (val: number | string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setter('');
      return;
    }
    const n = Number(val);
    if (n >= 0) setter(n);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917] font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm shadow-emerald-200">
              <Calculator className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg tracking-tight hidden md:block">Calculadora CLT Pro</h1>
            <h1 className="font-bold text-lg tracking-tight md:hidden">CLT Pro</h1>
          </div>
          <nav className="flex gap-1 bg-stone-100 p-1 rounded-xl overflow-x-auto no-scrollbar mask-fade-right">
            {(['salary', 'hours', 'vacation', 'termination'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 capitalize whitespace-nowrap",
                  activeTab === tab 
                    ? "bg-white text-emerald-700 shadow-sm" 
                    : "text-stone-500 hover:text-stone-800"
                )}
              >
                {tab === 'salary' ? 'Salário' : tab === 'hours' ? 'Horas' : tab === 'vacation' ? 'Férias' : 'Rescisão'}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Inputs Section */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200">
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-400 mb-4 sm:mb-6 flex items-center gap-2">
                <Info className="w-4 h-4" /> Dados Base
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Salário Bruto Mensal</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-medium">R$</span>
                    <input 
                      type="number" 
                      min="0"
                      value={grossSalary}
                      onChange={handleNumberInput(setGrossSalary)}
                      className={cn(
                        "w-full pl-10 pr-4 py-2.5 bg-stone-50 border rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium",
                        grossSalary === '' ? "border-red-300 bg-red-50" : "border-stone-200"
                      )}
                      placeholder="0,00"
                    />
                  </div>
                  {grossSalary === '' && <p className="text-[10px] text-red-500 mt-1 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Campo obrigatório</p>}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'salary' && (
                    <motion.div 
                      key="salary-inputs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Dependentes</label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                          <input 
                            type="number" 
                            min="0"
                            value={dependents}
                            onChange={handleNumberInput(setDependents)}
                            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Bônus / Gratificações</label>
                        <div className="relative">
                          <Gift className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                          <input 
                            type="number" 
                            min="0"
                            value={bonuses}
                            onChange={handleNumberInput(setBonuses)}
                            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Outros Descontos</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-medium">R$</span>
                          <input 
                            type="number" 
                            min="0"
                            value={otherDiscounts}
                            onChange={handleNumberInput(setOtherDiscounts)}
                            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'hours' && (
                    <motion.div 
                      key="hours-inputs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Jornada Mensal (Horas)</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                          <input 
                            type="number" 
                            min="1"
                            value={monthlyHours}
                            onChange={handleNumberInput(setMonthlyHours)}
                            className={cn(
                              "w-full pl-10 pr-4 py-2.5 bg-stone-50 border rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium",
                              monthlyHours === '' ? "border-red-300 bg-red-50" : "border-stone-200"
                            )}
                          />
                        </div>
                        {monthlyHours === '' && <p className="text-[10px] text-red-500 mt-1 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Campo obrigatório</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Horas Extras Realizadas</label>
                        <div className="relative">
                          <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                          <input 
                            type="number" 
                            min="0"
                            value={overtimeHours}
                            onChange={handleNumberInput(setOvertimeHours)}
                            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Porcentagem Hora Extra</label>
                        <div className="relative">
                          <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                          <select 
                            value={overtimePercent}
                            onChange={(e) => setOvertimePercent(Number(e.target.value))}
                            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium appearance-none"
                          >
                            <option value={50}>50% (Dias úteis)</option>
                            <option value={100}>100% (Domingos e feriados)</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'vacation' && (
                    <motion.div 
                      key="vacation-inputs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Dias de Férias</label>
                        <input 
                          type="range" 
                          min="1" 
                          max="30" 
                          value={vacationDays}
                          onChange={(e) => setVacationDays(Number(e.target.value))}
                          className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                        <div className="flex justify-between text-xs text-stone-400 mt-2 font-medium">
                          <span>1 dia</span>
                          <span className="text-emerald-600 font-bold">{vacationDays} dias</span>
                          <span>30 dias</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Dias de Férias Vencidas/Não Gozadas</label>
                        <div className="relative">
                          <Umbrella className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                          <input 
                            type="number" 
                            min="0"
                            value={unusedVacationDays}
                            onChange={handleNumberInput(setUnusedVacationDays)}
                            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
                        <div>
                          <p className="text-sm font-semibold">Abono Pecuniário</p>
                          <p className="text-xs text-stone-500">Vender 10 dias de férias</p>
                        </div>
                        <button 
                          onClick={() => setSellTenDays(!sellTenDays)}
                          className={cn(
                            "w-12 h-6 rounded-full transition-colors relative",
                            sellTenDays ? "bg-emerald-600" : "bg-stone-300"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                            sellTenDays ? "left-7" : "left-1"
                          )} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'termination' && (
                    <motion.div 
                      key="termination-inputs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Tipo de Rescisão</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                          <select 
                            value={terminationType}
                            onChange={(e) => setTerminationType(e.target.value as TerminationType)}
                            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium appearance-none"
                          >
                            <option value="sem-justa-causa">Demissão sem Justa Causa</option>
                            <option value="com-justa-causa">Demissão com Justa Causa</option>
                            <option value="pedido-demissao">Pedido de Demissão</option>
                            <option value="comum-acordo">Rescisão por Comum Acordo</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1.5">Data Início</label>
                          <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1.5">Data Fim</label>
                          <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Saldo FGTS (para multa)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-medium">R$</span>
                          <input 
                            type="number" 
                            min="0"
                            value={fgtsBalance}
                            onChange={handleNumberInput(setFgtsBalance)}
                            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {activeTab === 'termination' 
                    ? "O cálculo de rescisão considera saldo de salário, 13º proporcional, férias proporcionais e multas do FGTS conforme o tipo selecionado."
                    : "Os cálculos utilizam as tabelas vigentes de INSS e IRRF para 2024/2025. Lembre-se que benefícios como VR e VT podem variar."}
                </p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {activeTab === 'salary' && (
                <motion.div
                  key="salary-res"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="bg-emerald-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10">
                      <Wallet className="w-24 h-24 sm:w-32 sm:h-32" />
                    </div>
                    <p className="text-emerald-100 text-xs sm:text-sm font-medium uppercase tracking-widest mb-1 sm:mb-2">Salário Líquido Estimado</p>
                    <h3 className="text-3xl sm:text-5xl font-bold tracking-tight break-words">{formatCurrency(salaryResult.netSalary)}</h3>
                    <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-sm">
                        <p className="text-emerald-100 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider mb-1">Total Descontos</p>
                        <p className="text-base sm:text-xl font-semibold">{formatCurrency(salaryResult.discounts)}</p>
                      </div>
                      <div className="bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-sm">
                        <p className="text-emerald-100 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider mb-1">FGTS (Depósito)</p>
                        <p className="text-base sm:text-xl font-semibold">{formatCurrency(salaryResult.fgts)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                    <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                      <h4 className="font-semibold">Detalhamento da Folha</h4>
                      <span className="text-xs text-stone-400 font-mono">REF: MENSAL</span>
                    </div>
                    <div className="divide-y divide-stone-50">
                      <DetailRow label="Salário Bruto + Bônus" value={formatCurrency(salaryResult.grossSalary)} />
                      
                      <div className="bg-stone-50/30">
                        <button 
                          onClick={() => setShowTaxDetails(!showTaxDetails)}
                          className="w-full p-6 flex justify-between items-center hover:bg-stone-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-stone-500 font-medium">Impostos (INSS + IRRF)</span>
                            {showTaxDetails ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                          </div>
                          <span className="font-mono font-semibold text-red-500">
                            - {formatCurrency(salaryResult.inss + salaryResult.irrf)}
                          </span>
                        </button>
                        
                        <AnimatePresence>
                          {showTaxDetails && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-t border-stone-100"
                            >
                              <div className="p-6 pt-2 space-y-3">
                                <div className="flex justify-between text-xs">
                                  <span className="text-stone-400">INSS (Previdência)</span>
                                  <span className="text-stone-600 font-medium">{formatCurrency(salaryResult.inss)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-stone-400">IRRF (Imposto de Renda)</span>
                                  <span className="text-stone-600 font-medium">{formatCurrency(salaryResult.irrf)}</span>
                                </div>
                                <div className="p-3 bg-white rounded-lg border border-stone-100 text-[10px] text-stone-400 leading-relaxed">
                                  O INSS é calculado sobre o bruto usando alíquotas progressivas (7.5% a 14%). O IRRF é calculado sobre a base (Bruto - INSS - Dependentes) com alíquotas de 7.5% a 27.5%.
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {parseSafe(otherDiscounts) > 0 && (
                        <DetailRow label="Outros Descontos" value={`- ${formatCurrency(parseSafe(otherDiscounts))}`} isNegative />
                      )}
                      <div className="p-6 bg-stone-50 flex justify-between items-center">
                        <span className="font-bold text-stone-900">Total Líquido</span>
                        <span className="font-bold text-emerald-600 text-lg">{formatCurrency(salaryResult.netSalary)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'hours' && (
                <motion.div
                  key="hours-res"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="bg-stone-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10">
                      <Clock className="w-24 h-24 sm:w-32 sm:h-32" />
                    </div>
                    <p className="text-stone-400 text-xs sm:text-sm font-medium uppercase tracking-widest mb-1 sm:mb-2">Valor Total Horas Extras</p>
                    <h3 className="text-3xl sm:text-5xl font-bold tracking-tight break-words">{formatCurrency(hoursResult.overtimeValue)}</h3>
                    <div className="mt-6 sm:mt-8 flex flex-wrap gap-4 sm:gap-6">
                      <div>
                        <p className="text-stone-500 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider mb-1">Valor da Hora Comum</p>
                        <p className="text-lg sm:text-xl font-semibold">{formatCurrency(hoursResult.hourlyRate)}</p>
                      </div>
                      <div className="hidden sm:block w-px h-10 bg-stone-800" />
                      <div>
                        <p className="text-stone-500 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider mb-1">Valor da Hora Extra ({overtimePercent}%)</p>
                        <p className="text-lg sm:text-xl font-semibold">{formatCurrency(hoursResult.hourlyRate * (1 + overtimePercent/100))}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-2xl border border-stone-200">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h4 className="font-semibold text-stone-900 mb-1">Ganhos Extras</h4>
                      <p className="text-sm text-stone-500 mb-4">Total bruto a receber pelas horas adicionais trabalhadas.</p>
                      <p className="text-2xl font-bold text-emerald-600">{formatCurrency(hoursResult.overtimeValue)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-stone-200">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-stone-900 mb-1">Novo Bruto</h4>
                      <p className="text-sm text-stone-500 mb-4">Seu salário bruto somado às horas extras deste mês.</p>
                      <p className="text-2xl font-bold text-stone-900">{formatCurrency(parseSafe(grossSalary) + hoursResult.overtimeValue)}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'vacation' && (
                <motion.div
                  key="vacation-res"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="bg-blue-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10">
                      <Umbrella className="w-24 h-24 sm:w-32 sm:h-32" />
                    </div>
                    <p className="text-blue-100 text-xs sm:text-sm font-medium uppercase tracking-widest mb-1 sm:mb-2">Valor Líquido das Férias</p>
                    <h3 className="text-3xl sm:text-5xl font-bold tracking-tight break-words">{formatCurrency(vacationResult.netTotal)}</h3>
                    <div className="mt-6 sm:mt-8 flex flex-col gap-2 text-blue-100">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        <span className="text-[10px] sm:text-xs font-medium">Cálculo para {vacationDays} dias de descanso</span>
                      </div>
                      {parseSafe(unusedVacationDays) > 0 && (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-[10px] sm:text-xs font-medium">Inclui {unusedVacationDays} dias de férias vencidas</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                    <div className="p-6 border-b border-stone-100">
                      <h4 className="font-semibold">Composição das Férias</h4>
                    </div>
                    <div className="divide-y divide-stone-50">
                      <DetailRow label={`Valor dos ${vacationDays} dias`} value={formatCurrency(vacationResult.vacationValue)} />
                      <DetailRow label="1/3 Constitucional" value={formatCurrency(vacationResult.oneThirdBonus)} />
                      {sellTenDays && (
                        <>
                          <DetailRow label="Abono Pecuniário (10 dias)" value={formatCurrency(vacationResult.abonoPecuniario || 0)} />
                          <DetailRow label="1/3 sobre Abono" value={formatCurrency(vacationResult.abonoOneThird || 0)} />
                        </>
                      )}
                      <DetailRow label="INSS sobre Férias" value={`- ${formatCurrency(vacationResult.inss)}`} isNegative />
                      <DetailRow label="IRRF sobre Férias" value={`- ${formatCurrency(vacationResult.irrf)}`} isNegative />
                      <div className="p-6 bg-stone-50 flex justify-between items-center">
                        <span className="font-bold text-stone-900">Total a Receber</span>
                        <span className="font-bold text-blue-600 text-lg">{formatCurrency(vacationResult.netTotal)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'termination' && (
                <motion.div
                  key="termination-res"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="bg-red-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-red-900/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10">
                      <FileText className="w-24 h-24 sm:w-32 sm:h-32" />
                    </div>
                    <p className="text-red-100 text-xs sm:text-sm font-medium uppercase tracking-widest mb-1 sm:mb-2">Total Líquido da Rescisão</p>
                    <h3 className="text-3xl sm:text-5xl font-bold tracking-tight break-words">{formatCurrency(terminationResult.netTotal)}</h3>
                    <div className="mt-6 sm:mt-8 flex items-center gap-2 text-red-100">
                      <Calendar className="w-4 h-4" />
                      <span className="text-[10px] sm:text-xs font-medium">Período: {new Date(startDate).toLocaleDateString()} até {new Date(endDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                    <div className="p-6 border-b border-stone-100">
                      <h4 className="font-semibold">Verbas Rescisórias</h4>
                    </div>
                    <div className="divide-y divide-stone-50">
                      <DetailRow label="Saldo de Salário" value={formatCurrency(terminationResult.salaryBalance)} />
                      <DetailRow label="13º Salário Proporcional" value={formatCurrency(terminationResult.proportionalThirteenth)} />
                      <DetailRow label="Férias Proporcionais" value={formatCurrency(terminationResult.proportionalVacation)} />
                      <DetailRow label="1/3 sobre Férias" value={formatCurrency(terminationResult.vacationOneThird)} />
                      {terminationResult.noticePeriod && terminationResult.noticePeriod > 0 ? (
                        <DetailRow label="Aviso Prévio Indenizado" value={formatCurrency(terminationResult.noticePeriod)} />
                      ) : null}
                      {terminationResult.fgtsFine && terminationResult.fgtsFine > 0 ? (
                        <DetailRow label="Multa FGTS" value={formatCurrency(terminationResult.fgtsFine)} />
                      ) : null}
                      <DetailRow label="INSS (sobre Saldo e 13º)" value={`- ${formatCurrency(terminationResult.inss)}`} isNegative />
                      <DetailRow label="IRRF (sobre Saldo e 13º)" value={`- ${formatCurrency(terminationResult.irrf)}`} isNegative />
                      <div className="p-6 bg-stone-50 flex justify-between items-center">
                        <span className="font-bold text-stone-900">Total Líquido</span>
                        <span className="font-bold text-red-600 text-lg">{formatCurrency(terminationResult.netTotal)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-stone-200 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Calculator className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">Calculadora CLT Pro</span>
          </div>
          <div className="flex gap-8 text-xs font-medium text-stone-400 uppercase tracking-widest">
            <a href="#" className="hover:text-stone-900 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Termos</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Ajuda</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DetailRow({ label, value, isNegative }: { label: string, value: string, isNegative?: boolean }) {
  return (
    <div className="p-4 sm:p-6 flex justify-between items-center group hover:bg-stone-50/50 transition-colors">
      <span className="text-xs sm:text-sm text-stone-500 font-medium pr-4">{label}</span>
      <span className={cn(
        "font-mono font-semibold text-sm sm:text-base whitespace-nowrap",
        isNegative ? "text-red-500" : "text-stone-900"
      )}>{value}</span>
    </div>
  );
}
