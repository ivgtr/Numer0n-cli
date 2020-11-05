import prompts from 'prompts'
import ora from 'ora'
import colors from '../console'

const checkAnswer = async (
  answer: string,
  userAnswer: string
): Promise<result> => {
  let eat = 0
  let bite = 0
  const arrayAnswer = Array.from(answer)
  const arrayUserAnswer = Array.from(userAnswer)

  arrayAnswer.map((v, i): string => {
    if (v === arrayUserAnswer[i]) {
      eat += 1
    }
    return v
  })

  arrayUserAnswer.map((v): string => {
    if (answer.match(v)) {
      bite += 1
    }
    return v
  })

  bite -= eat

  return { eat, bite }
}

const inputAnswer = async (): Promise<string> => {
  const onCancel = () => {
    throw new Error('入力がありませんでした')
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
  const challengesNum = challenges + 1
  console.log(`${colors.red(challengesNum)}${colors.red('回目')}の挑戦`)
  try {
    const userAnswer = await inputAnswer()
    if (userAnswer === answer) {
      return true
    }
    const result = await checkAnswer(answer, userAnswer)
    console.log(
      `${colors.green('EAT')}:${colors.red(result.eat)}  ${colors.green(
        'BITE'
      )}:${colors.red(result.bite)}`
    )
  } catch (err) {
    throw new Error(err.message)
  }
  return startGame(answer, challengesNum)
}

const createAnswer = async (difficult: number): Promise<string> => {
  let answerNumber: string
  if (difficult < 3) {
    const length = difficult > 1 ? 4 : 3
    answerNumber = Array.from(new Array(10), (_, i) => ({
      i,
      rand: Math.random()
    }))
      .sort((l, r) => l.rand - r.rand)
      .slice(0, length)
      .map((v) => v.i)
      .join('')
  } else {
    answerNumber = Math.floor(Math.random() * 10001).toString()
  }

  return answerNumber
}

const selecteDifficulty = async (): Promise<difficulty> => {
  const difficultyList = [
    {
      title: 'Easy(3桁、被りなし)',
      value: 1
    },
    {
      title: 'Normal(4桁、被りなし) ',
      value: 2
    },
    {
      title: 'Hard(4桁、被りあり)',
      value: 3
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
  try {
    const difficulty = await selecteDifficulty()
    const spinner = ora('値の生成中...').start()
    const answer = await createAnswer(difficulty)
    await spinner.succeed('準備完了!')

    if (await startGame(answer)) {
      console.log('正解です')
    }
  } catch (err) {
    console.error(`${colors.red('✖')} ${err.message}`)
  }
}

export default numeron
