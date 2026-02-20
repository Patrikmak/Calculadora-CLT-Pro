export interface SalaryResult {
  grossSalary: number;
  inss: number;
  irrf: number;
  netSalary: number;
  fgts: number;
  discounts: number;
}

export interface VacationResult {
  baseSalary: number;
  vacationValue: number;
  oneThirdBonus: number;
  grossTotal: number;
  inss: number;
  irrf: number;
  netTotal: number;
  abonoPecuniario?: number;
  abonoOneThird?: number;
}

export interface OvertimeResult {
  hourlyRate: number;
  overtimeValue: number;
  totalValue: number;
}

// 2024/2025 INSS Table (Simplified for demo, but realistic)
export function calculateINSS(salary: number): number {
  if (salary <= 1412) return salary * 0.075;
  if (salary <= 2666.68) return (salary - 1412) * 0.09 + 105.9;
  if (salary <= 4000.03) return (salary - 2666.68) * 0.12 + 105.9 + 112.92;
  if (salary <= 7786.02) return (salary - 4000.03) * 0.14 + 105.9 + 112.92 + 160.00;
  return 908.85; // Ceiling
}

// 2024/2025 IRRF Table
export function calculateIRRF(salary: number, inss: number, dependents: number = 0): number {
  const base = salary - inss - (dependents * 189.59);
  if (base <= 2259.20) return 0;
  if (base <= 2826.65) return (base * 0.075) - 169.44;
  if (base <= 3751.05) return (base * 0.15) - 381.44;
  if (base <= 4664.68) return (base * 0.225) - 662.77;
  return (base * 0.275) - 896.00;
}

export function calculateSalary(grossSalary: number, dependents: number = 0, otherDiscounts: number = 0): SalaryResult {
  const inss = calculateINSS(grossSalary);
  const irrf = calculateIRRF(grossSalary, inss, dependents);
  const fgts = grossSalary * 0.08;
  const netSalary = grossSalary - inss - irrf - otherDiscounts;
  
  return {
    grossSalary,
    inss,
    irrf,
    netSalary,
    fgts,
    discounts: inss + irrf + otherDiscounts
  };
}

export function calculateVacation(
  salary: number, 
  days: number = 30, 
  sellTenDays: boolean = false,
  dependents: number = 0,
  unusedVacationDays: number = 0,
  bonuses: number = 0
): VacationResult {
  const baseForVacation = salary + bonuses;
  const dailyRate = baseForVacation / 30;
  
  // Current vacation
  const vacationValue = dailyRate * days;
  const oneThirdBonus = vacationValue / 3;
  
  // Unused/Expired vacation
  const unusedVacationValue = dailyRate * unusedVacationDays;
  const unusedVacationOneThird = unusedVacationValue / 3;
  
  let abonoPecuniario = 0;
  let abonoOneThird = 0;
  
  if (sellTenDays) {
    abonoPecuniario = dailyRate * 10;
    abonoOneThird = abonoPecuniario / 3;
  }
  
  const currentGross = vacationValue + oneThirdBonus;
  const inss = calculateINSS(currentGross);
  const irrf = calculateIRRF(currentGross, inss, dependents);
  
  return {
    baseSalary: baseForVacation,
    vacationValue: vacationValue + unusedVacationValue,
    oneThirdBonus: oneThirdBonus + unusedVacationOneThird,
    grossTotal: currentGross + unusedVacationValue + unusedVacationOneThird + abonoPecuniario + abonoOneThird,
    inss,
    irrf,
    netTotal: (currentGross - inss - irrf) + unusedVacationValue + unusedVacationOneThird + abonoPecuniario + abonoOneThird,
    abonoPecuniario,
    abonoOneThird
  };
}

export function calculateOvertime(
  salary: number,
  monthlyHours: number,
  overtimeHours: number,
  percentage: number = 50
): OvertimeResult {
  const hourlyRate = salary / monthlyHours;
  const overtimeRate = hourlyRate * (1 + percentage / 100);
  const overtimeValue = overtimeRate * overtimeHours;
  
  return {
    hourlyRate,
    overtimeValue,
    totalValue: overtimeValue
  };
}

export interface TerminationResult {
  salaryBalance: number;
  proportionalThirteenth: number;
  proportionalVacation: number;
  vacationOneThird: number;
  noticePeriod?: number;
  fgtsFine?: number;
  grossTotal: number;
  inss: number;
  irrf: number;
  netTotal: number;
}

export type TerminationType = 'sem-justa-causa' | 'com-justa-causa' | 'pedido-demissao' | 'comum-acordo';

export function calculateTermination(
  salary: number,
  startDate: Date,
  endDate: Date,
  type: TerminationType,
  fgtsBalance: number = 0,
  unusedVacationDays: number = 0,
  bonuses: number = 0
): TerminationResult {
  const baseSalary = salary + bonuses;
  
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDaysTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const endDay = endDate.getDate();
  const endMonth = endDate.getMonth() + 1;
  
  // 1. Saldo de Salário
  const salaryBalance = (baseSalary / 30) * endDay;
  
  // 2. 13º Proporcional (Refined)
  // Counts if worked 15+ days in the month
  let thirteenthMonths = 0;
  if (endDate.getFullYear() === startDate.getFullYear()) {
    // Started and ended in same year
    const startMonth = startDate.getMonth() + 1;
    const startDay = startDate.getDate();
    thirteenthMonths = endMonth - startMonth;
    if (startDay <= 15) thirteenthMonths++;
    if (endDay < 15) thirteenthMonths--;
  } else {
    // Full months in current year
    thirteenthMonths = endDay >= 15 ? endMonth : endMonth - 1;
  }
  thirteenthMonths = Math.max(0, thirteenthMonths);
  const proportionalThirteenth = (baseSalary / 12) * thirteenthMonths;
  
  // 3. Férias Proporcionais
  // 1/12 for each 30 days worked or fraction >= 15 days
  const vacationMonths = Math.floor(diffDaysTotal / 30);
  const remainingDays = diffDaysTotal % 30;
  const finalVacationMonths = remainingDays >= 15 ? vacationMonths + 1 : vacationMonths;
  
  const proportionalVacation = (baseSalary / 12) * (finalVacationMonths % 12);
  const vacationOneThird = proportionalVacation / 3;
  
  // 4. Unused Vacation
  const unusedVacationValue = (baseSalary / 30) * unusedVacationDays;
  const unusedVacationOneThird = unusedVacationValue / 3;

  let noticePeriod = 0;
  let fgtsFine = 0;

  if (type === 'sem-justa-causa') {
    noticePeriod = baseSalary;
    fgtsFine = fgtsBalance * 0.4;
  } else if (type === 'comum-acordo') {
    noticePeriod = baseSalary * 0.5;
    fgtsFine = fgtsBalance * 0.2;
  }

  const grossTotal = salaryBalance + proportionalThirteenth + proportionalVacation + vacationOneThird + unusedVacationValue + unusedVacationOneThird + noticePeriod + fgtsFine;
  
  const taxableAmount = salaryBalance + proportionalThirteenth;
  const inss = calculateINSS(taxableAmount);
  const irrf = calculateIRRF(taxableAmount, inss);

  return {
    salaryBalance,
    proportionalThirteenth,
    proportionalVacation: proportionalVacation + unusedVacationValue,
    vacationOneThird: vacationOneThird + unusedVacationOneThird,
    noticePeriod,
    fgtsFine,
    grossTotal,
    inss,
    irrf,
    netTotal: grossTotal - inss - irrf
  };
}
