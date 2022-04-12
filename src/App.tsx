import React, { useEffect, useState } from 'react'
// @ts-ignore
import Lyrics from 'song-lyrics-api'
// @ts-ignore
import YouTubePlayer from 'youtube-player'
import './App.scss'

import { AiFillPlayCircle, AiFillPauseCircle } from 'react-icons/ai'
import { IoMdRefresh } from 'react-icons/io'

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
    title: 'Omoide Shiritori',
    artist: 'DIALOGUE+',
    id: 'DvAi0IKt9Ho'
  })
  songs.push({
    title: 'Jadikan Aku Yang Kedua',
    artist: 'Astrid',
    id: 'biMXsluCNnE'
  })
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

export type IPageSongPlayerState = 'pause' | 'play' | 'stop'

export function PageSongPlayer({ song, onBack }: { song: Song, onBack: () => void }) {
  const [player, setPlayer] = useState<any>()
  const [lyric, setLyric] = useState<any>()
  const [lastState, setLastState] = useState<number>()
  const [started, setStarted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currTime, setCurrTime] = useState(0)
  const [state, setState] = useState<IPageSongPlayerState>('stop')
  const displayDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
  const onPlayerStarted = (player: any) => {
    setTimeout(() => {
      player.getDuration().then((dur: any) => setDuration(Math.round(dur)))
      const lyrics = new Lyrics();
      console.log(lyrics.getLyrics('Hot N Cold').then((a: any) => {
        console.log(a)
      }))
    }, 1000)
  }
  const onPlayerStateChange = (player: any, event: any) => {
    console.log(player, event, lastState)
    if (event.data === 0) {
      onBack()
    }
  }
  useEffect(() => {
    const player = YouTubePlayer('video-player', {
      width: '100%',
    })
    setPlayer(player)
    player.loadVideoById(song.id)
    player.playVideo().then(() => {
      onPlayerStarted(player)
      const lyricAppId = 'frM-Ihf1DeEorOpUuOQ5GY4_a3KedTBoSgfH7C1DtGWVDWxzw06_EOSI6sXsXBCw'
      const lyricAppSecret = 'ZxE4XjCvvsnM6JcatpTqShVM1G018FBgGUcfeiylB9TKQxdZ8slnkBmVZi86kviPjqHLjU0aSFRX3HMYX4Y8-A'

    })
    player.on('stateChange', (event: any) => {
      console.log('stateChange', event)
      if (!started && event.data === 3) {
        setState('play')
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

  // methods
  const reset = () => {
    try {
      player.stopVideo().then(() => {
        setState('stop')
        setStarted(false)
        play()
      })
    } catch (error) {}
  }
  const play = () => {
    try {
      player.playVideo()
      setState('play')
    } catch (error) {}
  }
  const pause = () => {
    player.pauseVideo()
    setState('pause')
  }


  return (
    <div className="flex-1 font-bold text-2xl flex flex-col space-y-2 relative overflow-hidden p-4 bg-slate-900">
      <div>
        <button className="px-2 py-1 rounded text-sm bg-blue-500" onClick={onBack}>
          Back
        </button>
      </div>
      <div className="flex-1">
        <div className="relative overflow-hidden">
          <div className="video-player" id="video-player" />
          <div
            className="bg-slate-700/50 top-0 left-0 w-full h-full absolute z-10"
          />
        </div>
        <div className="mt-4">
          <div className="music-bar mb-4" id="progress">
            <div
              id="length"
              style={{
                width: `${(currTime / duration) * 100}%`
              }}
            />
          </div>
          <div className="text-center text-sm mb-4">
            {displayDuration(currTime)} / {displayDuration(duration)}
          </div>
          <div className="w-full justify-center flex space-x-1">
            <button
              className="text-white px-2 py-1 rounded bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:text-slate-700"
              onClick={reset}
              disabled={state === 'stop'}
            >
              <IoMdRefresh />
            </button>
            <button
              className="text-white px-2 py-1 rounded bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:text-slate-700"
              onClick={play}
              disabled={state === 'play'}
            >
              <AiFillPlayCircle />
            </button>
            <button
              className="text-white px-2 py-1 rounded bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:text-slate-700"
              onClick={pause}
              disabled={state === 'pause'}
            >
              <AiFillPauseCircle />
            </button>
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
  const [filterText, setFilterText] = useState('')
  const songsFiltered = () => songs.filter(song => {
    const titleMatch = song.title.toLowerCase().includes(filterText.toLowerCase())
    const artistMatch = song.artist.toLowerCase().includes(filterText.toLowerCase())
    return titleMatch || artistMatch
  })
  return (
    <div className="flex-1 font-bold text-2xl flex flex-col space-y-2 relative overflow-hidden p-4 bg-slate-900">
      <div className="invisible">
        <div className="video-player" id="video-player" />
      </div>
      <div className="flex justify-between space-x-2 items-center">
        <input
          type="text"
          className="rounded-lg px-2 py-1 text-xs bg-slate-600"
          placeholder="Search Song..."
          onChange={(e) => setFilterText(e.target.value)}
        />
        <div className="rounded px-4 py-2 text-xs bg-blue-500">
          Remaining Song : {songCount + 2}
        </div>
      </div>
      <div className="flex-1 flex flex-col space-y-2 overflow-y-auto">
        {songsFiltered().map((song, index) => (
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
  const isMobile = () => window.innerWidth < 768
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
            width: isMobile() ? '100%' : '40rem',
            height: isMobile() ? '100%' : '40rem',
          }}
        >
          <div className="bg-slate-800">
            <div className="text-xl text-center">
              KARAOKE-CHAN
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-between p-6 bg-slate-700 overflow-hidden">
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
