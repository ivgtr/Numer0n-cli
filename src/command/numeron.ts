import prompts from 'prompts'
import ora from 'ora'
import colors from '../console'

const inputAnswer = async (): Promise<string> => {
  const onCancel = () => {
    throw new Error(
      '入力内容が確認できませんでした...もう一度最初から入力してください。'
    )
  }
  const { userAnswer } = await prompts(
    [
      {
        type: 'text',
        name: 'userAnswer',
        message: '数字を入力してください',
        validate: (value) => (!value ? '何か入力してください' : true)
      }
    ],
    { onCancel }
  )

  return userAnswer
}

const startGame = async (answer: string, challenges = 0): Promise<boolean> => {
  const userAnswer = await inputAnswer()
}

const createAnswer = async (difficult: string): Promise<string> => {
  // console.log(`難易度は ${difficult}`)
  return '123'
}

const selecteDifficulty = async (): Promise<difficulty> => {
  const difficultyList = [
    {
      title: 'Easy(簡単)',
      value: '1'
    },
    {
      title: 'Normal(普通...より難しい) ',
      value: '2'
    },
    {
      title: 'Hard(かなり難しい)',
      value: '3'
    }
  ]

  const onCancel = () => {
    throw new Error('選択されませんでした')
  }

  const { difficultyId } = await prompts(
    [
      {
        type: 'select',
        name: 'difficultyId',
        message: '難易度を選択してください',
        choices: difficultyList
      }
    ],
    { onCancel }
  )

  return difficultyId
}

const numeron = async (): Promise<void> => {
  const difficulty = await selecteDifficulty()
  const spinner = ora('値の生成中...').start()
  const answer = await createAnswer(difficulty)
  await spinner.succeed('準備完了!')
  startGame(answer)
}

export default numeron
