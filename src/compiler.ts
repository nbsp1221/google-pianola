import path from 'path';

async function load_content(url: string): Promise<string | null> {
  try {
    const res = await fetch(chrome.runtime.getURL(url));
    if(res.status == 200)
      return await res.text();
  }
  catch {
    return null;
  }

  return null;
}

function getValue(line:string, key: string): string | undefined {
  const pos = line.indexOf(key);
  if( pos != -1) {
    return line.substring(pos+key.length).trim();
  }
}

function getValueNumber(line:string, key: string): number | undefined {
  const val = getValue(line, key);
  if(typeof val != 'undefined') {
    const num = parseInt(val);
    if(!isNaN(num))
      return num;
  }
}


interface MusicCode {
  isSharp: boolean;   // # 올릴지
  code: number;       // 도 레 미 파 솔 라 시 도(인덱스)
  octave: number;     // 옥타브

  ok?: boolean;
}

interface MusicNote {
  isRest: boolean;        // 쉼표인가?
  delay: number;          // 쉼표 딜레이 or 박자
  note: MusicCode[];      // 코드 배열 (화음포함)

  isJoin: boolean;        // join 모드 (화음처리를 안함)
}


// 한 라인을 파싱하는 함수
// [octave] [code(?Sharp)] [note|rest]
export function lineParser(syntax: string): [MusicNote | null, Error | null] {

  const syntax_code = ['도', '레', '미', '파', '솔', '라', '시'];
  const syntax_delay = '~'; // 쉼표
  const syntax_octaveUp = '>';
  const syntax_octaveDown = '<';
  const syntax_sharp = '#';
  const syntax_dotted = '.';  // 점음표

  const syntax_join = '@';  // 집합체구문 처리 (화음처리X)

  const codeList: MusicCode[] = [];

  // 화음처리
  let last_code = -1;

  // 모든 공백 제거
  syntax = syntax.replace(' ', '');

  let i = 0;

  let base_octave = 0;
  let isSharp = false;
  let isJoin = false;
  try {
    // 한자리씩 루프
    for(i=0; i<syntax.length; i++) {
      const w = syntax[i];

      // [] 집합체 구문 추가
      
      // octave 체크
      switch(w) {
        case syntax_join:
          isJoin = true;
          continue;
        case syntax_octaveDown:
          base_octave = base_octave - 1;
          continue;
        case syntax_octaveUp:
          base_octave = base_octave + 1;
          continue;
      }

      const node_index = syntax_code.indexOf(w);
      if(node_index == -1)
        break;

      if(!isJoin) {
        // 더이상 음표가 나오지 않을때 탈출

        // 화음처리 미솔도 -> "도" 는 octave++
        // console.log(last_code, '>=', node_index);
        if(last_code >= node_index) {
          base_octave++;
        }
        last_code = node_index;
      }




      // 다음 문자열에 # 이 있는지 검사
      if(i+1 != syntax.length ) {
        if(syntax[i+1] == syntax_sharp) {
          isSharp = true;
          i = i + 1;
        }
      }

      codeList.push({
        isSharp: isSharp,
        code: node_index,
        octave: base_octave,
      });
      
      // ! 이거 어떻게하지
      // ! 화음처리인데 막 <<도>>미 이런거 없겠지..?
      // 합쳐진건 화음처리를 reset 한다.
      if(isJoin)
        base_octave = 0;
      isSharp = false;

    }

    // 음표처리
    if(i >= syntax.length) {
      throw new Error('맨 마지막에는 음표가 와야합니다.');
    }

    let isRest = false;
    let delay = -1;

    let delayStr = syntax.substring(i);

    // 계이름도 같이 있을 경우
    if(codeList.length) {
      if(delayStr.indexOf(syntax_delay) != -1) {
        throw new Error('맨 마지막에는 음표가 와야합니다.');
      }
    }
    else {
      // 쉼표만 있을경우
      // 쉼표가 있는지 판단  -> "도미솔 4~"  계이름과 쉼표가 같이 있는경우 판단
      delayStr = delayStr.replace(syntax_delay, '');
      isRest = true;
    }

    let is_v2 = false;

    // 점이 붙으면
    if(delayStr.substring(0, 1) == syntax_dotted) {
      delayStr = delayStr.substring(1);
      is_v2 = true;
    }

    delay = parseInt(delayStr);
    if(isNaN(delay)) {
      console.error(syntax);
      throw new Error('음표에 이상한 문자가 포함되어 있습니다.');
    }

    delay = 4 / delay;

    // 점붙은거 처리
    if(is_v2) {
      delay = delay + (delay / 2);
    }

    return [{
      isRest: isRest,
      delay: delay,
      note: codeList,
      isJoin: isJoin,
    }, null];
  }
  catch(err) {
    if(err) {
      const e = err as Error;
      console.log(e);
      return [null, e];
    }
  }
  
  return [null, null];
}



interface Sheet {
  time: number;
  isRest: boolean;    // 쉼표인가? 쉼표라면 쉬어줘야됨 아니라면 누르고 있어야함
  delay: number;      // 쉼표 딜레이 or 박자
  note: MusicCode[];
  ok?: boolean;
  
  symbol?: string;
}

interface Option {
  time: number;
  bpm: number;
  octaves: number;
}
export default async function parser(sheetUrl: string, option?: Option): Promise<[Sheet[] | null, Error | null]> {
  const sheetList: Sheet[] = [];

  let current_bpm = -1;
  let name: string | undefined = undefined;
  let current_time = 0;
  let current_octaves = 0;

  let isCombine = false;

  if(option) {
    current_time = option.time;
    current_bpm = option.bpm;
    current_octaves = option.octaves;
  }

  try {
    const main_content = await load_content(sheetUrl);
    if(main_content == null) {
      // throw new Handler(ParserError.MainNotFound);
      throw new Error('asdf');
    }

    let loopMode = false;
    let loopCount = 0;
    const loopBuffer:Sheet[] = [];

    const lines = main_content.split('\n');
    for(let i=0; i<lines.length; i++) {
      let wordFullString = lines[i].trim();

      if(wordFullString.substring(0, 2) == '//') continue;  // 처음 주석
      if (!(/\S/.test(wordFullString))) continue;  // 공백만 있을경우
      
      // 인라인 주석
      const posComment = wordFullString.indexOf('//');
      if(posComment != -1) {
        wordFullString = wordFullString.substring(0, posComment );
      }

      const wordList = lines[i].split(' ');

      if(wordFullString.length == 0 || wordList.length == 0) continue;
      
      // 중단문
      if(wordFullString == '{{end}}') {
        break;
      }


      // 이음줄인가?
      if(wordFullString == '~') {
        isCombine = true;
        continue;
      }

      // loop 모드
      if(wordFullString.substring(0, 1) == '{') {

        if(loopMode) {
          throw '루프모드를 안닫음';
        }
        const num = parseInt(wordFullString.substring(1));
        if(isNaN(num)) {
          throw 'loop모드 숫자가 이상함';
        }
        loopMode = true;
        loopCount = num;
        continue;
      }
      // loop 모드 종료
      if(wordFullString.substring(0, 1) == '}') {
        if(loopMode == false) {
          throw '루프모드 열린 구간이 없음';
        }
        
        let tempBaseTime = 0;
        let sumDelay = 0;
        for(const aa of loopBuffer) {
          sumDelay += aa.delay;
        }

        for(let n=0; n<loopCount; n++) {
          for(const aa of loopBuffer) {
            sheetList.push({
              time: aa.time + tempBaseTime,
              delay: aa.delay,
              isRest: aa.isRest,
              note: aa.note,
              symbol: aa.symbol,
            });
          }
          if(n != loopCount - 1) {
            current_time = current_time + sumDelay;
            tempBaseTime += sumDelay;
          }
        }
        
        loopBuffer.length = 0;
        loopMode = false;
        loopCount = 0;
        continue;
      }

      // const line = lines[i].trim().toLowerCase();
      switch(wordList[0].toLowerCase()) {

        case 'name':
        {
          // 이름은 다음에 나오면 무시함
          if(typeof name == 'undefined')
            name = wordList.slice(1).join(' ');

          continue;
        }

        case 'bpm':
        {
          // 현재 bpm 을 설정
          const num = parseInt(wordList[1].trim());
          if(isNaN(num)) {
            throw 'syntax error bpm line ' + i.toString();
          }
          current_bpm = num;
          continue;
        }

        case 'octaves': {
          const num = parseInt(wordList[1].trim());
          if(isNaN(num)) {
            throw 'octaves failure ' + i.toString();
          }
          current_octaves = num;
          continue;
        }

        case 'import':
        {
          // 재귀를 돌리자
          const musicModuleName = wordList.slice(1);
          for(const module of musicModuleName) {
            const [sheet, error] = await parser(path.join(path.dirname(sheetUrl), module), {
              time: current_time,
              bpm: current_bpm,
              octaves: current_octaves,
            });
  
            if(error) {
              throw 'asdfagfgfdggdf';
            }
  
            if(sheet) {
              sheetList.push(...sheet);
            }
          }
          continue;
        }

      }



      // 음표 라인을 
      const [note, error] = lineParser(wordFullString);
      if(error) {
        throw 'parse error';
      }
      // console.log('note', note);


      if(note) {
        const calcBPM = note.delay * (60/current_bpm);
        // const calcBPM = note.delay * 1000;

        // octaves
        for(const v of note.note) {
          v.octave += current_octaves;
        }

        // 쉼표가 아니라면
        if(!note.isRest) {
          // 이음줄
          if(isCombine) {
            isCombine = false;
            
            const last = sheetList[sheetList.length - 1];
            last.delay += calcBPM;
            current_time = current_time + calcBPM;
          }
          else {
            // 화음처리를 안하면 이어서 붙임
            if(note.isJoin) {
              for(const n of note.note) {
                if(loopMode) 
                  loopBuffer.push({
                    time: current_time,
                    delay: calcBPM,
                    isRest: note.isRest,
                    note: [n],
                    symbol: path.basename(sheetUrl) + ':' + (i+1).toString(),
                  });
                else
                  sheetList.push({
                    time: current_time,
                    delay: calcBPM,
                    isRest: note.isRest,
                    note: [n],
                    symbol: path.basename(sheetUrl) + ':' + (i+1).toString(),
                  });
                current_time = current_time + calcBPM;
              }
            }
            else {
              if(loopMode) 
                loopBuffer.push({
                  time: current_time,
                  delay: calcBPM,
                  isRest: note.isRest,
                  note: note.note,
                  symbol: path.basename(sheetUrl) + ':' + (i+1).toString(),
                });
              else
                sheetList.push({
                  time: current_time,
                  delay: calcBPM,
                  isRest: note.isRest,
                  note: note.note,
                  symbol: path.basename(sheetUrl) + ':' + (i+1).toString(),
                });
              current_time = current_time + calcBPM;
            }


          }

        }
        else {
          // 쉼표라면
          current_time = current_time + calcBPM;
        }
        
        
        // sheetList
      }
      

    }
    


    return [sheetList, null];
  }
  catch(err) {
    const e = err as Error;
    return [null, e];
  }
  

  
  // console.log(res.status);

  // if(res.status != 200) {
  //   sheetObject.status = 'error';
  //   sheetObject.status_message = 'file ';
  //   return sheetObject;
  // }

  // console.log(await res.text());
}

