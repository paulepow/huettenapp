// Hilfsfunktion für Role-Type-Assertion
export const assertRole = (role: string): 'ADMIN' | 'PARTICIPANT' => {
  if (role === 'ADMIN' || role === 'PARTICIPANT') {
    return role;
  }
  throw new Error(`Invalid role: ${role}`);
}; 