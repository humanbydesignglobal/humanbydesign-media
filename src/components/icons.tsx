import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

type P = { color: string; size?: number };
const sw = 1.6;
export const IconToday = ({ color, size = 24 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={4.2} stroke={color} strokeWidth={sw} />
    <Path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" stroke={color} strokeWidth={sw} strokeLinecap="round" />
  </Svg>
);
export const IconChart = ({ color, size = 24 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2.5l3.2 4.3H8.8z M8.8 9h6.4L12 13.3z M9.6 14.6h4.8v4h-4.8z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
    <Path d="M12 18.6v2.9" stroke={color} strokeWidth={sw} strokeLinecap="round" />
  </Svg>
);
export const IconPeople = ({ color, size = 24 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={9} cy={12} r={5.5} stroke={color} strokeWidth={sw} />
    <Circle cx={15} cy={12} r={5.5} stroke={color} strokeWidth={sw} />
  </Svg>
);
export const IconMe = ({ color, size = 24 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 7h16M4 12h16M4 17h16" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    <Circle cx={9} cy={7} r={1.8} fill={color} />
    <Circle cx={15} cy={12} r={1.8} fill={color} />
    <Circle cx={8} cy={17} r={1.8} fill={color} />
  </Svg>
);
export const IconAsk = ({ color, size = 24 }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4.5 5.5h15v10h-8l-4.5 4v-4h-2.5z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
    <Path d="M10.2 8.8a1.9 1.9 0 1 1 2.6 1.8c-.5.2-.8.6-.8 1.1v.3" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    <Circle cx={12} cy={13.6} r={0.6} fill={color} />
  </Svg>
);
