import React, { useEffect } from 'react'
import clamp from 'lodash-es/clamp'
import { useSpring, animated } from 'react-spring/hooks'
import { useGesture } from 'react-with-gesture'
import { Text } from '../index'

import '../../App.css'
import './card.css'


const PullCard = ({ category, index, handlePick, setTempCategory, width }) => {
  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))
  const [touchControl, setTouchControl] = React.useState(0)
  
  const [yPos, setYPos] = React.useState(0)
  const [touch, setTouch] = React.useState(false)

  const bind = useGesture(({ down, delta, velocity, previous }) => {
    velocity = clamp(velocity, 1, 8)
    setYPos(previous[1])
    if (down) setTouch(true)
    if (!down) setTouch(false)
    set({ xy: down ? delta : [0, 0], config: { mass: velocity, tension: 500 * velocity, friction: 50 } })
  })

  const handleDrag = () => {
    if (yPos > 300 && touch) {
      // 드래그해서 그냥 움직이면 예비 보여줌
      setTempCategory(category)
      setTouchControl(1)

    } if ( !touch && touchControl === 1) {
      // 드롭하면 pick
      console.log('drop')
      handlePick();
      setTouchControl(0)
      setTempCategory(null)

    } else if ( yPos <= 300 ) {
      // 다시 리셋
      setTempCategory(null)
      setTouchControl(0)
    }    
  }

  useEffect(() => {
    // category 안 들어오면 작동 안함
    if (category !== undefined) handleDrag()
  }, [yPos, touch])


  return (
    <animated.div {...bind()}
      className="card"
      style={{ transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`) }}>
            <div className="card-content">
                <Text size={32} color="green">{category}</Text>
            </div>
    </animated.div>
  );
};


export default PullCard;