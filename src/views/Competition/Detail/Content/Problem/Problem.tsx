import React, { useEffect, useState } from 'react'
import { getProblemNewApi, getProblemNewListApi } from '@/api/problemNew'
import { getRecordListApi } from '@/api/competitionMixture'
import { CompetitionType, ICompetition } from '@/vite-env'
import { Outlet, useOutletContext } from 'react-router-dom'
import ProblemStateLabel from '../../Label.tsx/ProblemStateLabel'

type CompetitionState = 'notEnter' | 'underway' | 'enter' | 'finished'

interface Problems {
  key: string
  index: number
  score: number | string
  title: string
  state: JSX.Element
}

const getProblem = (
  competition: ICompetition,
  setproblems: Function,
  type: CompetitionType
) => {
  getProblemNewListApi(competition.id as string).then(res => {
    const problemIds: string[] = res.data.data.problemIds
    if (problemIds) {
      problemIds.forEach(async (id, index) => {
        const res = await Promise.all([
          getProblemNewApi(id),
          getRecordListApi(type, competition.id, {
            problem_id: id
          })
        ])
        const problem = res[0].data.data.problem
        const records = res[1].data.data.records
        setproblems((value: Problems[]) => [
          ...value,
          {
            key: id,
            index: index + 1,
            score: '',
            title: problem.title,
            state: (
              <ProblemStateLabel
                problem={problem}
                records={records}
              ></ProblemStateLabel>
            )
          }
        ])
      })
    }
  })
}
const Element: React.FC = () => {
  const [competition, comptitionState, setanswering, type] =
    useOutletContext<
      [ICompetition, CompetitionState, Function, CompetitionType]
    >()
  const [problems, setproblems] = useState<Problems[]>([])

  useEffect(() => {
    switch (comptitionState) {
      case 'notEnter':
        break

      default:
        getProblem(competition, setproblems, type)
        break
    }
  }, [competition, comptitionState, type])

  return <Outlet context={[problems, setanswering, competition, type]}></Outlet>
}

export default Element
