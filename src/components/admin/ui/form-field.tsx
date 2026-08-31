import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  helpText,
  children,
}) => {
  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-xs font-semibold text-[var(--text-primary)]">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {helpText && <p className="text-[11px] text-[var(--text-secondary)]">{helpText}</p>}
      {error && <p className="text-[11px] text-rose-400 font-semibold">{error}</p>}
    </div>
  );
};
