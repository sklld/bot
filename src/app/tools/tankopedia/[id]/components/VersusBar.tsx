import { CaretRightIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  Flex,
  Heading,
  Tabs,
  Text,
  TextField,
  Tooltip,
} from '@radix-ui/themes';
import { go } from 'fuzzysort';
import { debounce } from 'lodash';
import { use, useRef, useState } from 'react';
import { ModuleButtons } from '../../../../../components/ModuleButton';
import { asset } from '../../../../../core/blitzkrieg/asset';
import {
  tankDefinitions,
  tankNamesDiacritics,
} from '../../../../../core/blitzkrieg/tankDefinitions';
import mutateTankopedia, {
  useTankopedia,
} from '../../../../../stores/tankopedia';

export function VersusBar() {
  const awaitedTankDefinitions = use(tankDefinitions);
  const mode = useTankopedia((state) => state.mode);
  const awaitedTankNamesDiacritics = use(tankNamesDiacritics);
  const [versusTankTab, setVersusTankTab] = useState('search');
  const versusTankSearchInput = useRef<HTMLInputElement>(null);
  const antagonist = useTankopedia((state) => {
    // goofy ahh typescript discriminator hack
    if (!state.areTanksAssigned) return;
    return state.antagonist;
  });
  const [versusTankSearchResults, setVersusTankSearchResults] = useState<
    number[]
  >([]);

  if (!antagonist || mode !== 'armor') return null;

  return (
    <Card>
      <Flex align="center" justify="between" gap="2">
        <Flex align="center" gap="4">
          <Text>Versus</Text>

          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="ghost">
                {antagonist.tank.name}
                <CaretRightIcon />
              </Button>
            </Dialog.Trigger>

            <Dialog.Content>
              <Tabs.Root value={versusTankTab} onValueChange={setVersusTankTab}>
                <Flex gap="4" direction="column">
                  <Tabs.List>
                    <Tabs.Trigger value="search">Search</Tabs.Trigger>
                    <Tabs.Trigger value="configure">Configure</Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content value="search">
                    <Flex
                      direction="column"
                      gap="4"
                      style={{ flex: 1 }}
                      justify="center"
                    >
                      <TextField.Root>
                        <TextField.Slot>
                          <MagnifyingGlassIcon />
                        </TextField.Slot>
                        <TextField.Input
                          ref={versusTankSearchInput}
                          placeholder="Search tank..."
                          onChange={debounce(() => {
                            setVersusTankSearchResults(
                              go(
                                versusTankSearchInput.current!.value,
                                awaitedTankNamesDiacritics,
                                { key: 'combined', limit: 8 },
                              ).map((item) => item.obj.id),
                            );
                          }, 500)}
                        />
                      </TextField.Root>

                      <Flex direction="column" gap="2">
                        {(versusTankSearchResults.length > 0 ||
                          versusTankSearchInput.current?.value) && (
                          <Flex direction="column" gap="2">
                            {versusTankSearchResults.map((id) => (
                              <Button
                                key={id}
                                variant="ghost"
                                onClick={() => {
                                  const thisTank = awaitedTankDefinitions[id];

                                  mutateTankopedia((draft) => {
                                    if (!draft.areTanksAssigned) return;

                                    draft.antagonist.tank = thisTank;
                                    draft.antagonist.turret =
                                      thisTank.turrets.at(-1)!;
                                    draft.antagonist.gun =
                                      draft.antagonist.turret.guns.at(-1)!;
                                  });
                                  setVersusTankSearchResults([]);
                                  versusTankSearchInput.current!.value = '';
                                  setVersusTankTab('configure');
                                }}
                              >
                                {awaitedTankDefinitions[id].name}
                              </Button>
                            ))}

                            {versusTankSearchResults.length === 0 &&
                              (versusTankSearchInput.current
                                ? versusTankSearchInput.current.value.length > 0
                                : false) && (
                                <Button disabled variant="ghost">
                                  No search results
                                </Button>
                              )}
                          </Flex>
                        )}
                      </Flex>
                    </Flex>
                  </Tabs.Content>

                  <Tabs.Content value="configure">
                    <Flex direction="column" gap="4">
                      <Flex direction="column" gap="2" style={{ flex: 1 }}>
                        <Heading size="4">Configuration</Heading>

                        <Flex gap="2" wrap="wrap">
                          <Flex>
                            {antagonist.tank.turrets.map((turret, index) => (
                              <Tooltip content={turret.name} key={turret.id}>
                                <ModuleButtons
                                  key={turret.id}
                                  onClick={() => {
                                    mutateTankopedia((draft) => {
                                      if (!draft.areTanksAssigned) return;

                                      draft.antagonist.turret = turret;
                                      draft.antagonist.gun =
                                        turret.guns.at(-1)!;
                                    });
                                  }}
                                  selected={antagonist.turret.id === turret.id}
                                  tier={turret.tier}
                                  type="turret"
                                  style={{
                                    margin: -0.5,
                                    borderTopLeftRadius:
                                      index === 0 ? undefined : 0,
                                    borderBottomLeftRadius:
                                      index === 0 ? undefined : 0,
                                    borderTopRightRadius:
                                      index ===
                                      antagonist.tank.turrets.length - 1
                                        ? undefined
                                        : 0,
                                    borderBottomRightRadius:
                                      index ===
                                      antagonist.tank.turrets.length - 1
                                        ? undefined
                                        : 0,
                                  }}
                                />
                              </Tooltip>
                            ))}
                          </Flex>
                          <Flex>
                            {antagonist.turret.guns.map((gun, index) => (
                              <Tooltip content={gun.name} key={gun.id}>
                                <ModuleButtons
                                  onClick={() => {
                                    mutateTankopedia((draft) => {
                                      if (!draft.areTanksAssigned) return;
                                      draft.antagonist.gun = gun;
                                    });
                                  }}
                                  selected={antagonist.gun.id === gun.id}
                                  tier={gun.tier}
                                  type="gun"
                                  style={{
                                    margin: -0.5,
                                    borderTopLeftRadius:
                                      index === 0 ? undefined : 0,
                                    borderBottomLeftRadius:
                                      index === 0 ? undefined : 0,
                                    borderTopRightRadius:
                                      index ===
                                      antagonist.turret.guns.length - 1
                                        ? undefined
                                        : 0,
                                    borderBottomRightRadius:
                                      index ===
                                      antagonist.turret.guns.length - 1
                                        ? undefined
                                        : 0,
                                  }}
                                />
                              </Tooltip>
                            ))}
                          </Flex>
                        </Flex>
                      </Flex>

                      <Flex direction="column" gap="2" style={{ flex: 1 }}>
                        <Heading size="4">Properties</Heading>

                        <ul>
                          <li>Penetration</li>
                        </ul>
                      </Flex>
                    </Flex>
                  </Tabs.Content>
                </Flex>
              </Tabs.Root>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>

        <Flex gap="2" align="center">
          <Checkbox defaultChecked />
          <Text>Calibrated</Text>
        </Flex>

        <Flex gap="1">
          <Button variant="solid" radius="small">
            <img src={asset('icons/shells/ap.webp')} width={24} height={24} />
          </Button>
          <Button variant="soft" radius="small" color="gray">
            <img
              src={asset('icons/shells/hc_premium.webp')}
              width={24}
              height={24}
            />
          </Button>
          <Button variant="soft" radius="small" color="gray">
            <img src={asset('icons/shells/he.webp')} width={24} height={24} />
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
