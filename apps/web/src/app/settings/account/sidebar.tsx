import React from 'react'

interface Props {
  label: string
  selected: boolean
  onClick: () => void
}

const SidebarItem: React.FC<Props> = ({ label, selected, onClick }) => {
  return (
    <li
      className={`py-2 px-4 cursor-pointer font-normal ${
        selected ? 'font-semibold' : ''
      }`}
      onClick={onClick}>
      {label}
    </li>
  )
}

export default SidebarItem
