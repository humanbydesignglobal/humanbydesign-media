// The real-wax seal for each type (same seals as the Instagram highlights):
// Manifestor = flame, Generator = sun, Manifesting Generator = lightning, Projector = north star, Reflector = crescent moon.
import React from 'react';
import { Image, type ImageStyle, type StyleProp } from 'react-native';
import type { TypeId } from '../engine/hd';

const SEALS: Record<TypeId | 'tree', number> = {
  Manifestor: require('../../assets/seals/manifestor.png'),
  Generator: require('../../assets/seals/generator.png'),
  'Manifesting Generator': require('../../assets/seals/mg.png'),
  Projector: require('../../assets/seals/projector.png'),
  Reflector: require('../../assets/seals/reflector.png'),
  tree: require('../../assets/seals/tree.png'),
};

export function TypeSeal({ type, size = 56, style }: { type: TypeId | 'tree'; size?: number; style?: StyleProp<ImageStyle> }) {
  return <Image source={SEALS[type]} style={[{ width: size, height: size, resizeMode: 'contain' }, style]} accessibilityIgnoresInvertColors />;
}
