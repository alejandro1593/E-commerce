import { SelectHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, label, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-dark-900 mb-2"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={clsx(
            'w-full px-4 py-3 bg-white/80 border border-cream-300 rounded-xl',
            'text-dark-900',
            'focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan',
            'transition-all duration-300',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="bg-white">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-white">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';
