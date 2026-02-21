export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-white page-container-border rounded w-100 pt-2'>
      {children}
    </div>
  )
}