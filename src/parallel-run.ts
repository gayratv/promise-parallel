import chalk from 'chalk';

const parallelCTX = 3;
const MaxData = 10;

type Data = { id: number; desc: string };

const dataProxy: Data[] = [];
function generateData() {
  for (let i = 0; i < MaxData; i++) {
    dataProxy.push({ id: i + 1000, desc: 'descr ' + i });
  }
}

export function rnd(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pageGoto(id: number) {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      setTimeout(() => resolve(id), rnd(100, 400));
    } else {
      setTimeout(() => {
        // throw new Error('Error' + id);
        reject(new Error('Error' + id));
      }, rnd(100, 500));
    }
  });
}

function getLocatorTextMock() {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      setTimeout(() => resolve('H1'), 500);
    } else {
      setTimeout(() => {
        resolve('GOOD');
      }, 500);
    }
  });
}

export async function parallelTasks() {
  let currentProxyPosition = 0;
  while (currentProxyPosition < dataProxy.length) {
    const ctxPoll = [];
    for (let i = 0; i < parallelCTX && currentProxyPosition < dataProxy.length; i++) {
      const gotoPromice = pageGoto(dataProxy[currentProxyPosition].id);
      const idFor = dataProxy[currentProxyPosition].id;
      console.log(chalk.blue(`Start checking ${idFor}`));
      const inForCurrent = currentProxyPosition;
      gotoPromice
        .then(async (result) => {
          const ipProblem = await getLocatorTextMock();

          let ipNoProblemFlag = 1;
          if (ipProblem === 'H1') {
            ipNoProblemFlag = 0;
          }
          console.log('---- OK    :', idFor, ' ipNoProblemFlag ', ipNoProblemFlag);
        })
        .catch(async (err) => {
          console.log('---- ERROR :', idFor);
        });

      ctxPoll.push({ gotoPromice });
      currentProxyPosition++;
    }

    const promices = ctxPoll.map((value) => value.gotoPromice);
    // подождем завершения промисов
    await Promise.allSettled(promices);
    console.log(chalk.red('await Promise.allSettled(promices);'));
  }
  console.log('parallelTasks finished');
}

generateData();
console.log(`\n\n`);
await parallelTasks();
console.log('await parallelTasks(); finished');
// process.exit(0);
