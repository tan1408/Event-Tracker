const Loader = ({ size = 'md', center = false }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  }
  
  const loaderClass = `${sizeClasses[size] || sizeClasses.md} rounded-full border-primary-500 border-t-transparent animate-spin`
  
  return (
    <div className={center ? 'flex justify-center items-center' : ''}>
      <div className={loaderClass}></div>
    </div>
  )
}

export default Loader