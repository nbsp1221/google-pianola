import { delay } from './util';

interface pianoSingleNote {
  low: HTMLButtonElement[];
  high: HTMLButtonElement[];
}

export interface CodeInfo {
  octave: number;
  codeIndex: number;
  sharp?: boolean;
}


class piano {
  private pianoSettingSelect: HTMLSelectElement;
  private first_Octaves: string;
  private pianoNoteList: pianoSingleNote[];

  constructor() {

    // 상단헤더
    const header_config = document.getElementById('header-config');

    // 피아노 전체부분
    const pianoElement = document.querySelector('#piano');
    const pianoKeyboard = document.querySelector('piano-keyboard');
    const pianoKeyboardOctav = pianoKeyboard?.shadowRoot
      ?.getElementById('container')
      ?.getElementsByTagName('piano-keyboard-octave');

    // 설정부분
    const pianoSetting = document.querySelector('piano-settings');
    const pianoCollapsible = pianoSetting?.shadowRoot?.querySelector('piano-collapsible');
    const pianoSettingSelect = pianoCollapsible?.querySelector('select[name="octaves"]') as HTMLSelectElement | undefined;

    if(!pianoSettingSelect || !header_config || !pianoElement || !pianoKeyboard || !pianoKeyboardOctav) {
      throw new Error('piano initialization failed');
    }

    // 피아노 건반을 찾음
    const [pianoNoteList, error] = this.getPianoElement(pianoKeyboardOctav);
    if(error) throw error;
    if(!pianoNoteList) throw new Error('piano initialization failed');

    this.pianoSettingSelect = pianoSettingSelect;
    this.first_Octaves = pianoSettingSelect.value;
    this.pianoNoteList = pianoNoteList;
  }

  // set octaves from piano-setting
  setOctaves(oct: '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'Auto' | 'restore' ) {
    if(oct == 'restore') 
      this.pianoSettingSelect.value = this.first_Octaves;
    else
      this.pianoSettingSelect.value = '8';
      
    this.pianoSettingSelect.dispatchEvent(new CustomEvent('input'));
  }

  
  // 특정 건반을 누르는 함수
  async codeDown(octave: number, codeIndex: number, sharp=false): Promise<void> {
    try {
      const blackWhite = sharp ? 'high' : 'low';
      const element = this.pianoNoteList[octave][blackWhite][codeIndex];
      element.dispatchEvent(new Event('mouseup'));
      element.dispatchEvent(new Event('mousedown'));
    }
    catch(err) {
      console.error('piano::down error', octave, codeIndex, sharp);
    }
  }


  // 누른 건반을 때는 함수
  async codeUp(octave: number, codeIndex: number, sharp=false): Promise<void> {
    try {
      const blackWhite = sharp ? 'high' : 'low';
      const element = this.pianoNoteList[octave][blackWhite][codeIndex];
      element.dispatchEvent(new Event('mouseup'));
    }
    catch(err) {
      console.error('piano::up error', octave, codeIndex, sharp);
    }
  }

  // 건반을 시간초로 누르고 있는 함수
  async codePush(octave: number, codeIndex: number, ms: number, sharp=false) {
    this.codeDown(octave, codeIndex, sharp);
    setTimeout(() => {
      this.codeUp(octave, codeIndex, sharp);
    }, ms);
  }

  // codePush 의 배열화
  async codePushList(codeList: CodeInfo[], ms: number) {
    for(const code of codeList) {
      this.codeDown(code.octave, code.codeIndex, code.sharp);
    }
    await delay(ms);
    for(const code of codeList) {
      this.codeUp(code.octave, code.codeIndex, code.sharp);
    }
  }

  // 피아노의 모든 건반을 찾는 함수
  getPianoElement(pianoKeyboardOctav: HTMLCollection): [pianoSingleNote[] | null, Error | null] {
    const pianoList: pianoSingleNote[] = [];
    try {
      for(const octave of pianoKeyboardOctav) {
        const whiteNoteList: HTMLButtonElement[] = []; 
        const blackNoteList: HTMLButtonElement[] = []; 
        const temp: HTMLButtonElement[] = [];
  
        const whiteNote = octave?.shadowRoot?.getElementById('white-notes')?.getElementsByTagName('piano-keyboard-note');
        const blackNote = octave?.shadowRoot?.getElementById('black-notes')?.getElementsByTagName('piano-keyboard-note');

        if(!whiteNote || !blackNote)
          throw new Error('element not found');
        
        if(whiteNote.length == 0 || blackNote.length == 0)
          throw new Error('element not found');

        for(const clavier of whiteNote) {
          const c = clavier?.shadowRoot?.getElementById('container')?.getElementsByTagName('button')[0];
          if(!c) throw new Error('white note element not found');
          whiteNoteList.push(c);
        }


        for(const clavier of blackNote) {
          const c = clavier?.shadowRoot?.getElementById('container')?.getElementsByTagName('button')[0];
          if(c)
            temp.push(c); // Array(5) 도# 레# 파# 솔# 라#
        }

        
        if(pianoList.length != 0) {
          pianoList[pianoList.length - 1].high[6] = whiteNoteList[0];
        }
        blackNoteList.push(...[temp[0], temp[1], whiteNoteList[3], temp[2], temp[3], temp[4], temp[0]]);

        pianoList.push({
          'low': whiteNoteList,     // Array(7) 도  레      미    파  솔  라    시
          'high': blackNoteList,    // Array(7) 도# 레# [미#->파] 파# 솔# 라# [시#-> 다음 '도']
        });
      }

      return [pianoList, null];
    }
    catch(err) {
      return [null, err as Error];
    }
  }


}


export default piano;

