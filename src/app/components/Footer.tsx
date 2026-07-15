import React from 'react'

interface FooterProps {
  customText?: string
}
const Footer: React.FC<FooterProps> = () => {
  return (
    <div
      className="relative w-full  py-6 z-50 mt-auto"
      style={{
        background: 'linear-gradient(to top, rgba(31, 41, 55, 0.9) 0%, rgba(31, 41, 55, 0.4) 60%, transparent 100%)'
      }}
    >
      <h2 className="text-sm sm:text-[16px] text-center text-white font-medium">
        Designed by Rita Zhao © 2026 Weathia.
      </h2>
    </div>
  )
}

export default Footer