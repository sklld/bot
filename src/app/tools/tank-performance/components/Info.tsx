'use client';

import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Callout, Flex } from '@radix-ui/themes';
import { use } from 'react';
import { averageDefinitions } from '../../../../core/blitzkit/averageDefinitions';
import { discoveredIdsDefinitions } from '../../../../core/blitzkit/discoveredIdDefinitions';

export function Info() {
  const awaitedAverageDefinitions = use(averageDefinitions);
  const awaitedDiscoveredIdsDefinitions = use(discoveredIdsDefinitions);
  const ratio =
    awaitedDiscoveredIdsDefinitions.count /
    awaitedAverageDefinitions.scanned_players;

  return (
    <Flex justify="center">
      <Callout.Root style={{ width: 'fit-content' }}>
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          Based on{' '}
          {Math.round(
            ratio * awaitedAverageDefinitions.sampled_players,
          ).toLocaleString()}{' '}
          players with at least 5,000 career battles and 1 battle in the past
          120 days. {awaitedDiscoveredIdsDefinitions.count.toLocaleString()}{' '}
          scanned in total. Updated daily.
        </Callout.Text>
      </Callout.Root>
    </Flex>
  );
}
