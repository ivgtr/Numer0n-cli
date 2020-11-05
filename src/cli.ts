import program from 'commander'
import pjson from 'pjson'

import { numeron } from './command/controller'

const main = async (): Promise<void> => {
  program
    .command('start')
    .alias('s')
    .description('ゲーム開始')
    .action(() => {
      numeron()
    })

  program
    .version(pjson.version, '-v, --version', 'バージョンを確認')
    .helpOption('-h, --help', 'コマンド一覧を表示')
    .parse(process.argv)
}

export default main
