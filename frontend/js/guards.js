export function requireAuth() {
  if (!localStorage.getItem('idToken')) location.href = 'login.html';
}
export function requireGuest() {
  if (localStorage.getItem('idToken')) location.href = 'home.html';
}
export function logout() {
  localStorage.removeItem('idToken');
  location.href = 'login.html';
}
