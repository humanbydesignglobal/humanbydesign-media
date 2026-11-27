import React from 'react';
import { ChartBody, ChartHeader, GateList } from '../../components/ChartView';
import { FullReading } from '../../components/FullReading';
import { Screen } from '../../components/ui';
import { priceOf } from '../../billing/store';
import { useApp } from '../../state/AppState';

export default function MyChart() {
  const { me, chartOf, can } = useApp();
  if (!me) return null;
  const chart = chartOf(me);
  return (
    <Screen>
      <ChartHeader chart={chart} name={me.name} />
      <ChartBody chart={chart} />
      <FullReading chart={chart} unlocked={can.fullReading} ctaPrice={priceOf('my_chart')} />
      <GateList chart={chart} />
    </Screen>
  );
}
