import { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  id,
  error,
  helperText,
  type = 'text',
  fullWidth = true,
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={type}
          className={`
            w-full rounded-md shadow-sm transition-colors duration-200
            ${error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
            }
            ${props.disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
          `}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
      </div>
      
      {error && <p className="error-text">{error}</p>}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input