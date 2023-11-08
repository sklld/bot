'use client';

import {
  CaretLeftIcon,
  CaretRightIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons';
import {
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
} from '@radix-ui/themes';
import { produce } from 'immer';
import { debounce, range } from 'lodash';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { create } from 'zustand';
import { BlitzkriegRatingsLeaderboardEntry } from '../../../../scripts/buildRatingsLeaderboard';
import * as Leaderboard from '../../../components/Leaderboard';
import PageWrapper from '../../../components/PageWrapper';
import { LEAGUES } from '../../../constants/leagues';
import { FIRST_ARCHIVED_RATINGS_SEASON } from '../../../constants/ratings';
import { REGIONS, REGION_NAMES, Region } from '../../../constants/regions';
import { WARGAMING_APPLICATION_ID } from '../../../constants/wargamingApplicationID';
import fetchBlitz from '../../../core/blitz/fetchBlitz';
import { getAccountInfo } from '../../../core/blitz/getAccountInfo';
import { getClanAccountInfo } from '../../../core/blitz/getClanAccountInfo';
import getRatingsInfo from '../../../core/blitz/getRatingsInfo';
import { getRatingsLeague } from '../../../core/blitz/getRatingsLeague';
import { getRatingsNeighbors } from '../../../core/blitz/getRatingsNeighbors';
import { AccountList } from '../../../core/blitz/searchPlayersAcrossRegions';
import { getArchivedLatestSeasonNumber } from '../../../core/blitzkrieg/getArchivedLatestSeasonNumber';
import getArchivedRatingsInfo from '../../../core/blitzkrieg/getArchivedRatingsInfo';
import { getArchivedRatingsLeaderboard } from '../../../core/blitzkrieg/getArchivedRatingsLeaderboard';
import { noArrows } from './page.css';

const ROWS_OPTIONS = [5, 10, 15, 25, 30];

type UsernameCache = Record<Region, Record<number, string | null>>;
type ClanCache = Record<Region, Record<number, string | undefined>>;

const useUsernameCache = create<UsernameCache>(() => ({
  asia: {},
  com: {},
  eu: {},
}));
const useClanCache = create<ClanCache>(() => ({
  asia: {},
  com: {},
  eu: {},
}));

export default function Page() {
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const usernameCache = useUsernameCache();
  const clanCache = useClanCache();
  const [region, setRegion] = useState<Region>('com');
  // null being the latest season
  const [season, setSeason] = useState<null | number>(null);
  const { data: ratingsInfo } = useSWR(
    `ratings-info-${region}-${season}`,
    () =>
      season === null
        ? getRatingsInfo(region)
        : getArchivedRatingsInfo(region, season),
  );
  const [jumpToLeague, setJumpToLeague] = useState(0);
  const { data: latestArchivedSeasonNumber } = useSWR<number>(
    getArchivedLatestSeasonNumber.name,
    getArchivedLatestSeasonNumber,
  );
  const [players, setPlayers] = useState<null | Record<
    number,
    BlitzkriegRatingsLeaderboardEntry
  >>(null);
  const [page, setPage] = useState(0);
  const [highlightedPlayerId, setHighlightedPlayerId] = useState<number | null>(
    null,
  );
  const positionInput = useRef<HTMLInputElement>(null);
  const scoreInput = useRef<HTMLInputElement>(null);
  const [searchResults, setSearchResults] = useState<AccountList | undefined>(
    undefined,
  );
  const handleSearchPlayerChange = debounce(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const trimmedSearch = event.target.value.trim();

      if (trimmedSearch) {
        const encodedSearch = encodeURIComponent(trimmedSearch);
        const accountList = await fetchBlitz<AccountList>(
          `https://api.wotblitz.${region}/wotb/account/list/?application_id=${WARGAMING_APPLICATION_ID}&search=${encodedSearch}&limit=100`,
        );

        setSearchResults(
          accountList.filter(
            (searchedPlayer) => players && searchedPlayer.account_id in players,
          ),
        );
      } else {
        setSearchResults(undefined);
      }
    },
    500,
  );

  useEffect(() => {
    // league caching
    if (season === null) {
      Promise.all(
        range(0, 4).map(async (league: number) => {
          const leaguePlayers = await getRatingsLeague(region, league);
          useUsernameCache.setState(
            produce((draft: UsernameCache) => {
              leaguePlayers.result.forEach((player) => {
                draft[region][player.spa_id] = player.nickname;
              });
            }),
          );
          useClanCache.setState(
            produce((draft: ClanCache) => {
              leaguePlayers.result.forEach((player) => {
                draft[region][player.spa_id] = player.clan_tag;
              });
            }),
          );

          return leaguePlayers.result.reduce<
            Record<number, BlitzkriegRatingsLeaderboardEntry>
          >(
            (accumulator, player) => ({
              ...accumulator,

              [player.number - 1]: {
                id: player.spa_id,
                score: player.score,
              } satisfies BlitzkriegRatingsLeaderboardEntry,
            }),
            {},
          );
        }),
      ).then((results) => {
        const newPlayers = results.reduce<
          Record<number, BlitzkriegRatingsLeaderboardEntry>
        >(
          (accumulator, result) => ({
            ...accumulator,
            ...result,
          }),
          {},
        );

        setPlayers(newPlayers);
      });
    } else {
      getArchivedRatingsLeaderboard(region, season).then((result) =>
        setPlayers({ ...result }),
      );
    }
  }, []);
  useEffect(() => {
    // TODO: caches twice on initial load
    if (!players || !ratingsInfo || ratingsInfo?.detail) return;

    if (season === null) {
      const middleIndex = Math.round(page * rowsPerPage + rowsPerPage / 2);

      if (!(middleIndex in players)) return;

      const middleId = players[middleIndex].id;

      getRatingsNeighbors(region, middleId, rowsPerPage * 3).then(
        ({ neighbors }) => {
          setPlayers(
            produce((draft) => {
              draft = draft ?? {};

              neighbors.forEach((neighbor) => {
                draft![neighbor.number - 1] = {
                  id: neighbor.spa_id,
                  score: neighbor.score,
                } satisfies BlitzkriegRatingsLeaderboardEntry;
              });
            }),
          );

          useUsernameCache.setState(
            produce((draft: UsernameCache) => {
              neighbors.forEach((neighbor) => {
                if (neighbor.nickname) {
                  draft[region][neighbor.spa_id] = neighbor.nickname;
                }
              });
            }),
          );

          useClanCache.setState(
            produce((draft: ClanCache) => {
              neighbors.forEach((neighbor) => {
                if (neighbor.clan_tag) {
                  draft[region][neighbor.spa_id] = neighbor.clan_tag;
                }
              });
            }),
          );
        },
      );
    } else {
      const ids = range(
        Math.max(0, (page - 1) * rowsPerPage),
        Math.min(ratingsInfo.count - 1, (page + 1) * rowsPerPage + rowsPerPage),
      )
        .map((index) => players![index].id)
        .filter((id) => !(id in usernameCache[region]));

      if (ids && ids.length > 0) {
        getAccountInfo(region, ids).then((data) => {
          data.map((player, index) => {
            useUsernameCache.setState(
              produce((draft: UsernameCache) => {
                if (player) {
                  draft[region][ids[index]] = player.nickname;
                } else {
                  draft[region][ids[index]] = null;
                }
              }),
            );
          });
        });

        getClanAccountInfo(region, ids, ['clan']).then((data) => {
          data.map((player, index) => {
            useClanCache.setState(
              produce((draft: ClanCache) => {
                if (player) {
                  draft[region][ids[index]] = player.clan?.tag;
                }
              }),
            );
          });
        });
      }
    }
  }, [page, players]);

  const handleJumpToPosition = () => {
    if (!players || !ratingsInfo || ratingsInfo?.detail) return;

    const rawPosition = positionInput.current!.valueAsNumber - 1;
    const position = Math.max(0, Math.min(rawPosition, ratingsInfo.count - 1));
    setPage(Math.floor(position / rowsPerPage));

    if (players) {
      setHighlightedPlayerId(players[position].id);
    }
  };
  const [jumpToPositionOpen, setJumpToPositionOpen] = useState(false);
  const handleJumpToScore = () => {
    if (!players || !ratingsInfo || ratingsInfo?.detail) return;

    let playerIndex = -1;

    for (let index = ratingsInfo.count - 1; index >= 0; index--) {
      if (players[index].score >= scoreInput.current!.valueAsNumber) {
        playerIndex = index;
        break;
      }
    }

    if (playerIndex === -1) return;

    setPage(Math.floor(playerIndex / rowsPerPage));

    if (players) {
      setHighlightedPlayerId(players[playerIndex].id);
    }
  };
  const [jumpToScoreOpen, setJumpToScoreOpen] = useState(false);
  const pages = Math.ceil(
    (ratingsInfo && ratingsInfo.detail === undefined ? ratingsInfo?.count : 1) /
      rowsPerPage,
  );

  useEffect(() => {
    setPage(0);
  }, [season, region]);
  useEffect(() => {
    if (season === null && rowsPerPage > 30) setRowsPerPage(25);
  }, [season]);

  function PageTurner() {
    const pageInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (pageInput.current) pageInput.current.value = `${page + 1}`;
    }, [page]);

    return (
      <Flex justify="center" wrap="wrap" gap="2">
        <Flex gap="2">
          <Button
            variant="soft"
            onClick={() => setPage((page) => Math.max(page - 1, 0))}
            disabled={page === 0}
          >
            <CaretLeftIcon />
          </Button>
          <TextField.Root className={noArrows}>
            <TextField.Slot>Page</TextField.Slot>
            <TextField.Input
              className={noArrows}
              type="number"
              ref={pageInput}
              style={{ width: 64, textAlign: 'center' }}
              onBlur={(event) => {
                setPage(
                  Math.max(
                    0,
                    Math.min(pages - 1, event.target.valueAsNumber - 1),
                  ),
                );
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  (event.target as HTMLInputElement).blur();
                }
              }}
            />
            <TextField.Slot>out of {pages}</TextField.Slot>
          </TextField.Root>
          <Button
            variant="soft"
            onClick={() => {
              setPage((page) => Math.min(page + 1, pages - 1));
            }}
            disabled={page === pages - 1}
          >
            <CaretRightIcon />
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <PageWrapper color="orange">
      <Flex gap="4" wrap="wrap" justify="center">
        <Flex gap="2" wrap="wrap" justify="center">
          <Select.Root
            defaultValue={region}
            onValueChange={(value) => setRegion(value as Region)}
          >
            <Select.Trigger style={{ flex: 1 }} />

            <Select.Content>
              {REGIONS.map((region) => (
                <Select.Item key={region} value={region}>
                  {REGION_NAMES[region]}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          <Select.Root
            value={`${season}`}
            onValueChange={(value) =>
              setSeason(value === 'null' ? null : parseInt(value))
            }
          >
            <Select.Trigger style={{ flex: 1 }} />

            <Select.Content>
              {ratingsInfo?.detail === undefined && (
                <Select.Item value="null">Current season</Select.Item>
              )}

              <Select.Group>
                <Select.Label>Archives</Select.Label>

                {latestArchivedSeasonNumber &&
                  range(
                    FIRST_ARCHIVED_RATINGS_SEASON,
                    latestArchivedSeasonNumber + 1,
                  )
                    .map((season) => (
                      <Select.Item key={season} value={`${season}`}>
                        Season {season}
                      </Select.Item>
                    ))
                    .reverse()}
              </Select.Group>
            </Select.Content>
          </Select.Root>

          <Select.Root
            onValueChange={(value) => setRowsPerPage(parseInt(value))}
            value={`${rowsPerPage}`}
          >
            <Select.Trigger />

            <Select.Content>
              {ROWS_OPTIONS.map((size) => (
                <Select.Item value={`${size}`} key={size}>
                  {size} per page
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>

        <Flex gap="3" justify="center" wrap="wrap" align="center">
          <Text>Jump to:</Text>
          <Dialog.Root open={jumpToScoreOpen} onOpenChange={setJumpToScoreOpen}>
            <Dialog.Trigger>
              <Button variant="ghost">Score</Button>
            </Dialog.Trigger>

            <Dialog.Content>
              <Flex gap="4" justify="center">
                <TextField.Input
                  ref={scoreInput}
                  onChange={handleSearchPlayerChange}
                  type="number"
                  placeholder="Type a score..."
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleJumpToScore();
                      setJumpToScoreOpen(false);
                    }
                  }}
                />

                <Flex gap="2">
                  <Dialog.Close>
                    <Button color="red">Cancel</Button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <Button onClick={handleJumpToScore}>Jump</Button>
                  </Dialog.Close>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
          <Dialog.Root
            open={jumpToPositionOpen}
            onOpenChange={setJumpToPositionOpen}
          >
            <Dialog.Trigger>
              <Button variant="ghost">Position</Button>
            </Dialog.Trigger>

            <Dialog.Content>
              <Flex gap="4" justify="center">
                <TextField.Input
                  ref={positionInput}
                  onChange={handleSearchPlayerChange}
                  type="number"
                  placeholder="Type a position..."
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleJumpToPosition();
                      setJumpToPositionOpen(false);
                    }
                  }}
                />

                <Flex gap="2">
                  <Dialog.Close>
                    <Button color="red">Cancel</Button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <Button onClick={handleJumpToPosition}>Jump</Button>
                  </Dialog.Close>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="ghost">League</Button>
            </Dialog.Trigger>

            <Dialog.Content>
              <Flex gap="2" justify="center">
                <Select.Root
                  value={`${jumpToLeague}`}
                  onValueChange={(value) => setJumpToLeague(parseInt(value))}
                >
                  <Select.Trigger />

                  <Select.Content>
                    {ratingsInfo?.detail === undefined &&
                      ratingsInfo?.leagues.map(({ index, title }) => (
                        <Select.Item key={index} value={`${index}`}>
                          {title}
                        </Select.Item>
                      ))}
                  </Select.Content>
                </Select.Root>

                <Flex gap="2">
                  <Dialog.Close>
                    <Button color="red">Cancel</Button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <Button
                      onClick={async () => {
                        if (season === null) {
                          // that's already done
                          const leaguePlayers = await getRatingsLeague(
                            region,
                            jumpToLeague,
                          );

                          useUsernameCache.setState(
                            produce((draft: UsernameCache) => {
                              leaguePlayers.result.forEach((player) => {
                                draft[region][player.spa_id] = player.nickname;
                              });
                            }),
                          );
                          useClanCache.setState(
                            produce((draft: ClanCache) => {
                              leaguePlayers.result.forEach((player) => {
                                draft[region][player.spa_id] = player.clan_tag;
                              });
                            }),
                          );

                          leaguePlayers.result.map(
                            (player) =>
                              ({
                                id: player.spa_id,
                                score: player.score,
                              }) satisfies BlitzkriegRatingsLeaderboardEntry,
                          );
                        } else {
                          if (!ratingsInfo || ratingsInfo.detail || !players)
                            return;

                          const minScore =
                            LEAGUES[jumpToLeague - 1]?.minScore ?? Infinity;
                          let firstPlayerIndex = -1;

                          for (
                            let index = 0;
                            index < ratingsInfo.count;
                            index++
                          ) {
                            if (players[index].score < minScore) {
                              firstPlayerIndex = index;
                              break;
                            }
                          }

                          if (firstPlayerIndex === -1) return;

                          setPage(Math.floor(firstPlayerIndex / rowsPerPage));
                          setHighlightedPlayerId(players[firstPlayerIndex].id);
                        }
                      }}
                    >
                      Jump
                    </Button>
                  </Dialog.Close>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="ghost">Player</Button>
            </Dialog.Trigger>

            <Dialog.Content>
              <Flex gap="4" direction="column">
                <TextField.Root>
                  <TextField.Slot>
                    <MagnifyingGlassIcon height="16" width="16" />
                  </TextField.Slot>

                  <TextField.Input
                    onChange={handleSearchPlayerChange}
                    placeholder="Search for player..."
                  />
                </TextField.Root>

                <Flex direction="column" gap="2">
                  {searchResults?.map((player) => (
                    <Dialog.Close>
                      <Button
                        key={player.account_id}
                        variant="ghost"
                        onClick={() => {
                          if (!ratingsInfo || ratingsInfo.detail) return;
                          let playerIndex = -1;

                          for (
                            let index = 0;
                            index < ratingsInfo.count;
                            index++
                          ) {
                            if (players![index].id === player.account_id) {
                              playerIndex = index;
                              break;
                            }
                          }

                          const playerPage = Math.floor(
                            playerIndex! / rowsPerPage,
                          );

                          setPage(playerPage);
                          setHighlightedPlayerId(player.account_id);
                        }}
                      >
                        {player.nickname}
                      </Button>
                    </Dialog.Close>
                  ))}

                  {searchResults?.length === 0 && (
                    <Button disabled variant="ghost">
                      No players found in leaderboard
                    </Button>
                  )}
                </Flex>

                <Flex gap="2">
                  <Dialog.Close>
                    <Button color="red">Cancel</Button>
                  </Dialog.Close>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      <PageTurner />

      <Leaderboard.Root>
        {players === null ? (
          <Leaderboard.Gap message="Loading players..." />
        ) : (
          range(
            page * rowsPerPage,
            Math.min(
              page * rowsPerPage + rowsPerPage,
              ratingsInfo?.detail ? 0 : (ratingsInfo?.count ?? 1) - 1,
            ),
          ).map((index) => (
            <Leaderboard.Item
              nickname={
                index in players!
                  ? usernameCache[region][players![index].id] === null
                    ? `Deleted player ${players![index].id}`
                    : usernameCache[region][players![index].id] ??
                      'Loading player...'
                  : `Loading player...`
              }
              position={index + 1}
              score={players![index]?.score ?? 0}
              clan={
                players![index]
                  ? clanCache[region][players![index].id]
                  : undefined
              }
              key={index}
              highlight={highlightedPlayerId === players![index]?.id}
            />
          ))
        )}
      </Leaderboard.Root>

      <PageTurner />
    </PageWrapper>
  );
}
