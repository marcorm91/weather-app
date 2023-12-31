import React from 'react'
import {  WiDaySunny, WiCloud, WiShowers, WiDayRain, WiNightAltStormShowers, WiDust, WiFog,
    WiNightClear, WiDayCloudyHigh, WiNightAltRain, WiDayHaze, WiStormShowers,
    WiDaySunnyOvercast, WiNightAltCloudyHigh, WiRain, WiSnow, WiNightFog,
    WiNightAltPartlyCloudy, WiNightAltCloudy, WiDaySnow, WiNightAltSnow,
    WiDayCloudy, WiDayShowers, WiNightAltShowers, WiDayStormShowers,
    WiCloudy } from "weather-icons-react"
  
export const skyIconMap = {
    "11":   (size, color) => <WiDaySunny size={size} color={color} />,
    "11n":  (size, color) => <WiNightClear size={size} color={color} />,
    "12":   (size, color) => <WiDaySunnyOvercast size={size} color={color} />,
    "12n":  (size, color) => <WiNightAltPartlyCloudy size={size} color={color} />,
    "13":   (size, color) => <WiDayCloudy size={size} color={color} />,
    "13n":  (size, color) => <WiNightAltCloudy size={size} color={color} />,
    "14":   (size, color) => <WiDayCloudy size={size} color={color} />,
    "14n":  (size, color) => <WiNightAltCloudy size={size} color={color} />,
    "15":   (size, color) => <WiCloudy size={size} color={color} />,
    "15n":   (size, color) => <WiCloudy size={size} color={color} />,
    "16":   (size, color) => <WiCloud size={size} color={color} />,
    "16n":   (size, color) => <WiCloud size={size} color={color} />,
    "17":   (size, color) => <WiDayCloudyHigh size={size} color={color} />,
    "17n":  (size, color) => <WiNightAltCloudyHigh size={size} color={color} />,
    "43":   (size, color) => <WiDayShowers size={size} color={color} />,
    "43n":  (size, color) => <WiNightAltShowers size={size} color={color} />,
    "44":   (size, color) => <WiDayShowers size={size} color={color} />,
    "44n":  (size, color) => <WiNightAltShowers size={size} color={color} />,
    "45":   (size, color) => <WiShowers size={size} color={color} />,
    "45n":   (size, color) => <WiShowers size={size} color={color} />,
    "46":   (size, color) => <WiShowers size={size} color={color} />,
    "46n":   (size, color) => <WiShowers size={size} color={color} />,
    "23":   (size, color) => <WiDayRain size={size} color={color} />,
    "23n":  (size, color) => <WiNightAltRain size={size} color={color} />,
    "24":   (size, color) => <WiDayRain size={size} color={color} />,
    "24n":  (size, color) => <WiNightAltRain size={size} color={color} />,
    "25":   (size, color) => <WiShowers size={size} color={color} />,
    "25n":   (size, color) => <WiShowers size={size} color={color} />,
    "26":   (size, color) => <WiRain size={size} color={color} />,
    "26n":   (size, color) => <WiRain size={size} color={color} />,
    "71":   (size, color) => <WiDaySnow size={size} color={color} />,
    "71n":  (size, color) => <WiNightAltSnow size={size} color={color} />,
    "72":   (size, color) => <WiDaySnow size={size} color={color} />,
    "72n":  (size, color) => <WiNightAltSnow size={size} color={color} />,
    "73":   (size, color) => <WiSnow size={size} color={color} />,
    "74":   (size, color) => <WiSnow size={size} color={color} />,
    "74n":   (size, color) => <WiSnow size={size} color={color} />,
    "33":   (size, color) => <WiDaySnow size={size} color={color} />,
    "33n":  (size, color) => <WiNightAltSnow size={size} color={color} />,
    "34":   (size, color) => <WiDaySnow size={size} color={color} />,
    "34n":  (size, color) => <WiNightAltSnow size={size} color={color} />,
    "35":   (size, color) => <WiSnow size={size} color={color} />,
    "35n":   (size, color) => <WiSnow size={size} color={color} />,
    "36":   (size, color) => <WiSnow size={size} color={color} />,
    "36n":   (size, color) => <WiSnow size={size} color={color} />,
    "51":   (size, color) => <WiDayStormShowers size={size} color={color} />,
    "51n":  (size, color) => <WiNightAltStormShowers size={size} color={color} />,
    "52":   (size, color) => <WiDayStormShowers size={size} color={color} />,
    "52n":  (size, color) => <WiNightAltStormShowers size={size} color={color} />,
    "53":   (size, color) => <WiStormShowers size={size} color={color} />,
    "53n":   (size, color) => <WiStormShowers size={size} color={color} />,
    "54":   (size, color) => <WiStormShowers size={size} color={color} />,
    "54n":   (size, color) => <WiStormShowers size={size} color={color} />,
    "61":   (size, color) => <WiDayStormShowers size={size} color={color} />,
    "61n":  (size, color) => <WiNightAltStormShowers size={size} color={color} />,
    "62":   (size, color) => <WiDayStormShowers size={size} color={color} />,
    "62n":  (size, color) => <WiNightAltStormShowers size={size} color={color} />,
    "63":   (size, color) => <WiStormShowers size={size} color={color} />,
    "63n":   (size, color) => <WiStormShowers size={size} color={color} />,
    "64":   (size, color) => <WiStormShowers size={size} color={color} />,
    "64n":   (size, color) => <WiStormShowers size={size} color={color} />,
    "81":   (size, color) => <WiFog size={size} color={color} />,
    "81n":   (size, color) => <WiNightFog size={size} color={color} />,
    "82":   (size, color) => <WiDayHaze size={size} color={color} />,
    "82n":   (size, color) => <WiNightFog size={size} color={color} />,
    "83":   (size, color) => <WiDust size={size} color={color} />,
};