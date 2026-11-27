// The bodygraph, drawn the same way as on humanbydesign.global.
import React, { useMemo } from 'react';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';
import DRAW from '../content/draw.json';
import { GATE_CENTRE, type Chart, type CentreId } from '../engine/hd';
import { C } from '../theme';

const GP = DRAW.GP as unknown as Record<string, [number, number]>;
const CTRL = DRAW.CTRL as unknown as Record<string, [number, number]>;
const CH = DRAW.CH as [number, number][];
const SHP = DRAW.SHP as Record<CentreId, string>;

const f = (n: number) => Math.round(n * 10) / 10;

export function Bodygraph({ chart, width = 300, highlight }: { chart: Chart; width?: number; highlight?: Set<string> }) {
  const parts = useMemo(() => {
    const A: Record<number, { p: boolean; d: boolean }> = {};
    chart.personality.forEach((a) => { (A[a.gate] = A[a.gate] || { p: false, d: false }).p = true; });
    chart.design.forEach((a) => { (A[a.gate] = A[a.gate] || { p: false, d: false }).d = true; });
    const base: React.ReactNode[] = [], inner: React.ReactNode[] = [], act: React.ReactNode[] = [];
    CH.forEach(([g1, g2]) => {
      const a = GP[g1], b = GP[g2], k = `${g1}-${g2}`;
      const q = CTRL[k] || [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const m1 = [(a[0] + q[0]) / 2, (a[1] + q[1]) / 2], m2 = [(q[0] + b[0]) / 2, (q[1] + b[1]) / 2];
      const mid = [(m1[0] + m2[0]) / 2, (m1[1] + m2[1]) / 2];
      const full = `M${a} Q${q} ${b}`;
      base.push(<Path key={`o${k}`} d={full} stroke={C.ink} strokeWidth={11} fill="none" />);
      inner.push(<Path key={`w${k}`} d={full} stroke={C.white} strokeWidth={8} fill="none" />);
      ([[g1, `M${a} Q${m1.map(f)} ${mid.map(f)}`], [g2, `M${b} Q${m2.map(f)} ${mid.map(f)}`]] as [number, string][]).forEach(([g, d], i) => {
        const x = A[g];
        if (!x) return;
        const hl = highlight?.has(k);
        if (x.d) act.push(<Path key={`d${k}${i}`} d={d} stroke={C.red} strokeWidth={8} fill="none" opacity={highlight && !hl ? 0.35 : 1} />);
        if (x.p) act.push(<Path key={`p${k}${i}`} d={d} stroke={C.ink} strokeWidth={x.d ? 3.5 : 8} fill="none" opacity={highlight && !hl ? 0.35 : 1} />);
      });
    });
    const centres = (Object.keys(SHP) as CentreId[]).map((k) => (
      <Path key={k} d={SHP[k]} fill={chart.defined[k] ? C.red : C.white} stroke={C.ink} strokeWidth={2.5} strokeLinejoin="round" />
    ));
    const gates = Object.keys(GP).map((gs) => {
      const g = +gs, p = GP[gs], x = A[g], def = chart.defined[GATE_CENTRE[g]];
      return (
        <G key={`g${g}`}>
          {x ? <Circle cx={p[0]} cy={p[1]} r={10.5} fill={C.ink} /> : def ? <Circle cx={p[0]} cy={p[1]} r={10.5} fill={C.white} /> : null}
          <SvgText x={p[0]} y={p[1] + 4} textAnchor="middle" fontSize={11} fontFamily={x ? 'Inter_500Medium' : 'Inter_400Regular'} fill={x ? C.white : C.ink}>
            {gs}
          </SvgText>
        </G>
      );
    });
    return { base, inner, act, centres, gates };
  }, [chart, highlight]);

  return (
    <Svg width={width} height={(width * 852) / 500} viewBox="0 0 500 852" accessibilityLabel="Bodygraph">
      {parts.base}
      {parts.inner}
      {parts.act}
      {parts.centres}
      {parts.gates}
    </Svg>
  );
}
