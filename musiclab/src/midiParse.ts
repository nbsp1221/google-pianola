import fs from 'fs';
import { parseMidi } from 'midi-file';

export interface NoteEvent {
  note: number; // MIDI 노트 번호
  startTime: number; // 시작 시간 (밀리초)
  duration: number; // 지속 시간 (밀리초)
}

export function parseMidiFile(filePath: string): NoteEvent[] {
  const midiData = fs.readFileSync(filePath);
  const midi = parseMidi(midiData);
  const notes: NoteEvent[] = [];
  let currentTime = 0;

  // TODO: 피아노 필터링
  // TODO: 패달 추가
  midi.tracks.forEach((track) => {
    track.forEach((event) => {
      if (event.deltaTime) {
        currentTime += event.deltaTime;
      }

      if (event.type === 'noteOn') {
        notes.push({
          note: event.noteNumber,
          startTime: currentTime,
          duration: 0, // 지속 시간은 noteOff 이벤트에서 계산
        });
      }
      else if (event.type === 'noteOff') {
        const note = notes.find((n) => n.note === event.noteNumber && n.duration === 0);
        if (note) {
          note.duration = currentTime - note.startTime;
        }
      }
    });
  });

  return notes;
}