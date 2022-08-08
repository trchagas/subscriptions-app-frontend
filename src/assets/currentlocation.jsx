import React from 'react'
import Svg, { Path, Circle, Text } from 'react-native-svg'

function CurrentLocation() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
    >
      <Circle fill="#888" cx="12" cy="12" r="4"></Circle>
      <Path
        fill="#888"
        d="M13 4.069V2h-2v2.069A8.01 8.01 0 004.069 11H2v2h2.069A8.008 8.008 0 0011 19.931V22h2v-2.069A8.007 8.007 0 0019.931 13H22v-2h-2.069A8.008 8.008 0 0013 4.069zM12 18c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z"
      ></Path>
    </Svg>
  )
}

export default CurrentLocation
