import React from 'react'

interface FooterProps {
  customText?: string
}
const Footer: React.FC<FooterProps> = () => {
  return (
    <h2 className="text-[12px] s:text-[16px] text-center pt-15 opacity-70">Designed by Rita Zhao © 2026 Weathia.</h2>
  )
}

export default Footer