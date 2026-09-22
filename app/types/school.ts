export interface School {
  id: string
  nameKhmer: string
  nameEnglish: string
  logoUrl: string | null
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  description: string | null
}

export interface AcademicYear {
  id: string
  name: string
  startDate: string
  endDate: string
  isCurrent: boolean
}

export interface Term {
  id: string
  academicYearId: string
  name: string
  startDate: string
  endDate: string
  isCurrent: boolean
}

export interface Department {
  id: string
  nameKhmer: string
  nameEnglish: string
  description: string | null
}

export interface Grade {
  id: string
  nameKhmer: string
  nameEnglish: string
  level: number
  departmentId: string | null
}

export interface Room {
  id: string
  name: string
  capacity: number | null
  building: string | null
}
