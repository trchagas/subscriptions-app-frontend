const MinToMinSec = (min) => {
  const res = { min: Math.floor(min), sec: Math.floor((min % 1) * 60) }
  return res
}

export default MinToMinSec
