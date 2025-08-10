const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const authService = {
  async requestPasswordReset(email: string) {
    const res = await fetch(`${API_URL}/security/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  async verifyOTP(email: string, otp: string) {
    const res = await fetch(`${API_URL}/security/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  async resetPassword(email: string, otp: string, newPassword: string) {
    const res = await fetch(`${API_URL}/security/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  async logout(userId: string) {
    const res = await fetch(`${API_URL}/security/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    const res = await fetch(`${API_URL}/security/update-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, currentPassword, newPassword }),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },
};
