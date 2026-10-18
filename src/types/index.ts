export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  division: string;
  department: string;
  position: string;
  location: string;
  storeCluster: string;
  brand: string;
  employmentType: 'PKWTT' | 'PKWT' | 'Probation' | 'Internship' | 'Freelance';
  status: 'Active' | 'Probation' | 'Promotion' | 'Resigned' | 'Suspended';
  joinDate: string;
  contractEndDate?: string;
  salary?: number;
  phone?: string;
  gender?: 'Male' | 'Female';
  age?: number;
  education?: string;
  tenureYears?: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'import' | 'promotion' | 'contract' | 'policy' | 'exit' | 'warning';
  dotColor: string;
  user: string;
}

export interface StorePerformance {
  storeId: string;
  storeName: string;
  cluster: string;
  region: 'Barat' | 'Tengah' | 'Timur';
  brand: string;
  format?: 'Family Store' | 'Showroom' | 'Counter';
  headcount: number;
  leaderTenure?: string;
  staffRatio?: string;
  sales: number;
  targetSales: number;
  labourCost: number;
  achievementRate: number;
  revenuePerFte: number;
  labourCostRatio: number;
}

export interface IRCase {
  id: string;
  caseNo: string;
  employeeId: string;
  employeeName: string;
  position: string;
  store: string;
  category: 'Discipline / SP' | 'Fraud / Shrinkage' | 'Grievance' | 'Mediation' | 'Bipartite';
  level: 'SP-1' | 'SP-2' | 'SP-3' | 'PHK' | 'Investigation';
  financialImpact?: number;
  startDate: string;
  endDate?: string;
  status: 'Open' | 'In Review' | 'Mediation' | 'Resolved' | 'Closed';
}

export interface ComplianceItem {
  id: string;
  area: string;
  name: string;
  entity: string;
  status: 'Compliant' | 'Expiring' | 'Expired' | 'Missing';
  expiryDate: string;
  daysRemaining: number;
  assignedTo: string;
}

export interface DivisionLabourCost {
  id: string;
  divisionName: string;
  headcount: number;
  monthlyLabourCost: number;
  annualLabourCost: number;
  revenueContribution: number;
  labourCostRatio: number;
  budgetMonthly: number;
  variancePct: number;
  status: 'Within Budget' | 'Over Budget';
  notes: string;
}

export interface DepartmentLabourCost {
  id: string;
  departmentName: string;
  divisionName: string;
  headcount: number;
  avgSalaryPerFte: number;
  monthlyLabourCost: number;
  revenueContribution: number;
  labourCostRatio: number;
  budgetMonthly: number;
  variancePct: number;
  status: 'Within Budget' | 'Over Budget';
  scope: 'HQ' | 'Store';
  rankingCostRatio: number;
  keyDriver: string;
}

export interface RegionalLabourCostMetric {
  region: 'All' | 'Barat' | 'Tengah' | 'Timur';
  name: string;
  totalHeadcount: number;
  storeHeadcount: number;
  hqHeadcount: number;
  monthlySales: number;
  monthlyLabourCost: number;
  labourCostRatio: number;
  revenuePerFte: number;
  avgCostPerFte: number;
  storeCount: number;
  chartSalesData: number[];
  chartRatioData: number[];
  chartMonths: string[];
}
