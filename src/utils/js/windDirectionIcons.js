import React from 'react'
import {  WiDirectionUp } from "weather-icons-react"
  
export const windDirectionIconMap = {
    "S":   (size, color) => <WiDirectionUp size={size} color={color} />,
    "SO":  (size, color) => <WiDirectionUp size={size} color={color} style={{transform: 'rotate(45deg)'}} />,
    "SE":   (size, color) => <WiDirectionUp size={size} color={color} style={{transform: 'rotate(315deg)'}} />,
    "N":  (size, color) => <WiDirectionUp size={size} color={color} style={{transform: 'rotate(180deg)'}} />,
    "NE":   (size, color) => <WiDirectionUp size={size} color={color} style={{transform: 'rotate(225deg)'}} />,
    "NO":  (size, color) => <WiDirectionUp size={size} color={color} style={{transform: 'rotate(135deg)'}} />,
    "E":   (size, color) => <WiDirectionUp size={size} color={color} style={{transform: 'rotate(270deg)'}} />,
    "O":  (size, color) => <WiDirectionUp size={size} color={color} style={{transform: 'rotate(90deg)'}} />,
    "C":  () => null
}