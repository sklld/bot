import { Flex, Select, Text } from '@radix-ui/themes';
import {
  PlayerCountPeriod,
  TankPerformanceEphemeral,
} from '../../stores/tankPerformanceEphemeral';

export function PlayerCountControl() {
  const playerCountPeriod = TankPerformanceEphemeral.use(
    (state) => state.playerCountPeriod,
  );
  const mutateTankPerformanceSort = TankPerformanceEphemeral.useMutation();

  return (
    <Flex justify="center" align="center" gap="2">
      <Text>Player count</Text>
      <Select.Root
        value={playerCountPeriod}
        onValueChange={(period) => {
          mutateTankPerformanceSort((draft) => {
            draft.playerCountPeriod = period as PlayerCountPeriod;
          });
        }}
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Item value={PlayerCountPeriod.Past120Days}>
            Past 120 days
          </Select.Item>
          <Select.Item value={PlayerCountPeriod.Past90Days}>
            Past 90 days
          </Select.Item>
          <Select.Item value={PlayerCountPeriod.Past60Days}>
            Past 60 days
          </Select.Item>
          <Select.Item value={PlayerCountPeriod.ThisMonth}>
            This month
          </Select.Item>
          <Select.Item value={PlayerCountPeriod.ThisWeek}>
            This week
          </Select.Item>
          <Select.Item value={PlayerCountPeriod.Yesterday}>
            Yesterday
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
}
