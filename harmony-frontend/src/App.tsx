
// import { Piano } from 'react-nexusui';
import './index.css';
import { Piano } from './Piano';
import * as Tone from 'tone'
import { pitch } from './notes';
import { socket } from './socket';
import { useEffect, useState } from 'react';

function App() {

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [colorId, setColorId] = useState();

  useEffect(() => {
    function onConnect() {
      console.log("me conecte al socket desde el cliente!")
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('color_id', (value) => {
      setColorId(value)
    })
    socket.on('presskey', (noteToPlay: string) => {
      console.log(`reproduciendo ${noteToPlay}`)
      playSynth(noteToPlay)
    })

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  // const synth = new Tone.MembraneSynth().toMaster();
  const synth = new Tone.Synth()
  synth.oscillator.type = "sine";
  synth.toMaster();

  function playSynth(note: string) {
    console.log(`playing ${note}`)
    synth.triggerAttackRelease(note, "8n")
  }

  function processPianoClick(change: ({note: number, state: boolean})) {
    if (change.state) {
      console.log(change.note)
      const noteToPlay = pitch[change.note-24]
      socket.emit('presskey', noteToPlay);
      // playSynth(noteToPlay)
    }
  }
  
  return (
    <div>
      <Piano colorId={colorId}></Piano>
      {/* <Piano onChange={(change: ({note: number, state: boolean})) => processPianoClick(change)}/> */}
    </div>
  )
}

export default App
