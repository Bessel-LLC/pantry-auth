import React from 'react';

export interface InputOTPProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  children?: React.ReactNode;
}

export const InputOTP: React.FC<InputOTPProps> = ({ value, onChange, maxLength = 6, children }) => {
  // Simple input for demonstration; replace with a more advanced OTP input as needed
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={maxLength}
      value={value}
      onChange={e => {
        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, maxLength);
        onChange(val);
      }}
      className="border rounded px-3 py-2 text-center tracking-widest text-lg w-40"
    />
  );
};

export const InputOTPGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const InputOTPSlot: React.FC<{ index: number }> = () => null; // No-op for compatibility
