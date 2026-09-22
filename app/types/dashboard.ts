import type { AuditLog, LoginLog } from './audit'

export interface AdminDashboard {
  totalTeachers: number
  activeTeachers: number
  totalStudents: number
  activeClasses: number
  totalSubjects: number
  todayAttendance: number | null
  pendingGrading: number
  activeAssignments: number
  recentActivity: AuditLog[]
  recentLogins: LoginLog[]
}
