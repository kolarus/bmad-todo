'use client';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  'aria-label': string;
  'data-testid'?: string;
}

export function Checkbox({ checked, onChange, 'aria-label': ariaLabel, 'data-testid': testId }: CheckboxProps) {
  return (
    <label className="relative flex items-center justify-center cursor-pointer min-w-[44px] min-h-[44px]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        className="sr-only peer"
        data-testid={testId}
      />
      <span
        aria-hidden="true"
        className={[
          'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0',
          'transition-colors duration-150',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2',
          checked
            ? 'bg-indigo-600 border-indigo-600'
            : 'bg-white border-slate-300 hover:border-slate-400',
        ].join(' ')}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 12 12"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
          </svg>
        )}
      </span>
    </label>
  );
}
