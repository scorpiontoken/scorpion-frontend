import { useContext } from 'react'
import { Context } from '../contexts/ScorpionProvider'

const useScorpion = () => {
  const { scorpion } = useContext(Context)
  return scorpion
}

export default useScorpion
