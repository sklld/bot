import { SlashCommandBuilder } from 'discord.js';
import markdownEscape from 'markdown-escape';
import getWargamingResponse from '../core/blitz/getWargamingResponse';
import { PlayerHistoriesRaw } from '../core/blitzstars/getPlayerHistories';
import addClanChoices from '../core/discord/addClanChoices';
import autocompleteClan from '../core/discord/autocompleteClan';
import embedWarning from '../core/discord/embedWarning';
import resolveClanFromCommand from '../core/discord/resolveClanFromCommand';
import { secrets } from '../core/node/secrets';
import { CommandRegistry } from '../events/interactionCreate';
import { AccountAchievements } from '../types/accountAchievements';
import { AccountInfo } from '../types/accountInfo';
import { ClanInfo } from '../types/clanInfo';

const DEFAULT_THRESHOLD = 7;

export const clanEventCommand: CommandRegistry = {
  inProduction: true,
  inDevelopment: true,
  inPublic: true,

  command: new SlashCommandBuilder()
    .setName('clan-event')
    .setDescription('Lists all inactive players')
    .addStringOption(addClanChoices),

  async handler(interaction) {
    const { region, id } = await resolveClanFromCommand(interaction);
    const clan = (
      await getWargamingResponse<ClanInfo>(
        `https://api.wotblitz.${region}/wotb/clans/info/?application_id=${secrets.WARGAMING_APPLICATION_ID}&clan_id=${id}`,
      )
    )[id];
    const memberIds = clan.members_ids.join(',');
    const [players, achievements, previousJointVictories] = await Promise.all([
      getWargamingResponse<AccountInfo>(
        `https://api.wotblitz.${region}/wotb/account/info/?application_id=${secrets.WARGAMING_APPLICATION_ID}&account_id=${memberIds}`,
      ),
      getWargamingResponse<AccountAchievements>(
        `https://api.wotblitz.${region}/wotb/account/achievements/?application_id=${secrets.WARGAMING_APPLICATION_ID}&account_id=${memberIds}`,
      ),
      Promise.all(
        clan.members_ids.map((id) =>
          fetch(`https://www.blitzstars.com/api/playerstats/${id}`)
            .then((response) => response.json() as Promise<PlayerHistoriesRaw>)
            .then((data) => ({
              id,
              jointVictory: data[0]?.achievements.jointVictoryCount as
                | number
                | undefined,
            })),
        ),
      ).then((data) =>
        data.reduce<Record<number, number | undefined>>(
          (accumulator, value) => ({
            ...accumulator,
            [value.id]: value.jointVictory,
          }),
          {},
        ),
      ),
    ]);
    const jointVictories = clan.members_ids.map((id) => ({
      id,
      joinVictory:
        previousJointVictories[id] === undefined
          ? 0
          : achievements[id].max_series.jointVictory -
            previousJointVictories[id]!,
    }));

    return [
      `# ${clan.name} [${clan.tag}]'s platoon wins today: ${(
        jointVictories.reduce(
          (accumulator, { joinVictory }) => accumulator + joinVictory,
          0,
        ) / 2
      ).toFixed(0)}\n${jointVictories
        .sort((a, b) => b.joinVictory - a.joinVictory)
        .map(
          ({ id, joinVictory }) =>
            `- ${markdownEscape(players[id].nickname)}: ${joinVictory}`,
        )
        .join('\n')}`,

      embedWarning(
        'This is an approximation!',
        'Wargaming provides use with little to no information about platoons. Platooning with mixed clans may inflate the number and platooning in non-regular battles may deflate.',
      ),
    ];
  },

  autocomplete: autocompleteClan,
};
