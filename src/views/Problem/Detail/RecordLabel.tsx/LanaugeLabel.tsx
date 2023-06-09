import React, { useEffect, useState } from 'react'
import { languageList } from '@/components/Editor/LanguageList'

const LanaugeLabel: React.FC<{
  value: string
}> = props => {
  const [element, setelement] = useState<JSX.Element>()

  useEffect(() => {
    languageList.forEach(item => {
      if (['C++11', 'C++', 'C'].includes(props.value)) {
        setelement(
          <svg className="icon" aria-hidden="true">
            <use href="#icon-cpp"></use>
          </svg>
        )
        return
      }
      if (item.value === props.value) {
        setelement(item.label)
      }
    })
  }, [])

  return <div>{element}</div>
}

export default LanaugeLabel
