'use client'
import React from 'react'
import ActionButton from '../ActionButton'

export default function NameBox({name}:{name:string}) {
  return (
    <ActionButton name={name} onClick={() => {}} className='border-black dark:border-white' />
  )
}
