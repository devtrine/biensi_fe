export interface Division {
  id: number
  code: string
  name: string
}

export interface Department {
  id: number
  divisionId: number
  code: string
  name: string
  division?: Division
}

export interface Position {
  id: number
  code: string
  name: string
  employeeLevel?: string
}

export interface Store {
  id: number
  storeCode: string
  storeName: string
  storeType?: string
  region?: string
  area?: string
  isActive?: boolean
}

export interface Employee {
  id: string
  employeeNo: string
  fullName: string
  gender?: string
  birthDate?: string
  educationLevel?: string
  divisionId?: number
  departmentId?: number
  positionId?: number
  storeId?: number
  employmentType?: string
  joinDate: string
  endDate?: string
  status?: string
  bpjsKetenagakerjaan?: boolean
  bpjsKesehatan?: boolean
  baseSalary?: number | string
  division?: Division
  department?: Department
  position?: Position
  store?: Store
}

export interface CreateEmployeePayload {
  employeeNo: string
  fullName: string
  gender?: string
  birthDate?: string
  divisionId?: number
  departmentId?: number
  positionId?: number
  storeId?: number
  employmentType?: string
  joinDate: string
  endDate?: string
  status?: string
  baseSalary?: number
  bpjsKetenagakerjaan?: boolean
  bpjsKesehatan?: boolean
}
