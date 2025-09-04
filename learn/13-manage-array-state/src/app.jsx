import { LearnSection } from './components'
import ManageArrayState from './components/manage-array-state'
import ManageArrayStateWithImmer from './components/manage-array-state/index-with-immer'

export default function App() {
  return (
    <LearnSection title="배열 상태 관리">
      <ManageArrayStateWithImmer />
      <hr />
      <ManageArrayState />
    </LearnSection>
  )
}
