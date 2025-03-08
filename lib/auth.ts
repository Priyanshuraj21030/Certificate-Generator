interface AdminUser {
  username: string;
  password: string;
  role: 'admin' | 'teacher';
  name: string;
}

// In a real application, this would be stored in a secure database
const ADMIN_USERS: AdminUser[] = [
  {
    username: 'admin@certportal.com',
    // In production, this would be hashed
    password: 'admin123',
    role: 'admin',
    name: 'System Administrator'
  }
];

export async function validateAdminCredentials(username: string, password: string): Promise<{ isValid: boolean; user?: AdminUser }> {
  // In a real application, this would check against a secure database
  // and use proper password hashing
  const user = ADMIN_USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    // Check if it's a teacher trying to login
    const teachersStr = localStorage.getItem('teachers');
    if (teachersStr) {
      const teachers = JSON.parse(teachersStr);
      const teacher = teachers.find(
        (t: any) => t.username === username && t.password === password && t.role === 'teacher'
      );
      if (teacher) {
        return { isValid: true, user: teacher };
      }
    }
    return { isValid: false };
  }

  return { isValid: true, user };
}

export function addTeacher(teacherData: {
  username: string;
  password: string;
  name: string;
}) {
  const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
  const newTeacher: AdminUser = {
    ...teacherData,
    role: 'teacher'
  };
  
  // Check if username already exists
  if (teachers.some((t: AdminUser) => t.username === teacherData.username)) {
    throw new Error('Username already exists');
  }

  teachers.push(newTeacher);
  localStorage.setItem('teachers', JSON.stringify(teachers));
  return newTeacher;
}

export function getAdminUser(): AdminUser | null {
  const userStr = localStorage.getItem('adminUser');
  if (!userStr) return null;
  return JSON.parse(userStr);
}

export function setAdminUser(user: AdminUser) {
  localStorage.setItem('adminUser', JSON.stringify(user));
}

export function clearAdminUser() {
  localStorage.removeItem('adminUser');
} 