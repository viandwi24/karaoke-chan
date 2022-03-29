import React, { useEffect, useState } from 'react'
// @ts-ignore
import YouTubePlayer from 'youtube-player'
import logo from './logo.svg'
import './App.scss'

export type IPage = 'coin_insert' | 'song_select' | 'song_player'

function PageCoinInsert({ onContinue }: { onContinue: (songCount: number) => void }) {
  const [clickCount, setClickCount] = useState(0)
  const [songCount, setSongCount] = useState(0)

  const continueNow = () => {
    setClickCount(clickCount - 1)
    onContinue(songCount - 1)
  }

  const onClick = () => {
    setClickCount(clickCount + 1)
  }

  useEffect(() => {
    const oneSongNeedCoin = 3
    const songCount = Math.round((clickCount - 1) / oneSongNeedCoin)
    setSongCount(songCount)
  }, [clickCount])
  
  if (clickCount === 0) {
    return (
      <div
        className="cursor-pointer flex-1 font-bold text-2xl flex flex-col justify-center items-center p-1 px-3 bg-slate-900"
        onClick={onClick}
      >
        <div className="animate-pulse">Please, Insert Your Coin...</div>
        <div className="text-xs mt-4">Click Screen Area for simulate insert coin</div>
      </div>
    )
  }
  return (
    <div
      className="cursor-pointer flex-1 font-bold text-2xl flex flex-col justify-center items-center p-1 px-3 bg-slate-900"
      onClick={onClick}
    >
      <div>Can Play <span className="text-green-500">{songCount}</span> Song</div>
      <div>Your Inserted Coin : <span className="text-yellow-500">{clickCount}</span></div>
      <div className="text-xs">Click Screen Area Again for simulate insert 1 coin</div>
      <div className="mt-4">
        {songCount > 0 && (
          <button
            className="rounded-lg px-4 py-2 text-sm bg-blue-500 z-10"
            onClick={continueNow}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  )
}

export interface Song {
  title: string
  artist: string
  id: string
}

export function GetAllSongs () {
  const songs: Song[] = []
  songs.push({
    title: 'Heavy Rotation',
    artist: 'AKB48',
    id: 'CSPw5PK8zTg'
  })
  songs.push({
    title: 'Fortune Cookie',
    artist: 'AKB48',
    id: 'mRpxaXgvvlI'
  })
  songs.push({
    title: 'Mendung Tanpo Udan',
    artist: 'Denny Caknan ft. Ndarboy',
    id: 'Jk9u-e287V8'
  })
  songs.push({
    title: 'Yang Terdalam',
    artist: 'Peterpan',
    id: 'T-1Vpnfd8c8'
  })
  songs.push({
    title: 'Haruskah Ku Mati',
    artist: 'Ada Band',
    id: 'eK3ZzRa4VwQ'
  })
  songs.push({
    title: 'Kisah Cintaku',
    artist: 'Peterpan',
    id: 'KPVdSAJEbfA'
  })
  songs.push({
    title: 'Start Dash',
    artist: `µ's`,
    id: 'AhMjOHrOTIw'
  })
  return songs  
}

export function PageSongPlayer({ song, onBack }: { song: Song, onBack: () => void }) {
  const [player, setPlayer] = useState<any>()
  const [lastState, setLastState] = useState<number>()
  const [started, setStarted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currTime, setCurrTime] = useState(0)
  const displayDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
  const onPlayerStarted = (player: any) => {
    setTimeout(() => {
      player.getDuration().then((dur: any) => setDuration(Math.round(dur)))
    }, 1000)
  }
  const onPlayerStateChange = (player: any, event: any) => {
    console.log(player, event, lastState)
    if (event.data === 0) {
      onBack()
    }
  }
  useEffect(() => {
    const player = YouTubePlayer('video-player')
    setPlayer(player)
    player.loadVideoById(song.id)
    player.playVideo().then(() => {
      onPlayerStarted(player)
    })
    player.on('stateChange', (event: any) => {
      if (!started && event.data === 3) {
        setStarted(true)
      }
      onPlayerStateChange(player, event)
    })
    const interval = setInterval(() => {
      player.getCurrentTime().then((time: any) => {
        setCurrTime(Math.round(time))
      })
    }, 1000)
    return () => {
      clearInterval(interval)
      try {
        player.stopVideo().then(() => {
          player.destroy()
        })
      } catch (error) {
      }
    }
  }, [])
  return (
    <div className="flex-1 font-bold text-2xl flex flex-col space-y-2 relative overflow-hidden p-4 bg-slate-900">
      <div>
        <button className="px-2 py-1 rounded text-sm bg-blue-500" onClick={onBack}>
          Back
        </button>
      </div>
      <div className="flex-1">
        <div className="">
          <div className="video-player" id="video-player" />
        </div>
        <div className="mt-4">
          <div className="music-bar" id="progress">
            <div
              id="length"
              style={{
                width: `${(currTime / duration) * 100}%`
              }}></div>
          </div>
          <div className="text-center">
            {displayDuration(currTime)} / {displayDuration(duration)}
          </div>
        </div>
      </div>
    </div>
  )
}

export function PageSelectSong({
  songCount,
  onSelectSong
}: {
  songCount: number
  onSelectSong: (song: Song) => void
}) {
  const songs = GetAllSongs()
  return (
    <div className="flex-1 font-bold text-2xl flex flex-col space-y-2 relative overflow-hidden p-4 bg-slate-900">
      <div className="invisible">
        <div className="video-player" id="video-player" />
      </div>
      <div className="flex justify-end space-x-2">
        <div className="rounded px-4 py-2 text-xs bg-blue-500">
          Remaining Song : {songCount + 2}
        </div>
      </div>
      <div className="flex-1 flex flex-col space-y-2">
        {songs.map((song, index) => (
          <div
            className="cursor-pointer px-4 py-2 rounded bg-slate-800 hover:bg-slate-700"
            key={index}
            onClick={() => {
              onSelectSong(song)
            }}
          >
            <div className="text-sm">{song.title}</div>
            <div className="text-xs">{song.artist}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [page, setPage] = useState<IPage>('coin_insert')
  const [songCount, setSongCount] = useState(0)
  const [song, setSong] = useState<Song>()
  useEffect(() => {
    if (page === 'song_select' || page === 'song_player') {
      setSongCount(songCount - 1)
      if (songCount < -1) {
        setPage('coin_insert')
      }
    }
  }, [page])
  return (
    <div className="App flex justify-center items-center font-game font-bold h-screen w-screen text-gray-100 bg-slate-900">
      <div className="machine-container">
        <div
          className="flex flex-col w-96 h-96 bg-red-700 rounded-xl relative overflow-hidden"
          style={{
            width: '40rem',
            height: '40rem',
          }}
        >
          <div className="bg-slate-800">
            <div className="text-xl text-center">
              KARAOKE-CHAN
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-between p-6 bg-slate-700">
            <div className="w-full flex-1 flex flex-col rounded-xl relative overflow-hidden bg-slate-900">
              {page === 'coin_insert' && <PageCoinInsert onContinue={(songCount: number) => {
                setPage('song_select')
                setSongCount(songCount)
              }} />}
              {page === 'song_select' && <PageSelectSong songCount={songCount} onSelectSong={(song) => {
                setSong(song)
                setPage('song_player')
              }} />}
              {page === 'song_player' && song && <PageSongPlayer song={song} onBack={() => setPage('song_select')} />}
            </div>
          </div>
          <div className="bg-slate-800">
            <div className="text-xl text-center">
              TUGAS TBO
            </div>
          </div>
          {/* <div>
            <div className="speaker"></div>
            <div className="speaker"></div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
