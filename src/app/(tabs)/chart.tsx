import React, { useState } from 'react';
import { priceOf } from '../../billing/store';
import { ChartBody, ChartHeader, GateList } from '../../components/ChartView';
import { FullReading } from '../../components/FullReading';
import { LifeTheme, Segmented, WorkBest, useChartTabs, type ChartTab } from '../../components/Purpose';
import { Screen } from '../../components/ui';
import { useApp } from '../../state/AppState';

export default function MyChart() {
  const { me, chartOf, can } = useApp();
  const tabs = useChartTabs();
  const [tab, setTab] = useState<ChartTab>('design');
  if (!me) return null;
  const chart = chartOf(me);
  return (
    <Screen>
      <ChartHeader chart={chart} name={me.name} />
      <Segmented value={tab} options={tabs} onChange={setTab} />
      {tab === 'design' ? (
        <>
          <ChartBody chart={chart} />
          <FullReading chart={chart} unlocked={can.fullReading} ctaPrice={priceOf('my_chart')} />
          <GateList chart={chart} />
        </>
      ) : tab === 'theme' ? (
        <LifeTheme chart={chart} />
      ) : (
        <WorkBest chart={chart} />
      )}
    </Screen>
  );
}
