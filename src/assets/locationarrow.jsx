import React from 'react'
import Svg, { Path } from 'react-native-svg'

function LocationArrow() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="50.25"
      height="81.25"
      fill="none"
      x="0"
      y="0"
      enableBackground="new 0 0 201 325"
      viewBox="0 0 201 325"
    >
      <Path
        fill="#2B67ED"
        d="M19.131 227.237C9.493 183.804 100.635.904 98.635.927c0 0 90.765 172.338 85.832 224.478.565 51.008-36.091 97.652-81.747 98.158-45.656.506-83.024-45.318-83.589-96.326z"
      ></Path>
      <Path
        fill="#4381EF"
        stroke="#fff"
        strokeWidth="10"
        d="M196 222c0 53.642-42.826 97-95.5 97S5 275.642 5 222s42.826-97 95.5-97 95.5 43.358 95.5 97z"
      ></Path>
    </Svg>
  )
}

export default LocationArrow
