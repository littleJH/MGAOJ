import React, { useEffect, useState, Fragment, useMemo } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { getProblemNewApi } from '@/api/problemNew'
import {
  IProblem,
  ICaseSample,
  IEditorConfig,
  IRunResult,
  IRecordState,
  CompetitionType
} from '@/vite-env'
import ReadOnly from '@/components/Editor/ReadOnly'
import { Button, Popover, Segmented, Switch, Table, notification } from 'antd'
import Column from 'antd/es/table/Column'
import Code from '@/components/Editor/Code'
import { languageList } from '@/components/Editor/LanguageList'
import RunResult from '@/views/Problem/Detail/RunResult'
import TextArea from 'antd/es/input/TextArea'
import { createTestApi } from '@/api/test'
import { createRecordApi } from '@/api/competitionMixture'

const config: IEditorConfig = localStorage.getItem('editorConfig')
  ? JSON.parse(localStorage.getItem('editorConfig') as string)
  : {
      theme: 'vs-dark',
      language: 'cpp'
    }

const Answer: React.FC = () => {
  const nav = useNavigate()
  const { competition_id, problem_id } = useParams()
  const [a, b, c, type] = useOutletContext<[any, any, any, CompetitionType]>()
  const [problem, setproblem] = useState<IProblem>()
  const [editorConfig, seteditorConfig] = useState<IEditorConfig>(config)
  const [dataSource, setdataSource] = useState<
    { key: string; input: string; output: string }[]
  >([])
  const [code, setcode] = useState<string>('')
  const [openLanguageList, setopenLanguageList] = useState(false)
  const [showConsole, setshowConsole] = useState(false)
  const [consoleMode, setconsoleMode] = useState<'test' | 'result'>('test')
  const [testTextareaValue, settestTextareaValue] = useState<string>('')
  const [caseSamples, setcaseSamples] = useState<ICaseSample[]>([])
  const [runResult, setrunResult] = useState<IRunResult>({} as IRunResult)
  const [currentState, setcurrentState] = useState<IRecordState>(
    {} as IRecordState
  )

  const currentLang: JSX.Element = useMemo(() => {
    let element: JSX.Element = <div></div>
    languageList.forEach(value => {
      if (value.value === editorConfig.language) element = value.label
    })
    return element
  }, [editorConfig])

  useEffect(() => {
    getProblemNewApi(problem_id as string).then(res => {
      setproblem(res.data.data.problem)
      settestTextareaValue(res.data.data.caseSamples[0].input)
      res.data.data.caseSamples.forEach((item: ICaseSample, index: number) => {
        setdataSource(value => [
          ...value,
          {
            key: String(item.cid),
            input: item.input,
            output: item.output
          }
        ])
      })
    })
    window.addEventListener('resize', () => {})
  }, [])

  useEffect(() => {
    localStorage.setItem('editorConfig', JSON.stringify(editorConfig))
  }, [editorConfig])

  const runCode = () => {
    setcurrentState({
      value: 'Running',
      label: '运行中',
      state: 'waiting'
    })
    setshowConsole(true)
    setconsoleMode('result')

    const data = {
      language: 'C++11',
      code: code,
      input: testTextareaValue,
      time_limit: problem?.time_limit,
      memory_limit: problem?.memory_limit
    }
    createTestApi(JSON.stringify(data)).then(res => {
      setrunResult(res.data.data)

      console.log(res.data)
    })
  }
  const craeteRecord = () => {
    const data = {
      language: 'C++11',
      code: code,
      problem_id: problem_id
    }
    createRecordApi(type, competition_id as string, JSON.stringify(data)).then(
      res => {
        console.log(res.data)
        if (res.data.code === 200) {
          notification.success({
            message: res.data.msg,
            placement: 'topRight'
          })
          nav(`/competition/${competition_id}/record`)
        } else {
          notification.info({
            message: res.data.msg,
            placement: 'topRight'
          })
        }
      }
    )
  }

  return (
    <div className="p-8">
      {/* description */}
      {problem && (
        <Fragment>
          <ReadOnly
            className="my-4"
            editableClassName="text-base bg-gray-100 rounded px-8 py-2"
            title="题目描述"
            value={JSON.parse(problem?.description as string)}
          ></ReadOnly>
          <ReadOnly
            title="时间限制"
            text={[`${problem?.time_limit} ms`]}
          ></ReadOnly>
          <ReadOnly
            title="空间限制"
            text={[`${problem?.memory_limit} kb`]}
          ></ReadOnly>
          <ReadOnly
            title={'输入格式'}
            value={JSON.parse(problem?.input as string)}
          ></ReadOnly>
          <ReadOnly
            title={'输出格式'}
            value={JSON.parse(problem?.output as string)}
          ></ReadOnly>
          <div className="font-bold">示例</div>
          <Table
            size="small"
            className=""
            bordered
            dataSource={dataSource}
            pagination={false}
          >
            <Column title="input" dataIndex={'input'}></Column>
            <Column title="output" dataIndex={'output'}></Column>
          </Table>
          <ReadOnly
            title="提示"
            value={JSON.parse(problem?.hint as string)}
          ></ReadOnly>
          <ReadOnly
            title="来源"
            value={JSON.parse(problem?.source as string)}
          ></ReadOnly>
        </Fragment>
      )}

      {/* editor */}
      <div className="shadow">
        <div className={'bg-gray-100 p-2 flex items-center justify-between '}>
          <Popover
            style={{
              width: '4rem',
              padding: '0'
            }}
            trigger="click"
            open={openLanguageList}
            content={languageList.map((value: any, index: number) => {
              return (
                <div
                  className="px-2 hover:cursor-pointer hover:shadow rounded flex items-center justify-start"
                  onClick={() => {
                    setopenLanguageList(false)
                    seteditorConfig(value => {
                      return {
                        theme: value.theme,
                        language: languageList[index].value
                      }
                    })
                  }}
                >
                  <span>{value.label}</span>
                  <span className="px-2"> {value.value}</span>
                </div>
              )
            })}
          >
            <div
              onClick={() => setopenLanguageList(true)}
              className="hover:cursor-pointer hover:shadow flex justify-center items-center px-2 rounded"
            >
              <span>{currentLang}</span>
            </div>
          </Popover>
          <div>
            <svg
              className="icon hover:cursor-pointer "
              onClick={() => {
                seteditorConfig(value => {
                  return {
                    theme: value.theme === 'light' ? 'vs-dark' : 'light',
                    language: value.language
                  }
                })
              }}
            >
              {editorConfig.theme === 'light' ? (
                <use href="#icon-light"></use>
              ) : (
                <use href="#icon-dark"></use>
              )}
            </svg>
          </div>
        </div>
        <div>
          <Code
            value={code}
            theme={editorConfig.theme}
            language={editorConfig.language}
            height="500px"
            width="100%"
            className=" "
            codeChange={(value: string) => {
              localStorage.setItem(`code-${problem_id}`, value)
              setcode(value)
            }}
          ></Code>
        </div>
      </div>
      {/* footer */}
      <div className="flex items-center py-1">
        {/* <div className="flex-grow flex items-center">
          <Switch
            checked={switchChecked}
            onChange={value => setswitchChecked(value)}
          ></Switch>
          <span>自定义测试用例</span>
        </div> */}
        <div className="flex-grow">
          <Switch
            checkedChildren={'控制台'}
            unCheckedChildren={'控制台'}
            checked={showConsole}
            onChange={value => setshowConsole(value)}
          ></Switch>
        </div>
        <div className="">
          <Button onClick={runCode}>执行代码</Button>
          <Button onClick={craeteRecord} className="mx-1" type="primary">
            提交
          </Button>
        </div>
      </div>
      {/* console */}
      {showConsole && (
        <div className=" border border-solid border-gray-300 rounded">
          <Segmented
            options={[
              {
                label: '测试用例',
                value: 'test'
              },
              {
                label: '执行结果',
                value: 'result'
              }
            ]}
            value={consoleMode}
            onChange={value => setconsoleMode(value as 'test' | 'result')}
          ></Segmented>
          <div className="w-full">
            {consoleMode === 'test' && (
              <div className="p-4">
                <TextArea
                  value={testTextareaValue}
                  style={{ height: '100%' }}
                  onChange={e => settestTextareaValue(e.target.value)}
                ></TextArea>
              </div>
            )}
            {consoleMode === 'result' && (
              <RunResult
                caseSample={{
                  input: testTextareaValue,
                  output: runResult.output
                }}
                runResult={runResult}
                currentState={currentState}
                setcurrentState={setcurrentState}
              ></RunResult>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Answer
