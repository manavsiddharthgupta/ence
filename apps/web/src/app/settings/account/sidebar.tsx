import React from 'react'

interface Props {
  label: string
  selected: boolean
  onClick: () => void
}

const SidebarItem: React.FC<Props> = ({ label, selected, onClick }) => {
  return (
    <li
      className={`relative py-2 px-4 cursor-pointer font-normal ${
        selected ? 'font-semibold' : ''
      }`}
      onClick={onClick}>
      {label}
      {selected && (
        <div className='absolute top-0 left-0 h-full w-1 bg-blue-500'></div>
      )}
    </li>
  )
}

export default SidebarItem
