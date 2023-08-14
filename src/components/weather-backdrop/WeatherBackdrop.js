import React from 'react'
import { WeatherBackdropStyled } from './WeatherBackdropStyled'
import { motion } from 'framer-motion'

const backdropVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 }
}

const WeatherBackdrop = ({ isOpen, onClick }) => (
    <WeatherBackdropStyled onClick={onClick}>
        <motion.div 
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={backdropVariants}
        />
    </WeatherBackdropStyled>
)

export default WeatherBackdrop
