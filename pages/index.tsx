import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'
import { useAccount } from 'wagmi'

import kaboom from "kaboom"
import { useEffect, useRef } from 'react'

import { PlayFab, PlayFabClient } from 'playfab-sdk'

PlayFab.settings.titleId = "A6603"
PlayFab.settings.developerSecretKey = process.env['PlayfabKey']

const Home: NextPage = () => {
  const pageDiv = {
    display: 'flex',
    flexDirection: 'column' as 'column',
    height: '100vh',
    minWidth: '100%',
    borderStyle: 'solid',
    padding: '0px'

  }
  const connectDiv = {
    display: 'flex',
    minWidth: "100%",
    width: '100%',
    height: '100px',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'fixed' as 'fixed',
    padding: '0 1rem'

  }
  const canvasDiv = {
    display: 'flex',
    height: '100%',
    width: '100%',
  }


  const { isConnected, address } = useAccount();

  const canvasRef = useRef(null!);

  useEffect(() => {
    const canvas = canvasRef.current
    const k = kaboom({
      global: false,
      canvas: canvas,
    })

    function addButton(txt: any, p: any, o: any, f: any) {
      const btn = k.add([
        k.text(txt),
        k.pos(p),
        k.area({ cursor: "pointer", scale: 3 }),
        k.scale(3),
        k.origin(o),
        k.color(),

      ])

      btn.font = 'sink'
      btn.color = k.rgb(0, 0, 0)

      btn.onClick(f)

      btn.onUpdate(() => {
        if (btn.isHovering()) {
          const t = k.time() * 10
          btn.color = k.rgb(
            k.wave(0, 255, t),
            k.wave(0, 255, t + 2),
            k.wave(0, 255, t + 4),
          )

        } else {
          btn.color = k.rgb(0, 0, 0)
        }
      })

    }

    function addPlayerToPlayFab() {
      if (isConnected) {
        var loginRequest = {
          TitleId: PlayFab.settings.titleId,
          CustomId: String(address),
          CreateAccount: true
        }
        PlayFabClient.LoginWithCustomID(loginRequest, LoginCallback);
        k.debug.log("Added Player to PlayFab!")
      }
    }
    var LoginCallback = function(result: any, error: any) {
      if (result !== null) {
        console.log(JSON.stringify(result));
      } else if (error !== null) {
        console.log(JSON.stringify(error));
      }
    }

    if (!isConnected) {
      k.add([
        k.pos(k.width() / 2, k.height() / 2 - 50),
        k.text('Welcome to the club!', { size: 24, width: 300, font: "sink", }),
        k.origin('center'),
      ])
      k.add([
        k.pos(k.width() / 2, k.height() / 2),
        k.text('Please Connect Your Wallet', { size: 24, width: 300, font: "sink", }),
        k.origin('center'),
        k.color(0, 0, 0)
      ])
    }

    if (isConnected) {
      addPlayerToPlayFab()

      addButton("Start", k.vec2(10, 150), 'left', () => k.debug.log("oh hi"))
      addButton("Check Connection", k.vec2(10, 200), 'left', () => k.debug.log(String(isConnected)))
      addButton("Check Address", k.vec2(10, 250), 'left', () => k.debug.log(String(address)))

      k.add([
        k.pos(10, 300),
        k.text(String(address), { size: 18, width: 200, font: "sink", }),
        k.color(0, 250, 150)
      ])
      // reset cursor to default at frame start for easier cursor management
      k.onUpdate(() => k.cursor("default"))
    }
  }) // add ,[] so it only runs once
  return (
    <div className={styles.container}>
      <Head>
        <title>💥 Kaboom + Rainbowkit 🌈 + Playfab 🎮</title>
        <meta name="description" content="Just a test..." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={pageDiv}>
        <div style={connectDiv}>
          💥🌈🎮 by COSMIC
          <ConnectButton />
        </div>
        <div style={canvasDiv}>
          <canvas ref={canvasRef} ></canvas>
        </div>
      </div>
    </div>
  )
}

export default Home