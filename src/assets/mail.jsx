import React from 'react'
import Svg, { Path, G } from 'react-native-svg'

function Mail() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      enableBackground="new 0 0 400 400"
      version="1.1"
      viewBox="0 0 400 400"
      xmlSpace="preserve"
      width="20"
      height="20"
    >
      <G>
        <Path fill="#888" d="M0 127.5L0 274.219 104.8 206.1z"></Path>
        <Path fill="#888" d="M400 274.219L400 127.5 295.2 206.1z"></Path>
        <Path
          fill="#888"
          d="M200 277.5L130.357 225.268 0 310 0 340 400 340 400 310 269.643 225.268z"
        ></Path>
        <Path fill="#888" d="M0 90L200 240 400 90 400 60 0 60z"></Path>
      </G>
    </Svg>
  )
}

export default Mail
