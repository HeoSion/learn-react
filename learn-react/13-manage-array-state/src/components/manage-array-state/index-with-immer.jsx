import { useState } from 'react'
import { useImmer } from 'use-immer'
import './style.css'

const INITIAL_ARRAY_STATE = ['A', 'B', 'C']
const INITIAL_INSERT_STATE = { index: 0, value: '', z: { y: { k: { p: 0 } } } }

export default function ManageArrayState() {
  const [arrayState, setArrayState] = useImmer(INITIAL_ARRAY_STATE)

  const maxValue = arrayState.length - 1

  const handleRemoveFirstItem = () => {
    setArrayState((draft) => {
      draft.shift()
    })
  }

  const handleRemoveB = () => {
    const nextArrayState = arrayState.filter((item) => item !== 'B')
    setArrayState(nextArrayState)
  }

  const handleAddFirstX = () => {
    setArrayState((draft) => {
      draft.unshift('X')
    })
  }

  const handleAddLastY = () => {
    setArrayState((draft) => {
      draft.push('Y')
    })
  }

  const handleAllClear = () => {
    // const nextArrayState = []
    setArrayState([])
  }

  const handleReset = () => {
    setArrayState(INITIAL_ARRAY_STATE)
  }

  const handleChangeAtoH = () => {
    const nextArrayState = arrayState.map((item) => (item === 'A' ? 'H' : item))
    setArrayState(nextArrayState)
  }

  const [addValue, setAddValue] = useState('')

  const handleUpdateAddValue = (e) => {
    setAddValue(e.target.value)
  }

  const handleAddFirstValue = () => {
    setArrayState((as) => [addValue, ...as])
    setAddValue('')
  }

  const handleEnterKey = (e) => {
    if (addValue.trim().length === 0) return
    if (e.key === 'Enter') handleAddFirstValue()
  }

  const [insertState, setInsertState] = useImmer(INITIAL_INSERT_STATE)

  console.log(insertState.z.y.k.p)

  const handleInsertValueAtIndex = () => {
    const { index, value } = insertState

    const nextArrayState = [
      ...arrayState.slice(0, index),
      value,
      ...arrayState.slice(index),
    ]

    setArrayState(nextArrayState)
    setInsertState(INITIAL_INSERT_STATE)
  }

  return (
    <section className="manage-array-state">
      <h2>배열 상태 관리 실습 (immer)</h2>

      <output>
        <strong>배열 상태</strong> : {arrayState.join(', ')}
      </output>

      <div role="group">
        <button type="button" onClick={handleRemoveFirstItem}>
          첫 번째 요소 제거
        </button>
        <button type="button" onClick={handleRemoveB}>
          'B' 제거
        </button>
        <button type="button" onClick={handleAddFirstX}>
          맨 앞에 'X' 추가
        </button>
        <button type="button" onClick={handleAddLastY}>
          맨 뒤에 'Y' 추가
        </button>
        <button type="button" onClick={handleAllClear}>
          모두 제거
        </button>
        <button type="button" onClick={handleReset}>
          초기화
        </button>
        <button type="button" onClick={handleChangeAtoH}>
          모든 'A'를 'H'로 변경
        </button>
      </div>

      <div role="group" data-layout-row>
        <input
          type="text"
          placeholder="추가할 값"
          value={addValue}
          onInput={handleUpdateAddValue}
          onKeyDown={handleEnterKey}
        />
        <button type="button" onClick={handleAddFirstValue}>
          맨 앞에 추가
        </button>
      </div>

      <div role="group" data-layout-row>
        <input
          type="text"
          placeholder="추가할 값"
          value={insertState.value}
          onChange={(e) => {
            setInsertState((draft) => {
              draft.value = e.target.value
              // useImmer 훅을 사용해 상태를 관리할 경우
              draft.z.y.k.p += 1

              // 리액트의 불변성 유지를 위해 작성해야 할 코드
              // return {
              //   ...draft,
              //   z: {
              //     ...draft.z,
              //     y: {
              //       ...draft.z.y,
              //       k: {
              //         ...draft.z.y.k,
              //         p: draft.z.y.k.p + 1,
              //       },
              //     },
              //   },
              // }
            })
          }}
        />
        <input
          type="number"
          placeholder="인덱스"
          min={0}
          max={maxValue}
          value={insertState.index}
          onInput={(e) => {
            setInsertState((draft) => {
              draft.index = Number(e.target.value)
              draft.z.y.k.p -= 1
            })
          }}
        />
        <button type="button" onClick={handleInsertValueAtIndex}>
          원하는 위치에 추가
        </button>
      </div>
    </section>
  )
}
