import React from 'react'
import Svg, { Path, Defs, Text, Ellipse, Style } from 'react-native-svg'

function OrderMarker() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="37.35"
      height="59.55"
      x="0"
      y="0"
      enableBackground="new 0 0 260 410"
      fill="none"
      viewBox="0 0 260 410"
    >
      <Path
        fill="#2B67EC"
        stroke="#fff"
        strokeWidth="6"
        d="M248.369 119.5c0 67-126 277-123 277 0 0-133.266-213-125-277C.37 56.816 56.12 0 124.603 0s123.766 56.816 123.766 119.5z"
      ></Path>
      <Ellipse cx="125.5" cy="120" fill="#fff" rx="75" ry="75"></Ellipse>
      <Text
        x="124.5"
        y="154.5"
        fill="#000"
        fontFamily="Roboto"
        fontSize="100"
        textAnchor="middle"
      >
        22
      </Text>
    </Svg>
  )
}

export default OrderMarker
