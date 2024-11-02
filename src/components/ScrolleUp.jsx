import React from 'react'
import { FaArrowUp} from 'react-icons/fa'

export default function ScrolleUp() {
  return (
    <div onClick={() => window.scrollTo({top: 0, left: 0, behavior: 'smooth'})} id="scrolle"><FaArrowUp/></div>
  )
}
