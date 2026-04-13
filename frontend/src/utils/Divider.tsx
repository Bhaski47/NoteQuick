import { DividerProps } from '@/types'
import React from 'react'

function Divider({className} : DividerProps) {
  return (
    <div className={`border border-light-borderDivider dark:border-dark-borderDivider -mt-1 w-full ${className}`}/>
  )
}

export default Divider