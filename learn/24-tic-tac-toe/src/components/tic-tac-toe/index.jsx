import { useState } from 'react'
import { tw } from '@/utils'
import {
  GRID,
  INITIAL_SQUARES,
  PLAYER,
  checkWinner,
  getPlayerName,
} from './constants'
import './style.css'

export default function TicTacToe() {
  // 게임 상태 설정
  // 게임 보드를 구성하는 사각형을 관리하는 상태
  const [gameHistory, setGameHistory] = useState([INITIAL_SQUARES])
  // 게임 진행하는 순서 상태
  const [gameIndex, setGameIndex] = useState(0)

  // 화면에 렌더링을 해야할 현재 게임판
  // gameHistory, gameIndex 상태에서 파생된 상태
  // 예) squares, currentSquares, board
  const squares = gameHistory[gameIndex]

  // 파생된 상태: 게임 진행되는 순서(상태)에 의존하는 데이터(상태)
  // (React: derived state / Vue: computed property)
  const nextPlayer = gameIndex % 2 === 0 ? PLAYER.ONE : PLAYER.TWO

  // 게임이 진행될 때(턴이 변경될 때)마다 게임의 승자(winner)가 있는 지 확인
  const winner = checkWinner(squares) // null

  // 진행 중인 게임에 위너가 없고 게임이 무승부로 끝났다며?
  // 이런 의미의 파생된 상태를 정의하고 싶다.
  // 게임이 비긴 상황 = 위너가 없고, 게임 보드판에 빈 칸이 없다.
  const isDraw = !winner && gameIndex === GRID.COLS * GRID.ROWS

  // 게임 시작 기능(함수)
  const playGame = (squareIndex, e) => {
    // 게임이 진행되면 안되는 상황

    // 1. 게임 위너가 존재할 경우
    if (winner) {
      return alert('GAME OVER')
    }

    // 2. 접근성 준수를 위해 필요 (리액트의 렌더링과 무관한 부수 효과)
    if (e.target.getAttribute('aria-disabled') === 'true') {
      return alert('이미 게임이 진행된 칸입니다. 다른 빈 칸에 말을 놓으세요.')
    }

    // 위 상황이 아니라면, 게임 진행 -----------------------------------

    // 1. 게임 인덱스 상태 업데이트
    const nextGameIndex = gameIndex + 1
    setGameIndex(nextGameIndex)

    // 2. 게임 스퀘어 상태 업데이트
    const nextSquares = squares.map((square, index) =>
      index === squareIndex ? nextPlayer : square
    )

    // 시간을 되돌린 상태에서 새 게임을 진행한다면?
    // 현재 게임의 기록에서 되돌려진 게임 인덱스의 다음 인덱스를 기준으로 하여
    // 현재 게임 기록을 정리한 후, 새로운 다음 게임판을 추가하는 방법으로 업데이트
    // x.slice(0, nextGameIndex)
    const nextGameHistory = [
      ...gameHistory.slice(0, nextGameIndex),
      nextSquares,
    ]
    setGameHistory(nextGameHistory)
  }

  // 게임 재시작 기능(함수)
  const restartGame = () => {
    setGameHistory([INITIAL_SQUARES])
    setGameIndex(0)
  }

  // 시간 여행 기능(커링 함수)
  const makeTimeTravel = (travelIndex) => () => {
    setGameIndex(travelIndex)
  }

  // 상태 메시지
  // - 다음 플레이어 [  ]
  // - 게임 위너!! [   ]
  // - 무승부! 게임 위너가 없습니다.
  let statusMessage = `다음 플레이어 ${nextPlayer}`
  if (winner) statusMessage = `게임 위너! ${winner.player}`
  if (isDraw) statusMessage = '무승부! 게임 위너는 없습니다.'

  return (
    <div className="Game">
      <Board
        statusMessage={statusMessage}
        winner={winner}
        squares={squares}
        playGame={playGame}
      />
      <History
        items={gameHistory}
        gameIndex={gameIndex}
        onRestart={restartGame}
        makeTimeTravel={makeTimeTravel}
      />
    </div>
  )
}

// --------------------------------------------------------------------------

function History({ items, gameIndex, onRestart, makeTimeTravel }) {
  return (
    <div className="History">
      <ol className="HistoryList">
        {items.map((item, index) => (
          <HistoryItem
            key={index}
            index={index}
            isFirst={index === 0}
            selectedIndex={gameIndex === index}
            onRestart={onRestart}
            onTimeTravel={makeTimeTravel(index)}
          />
        ))}
      </ol>
    </div>
  )
}

function HistoryItem({
  index,
  isFirst,
  selectedIndex: isDisabled,
  onRestart,
  onTimeTravel,
}) {
  // 타임 트레버(시간 여행) 버튼의 레이블
  const label = isFirst
    ? '게임 시작!'
    : `게임 #${index < 10 ? `0${index}` : index}`
  const ariaLabel = isFirst ? null : `${label} 이동`

  // 조건에 따라 연결될 이벤트 핸들러(리스너)
  const handler = isFirst ? onRestart : onTimeTravel

  return (
    <li className="HistoryListItem">
      <button
        type="button"
        className="HistoryButton"
        aria-label={ariaLabel}
        disabled={isDisabled}
        onClick={handler}
      >
        {label}
      </button>
    </li>
  )
}

/*
<li className="HistoryListItem">
  <button type="button" className="HistoryButton">
    게임 시작!
  </button>
</li>
<li className="HistoryListItem">
  <button
    type="button"
    className="HistoryButton"
    aria-label="게임 #1 이동"
  >
    게임 #1
  </button>
</li>
<li className="HistoryListItem">
  <button
    type="button"
    className="HistoryButton"
    aria-label="게임 #2 이동"
    disabled
  >
    게임 #2
  </button>
</li>
*/

// --------------------------------------------------------------------------

function Board({ statusMessage, winner, squares, playGame }) {
  return (
    <div className="Board">
      <Status>{statusMessage}</Status>
      <SquaresGrid winner={winner} squares={squares} onPlay={playGame} />
    </div>
  )
}

function Status({ children }) {
  return (
    <h2 className="Status" role="status">
      {children}
    </h2>
  )
}

function SquaresGrid({ winner, squares, onPlay }) {
  const handleKeyControls = (e) => {
    const { target, key } = e
    // 사용자가 기본적으로 탐색하는데 사용하는
    // Tab, Enter, SpaceBar 키를 눌렀을 때는
    // 브라우저의 기본 작동대로 처리
    if (key === 'Tab' || key === 'Enter' || key === ' ' /* SpaceBar */) return

    // 위에 나열된 키 외에는 브라우저 기본 작동 방지
    // ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Escape
    e.preventDefault()

    // 이벤트 대상(target)으로부터
    // 현재 초점이 이동된 그리드 셀의 행/열 순서(인덱스) 값 가져오기
    let rowIndex = Number(target.getAttribute('aria-rowindex'))
    let colIndex = Number(target.getAttribute('aria-colindex'))

    switch (key) {
      case 'ArrowRight':
        if (colIndex <= GRID.COLS) colIndex += 1
        break
      case 'ArrowLeft':
        if (colIndex > 1) colIndex -= 1
        break
      case 'ArrowUp':
        if (rowIndex > 1) rowIndex -= 1
        break
      case 'ArrowDown':
        if (colIndex <= GRID.ROWS) rowIndex += 1
        break
      case 'Escape':
        console.log('Esc')
        break
    }

    const grid = target.closest('[role="grid"]')
    const focusGridCell = grid.querySelector(
      `[aria-rowindex="${rowIndex}"][aria-colindex="${colIndex}"]`
    )

    focusGridCell?.focus()
  }

  return (
    <div
      role="grid"
      tabIndex={-1}
      onKeyDown={handleKeyControls}
      className="Squares"
      aria-label="틱택토 게임판"
      aria-rowcount={GRID.ROWS}
      aria-colcount={GRID.COLS}
    >
      {squares.map((square, index) => {
        const isWinnerPattern = winner?.pattern?.includes(index)
        return (
          <SquareGridCell
            isWinnerPattern={isWinnerPattern}
            key={index}
            index={index}
            onPlay={onPlay}
          >
            {square}
          </SquareGridCell>
        )
      })}
    </div>
  )
}

function SquareGridCell({ isWinnerPattern, children, index, onPlay }) {
  // 이 칸이 이미 선택된 경우, 비활성 상태 (null이 아닌 경우)
  const isDisabled = !!children
  // 현재 칸의 플레이어 이름 ('플레이어 1 | 2' 또는 '비어 있음')
  const playerName = getPlayerName(children) // null
  // 그리드 셀 레이블 설정 (예: '1번째 칸, 플레이어1')
  const label = `${index + 1}번째 칸, ${playerName}`
  // 현재 칸의 행 인덱스 계산 (인덱스를 1부터 시작하도록 변환)
  const rowIndex = Math.floor(index / GRID.ROWS) + 1
  // 현재 칸의 열 인덱스 계산 (인덱스를 1부터 시작하도록 변환)
  const colIndex = (index % GRID.COLS) + 1
  // 칸 클릭 시, 실행될 핸들러 함수
  // 부모 컴포넌트로부터 전달받은 onPlay 함수 호출
  const handlePlay = (e) => onPlay(index, e)

  return (
    <button
      role="gridcell"
      className={tw('Square', isWinnerPattern && 'bg-yellow-300!')}
      onClick={handlePlay}
      aria-disabled={isDisabled}
      aria-rowindex={rowIndex}
      aria-colindex={colIndex}
      aria-label={label}
    >
      {children}
    </button>
  )
}
