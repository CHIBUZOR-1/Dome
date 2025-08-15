export const Fillz = ({iconClass, ...props}) => {
  return (
    <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <i className={`${iconClass} text-gray-600 text-2xl`}></i>
        </div>
        <input {...props} className='w-full pl-9 placeholder:text-gray-400 outline-gray-500 border-gray-200 font-medium pr-3  py-1 border rounded-md' />
    </div>
  )
}
export const Searchz = ({iconClass, ...props}) => {
  return (
    <div className="relative w-full">
        <div className="absolute active:text-orange-500 text-gray-600 inset-y-0 left-0 flex items-center pl-2">
            <i className={`${iconClass}  text-2xl`}></i>
        </div>
        <input {...props} className='w-full pl-9 placeholder:text-gray-400 outline-gray-500 border-gray-200 font-medium pr-3  py-1 border rounded-md' />
    </div>
  )
}