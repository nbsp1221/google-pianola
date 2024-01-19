
import Peer from 'simple-peer';
import WebSocket from 'ws';
import { delay, generateRandomString } from './utils';
import { NoteEvent, parseMidiFile } from './midiParse';
const wrtc = require('wrtc');



let i = 10;
function createPeerConnection(ws: WebSocket, room: string, src: string, desc: string, sdp: any) {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    wrtc,
    config: {
      iceServers: [{
        urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'],
      }],
      // sdpSemantics: 'unified-plan',
    },
  });
  peer.signal(sdp);

  // 시그널링 데이터를 소켓을 통해 다른 피어에게 전송
  peer.on('signal', (data: any) => {
    if (data.type === 'answer') {
      ws.send(JSON.stringify({ 't': 'd', 'd': { 'r': i++, 'a': 'p', 'b': { 'p': `/${room}/users/${desc}/${src}/-NoU1sA${generateRandomString(13)}`, 'd': data } } }));
      ws.send(`{"t":"d","d":{"r":${i++},"a":"o","b":{"p":"/${room}/users/${desc}/${src}/-NoU1sA${generateRandomString(13)}","d":null}}}`);
    }
  });

  peer.on('track', (track: any) => {
    console.log(track);
  });

  // 연결 성립 시
  peer.on('connect', async () => {
    console.log('연결이 성립되었습니다.');
    // 데이터 전송 예: peer.send('안녕하세요!');
    // peer.send('k|{"white":{"0":{"note":"C","pitch":"","hidden":false},"2":{"note":"D","pitch":"","hidden":false},"4":{"note":"E","pitch":"","hidden":false},"5":{"note":"F","pitch":"","hidden":false},"7":{"note":"G","pitch":"","hidden":false},"9":{"note":"A","pitch":"","hidden":false},"11":{"note":"B","pitch":"","hidden":false}},"black":{"1":{"note":"C","pitch":"♯","hidden":true},"3":{"note":"D","pitch":"♯","hidden":true},"6":{"note":"F","pitch":"♯","hidden":true},"8":{"note":"G","pitch":"♯","hidden":true},"10":{"note":"A","pitch":"♯","hidden":true}}}');

    // 내 이모지 설정
    peer.send('eQ');

    // 악기 설정
    peer.send('ipiano');
    // peer.send('idrum-kit');

    const score = parseMidiFile('Growing of my heart.mid');
    playMusic(score);

    function playMusic(score: NoteEvent[]) {
      score.forEach((note) => {
        setTimeout(() => playNote(note), note.startTime);
      });
    }

    function playNote(note: NoteEvent) {
      // 특정 건반 누르기
      pressKey(note.note);

      // 지정된 시간 후에 건반 떼기
      setTimeout(() => releaseKey(note.note), note.duration);
    }

    function pressKey(key: number) {
      // 1: 건반 누르기, 0: 건반 떼기
      // velocity = 0.5
      // Q = 이모지 (내 이모지랑 안맞으면 눌려도 소리가 안들림)
      peer.send(`1${key}|0.5|Q`);
    }

    // 건반 떼기
    function releaseKey(key: number) {
      peer.send(`0${key}|0.5|Q`);
    }

  });

  setInterval(() => {
    if (!peer.connected) return;
    peer.send('P' + Date.now());
  }, 1);

  // 데이터 수신 시
  peer.on('data', (data: Buffer) => {
    console.log('받은 데이터:', data.toString());
  });

  peer.on('stream', (data: Buffer) => {
    console.log('stream 받은 데이터:', data.toString());
  });

  // 에러 처리
  peer.on('error', (err: Error) => {
    console.error('오류 발생:', err);
  });

  peer.on('close', (err: Error) => {
    console.log('close:', err);
  });
}
async function main() {

  const socket = 'wss://s-usc1a-nss-2043.firebaseio.com/.ws?v=5&ns=cl-sharedpiano';
  const ws = new WebSocket(socket);
  let buffer = '';
  ws.onopen = async () => {
    ws.send('{"t":"d","d":{"r":1,"a":"s","b":{"c":{"sdk.js.7-14-3":1}}}}');
    ws.send('{"t":"d","d":{"r":2,"a":"q","b":{"p":"/ZgR4VNFO1/users","h":""}}}');
    await delay(300);
    ws.send('{"t":"d","d":{"r":3,"a":"o","b":{"p":"/ZgR4VNFO1/users/asdfasdf123","d":null}}}');
    await delay(300);
    ws.send('{"t":"d","d":{"r":4,"a":"p","b":{"p":"/ZgR4VNFO1/users/asdfasdf123","d":{"_":true,"id":"Q"}}}}');
  };
  ws.onmessage = async (e) => {
    // 가끔 패킷이 밀려서 여러 개가 한 번에 올 때가 있음
    // 그래서 아래와 같이 누적해서 JSON.parse 를 시도
    buffer += e.data.toString();

    try {
      const data = JSON.parse(e.data.toString());
      console.log(e.data.toString());

      // 상대방이 접속해서 sdp 를 보냈을 때 (WebRTC 로 우리쪽에서 연결해 줘야 함)
      if (typeof data?.d?.b?.d.sdp === 'string') {
        const p = data.d.b.p;

        // ZgR4VNFO1/users/asdfasdf123/DSbsSwo36/-NoU5RQhXh-xvMxI73mx
        // ZgR4VNFO1/users/asdfasdf123/m5KR04MIo/-NoU5RR2v5lHoqArNjiP
        const room = p.split('/')[0];
        const src = p.split('/')[2];
        const desc = p.split('/')[3];

        // 내가 보낸 offer 라면 
        if (src !== 'asdfasdf123') return;
        console.log('room', room, 'src', src, 'desc', desc);
        createPeerConnection(ws, room, src, desc, data.d.b.d);
      }

      // 메시지 처리
      buffer = ''; // 버퍼 초기화
    }
    catch (e) {
      // 완전한 메시지가 아닐 경우 버퍼에 계속 저장
    }
  };
  ws.onerror = (e) => {
    console.log(e);
  };
}
main();
