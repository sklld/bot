import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
  CacheType,
} from 'discord.js';
import { REGION_NAMES_SHORT } from '../../constants/regions';
import searchPlayersAcrossRegions from '../blitz/searchPlayersAcrossRegions';

export default async function autocompleteUsername(
  interaction: AutocompleteInteraction<CacheType>,
) {
  const focusedOption = interaction.options.getFocused(true);
  if (focusedOption.name !== 'username') return;
  const players = await searchPlayersAcrossRegions(focusedOption.value);

  try {
    await interaction.respond(
      players
        ? players.map(
            (player) =>
              ({
                name: `${player.nickname} (${
                  REGION_NAMES_SHORT[player.region]
                })`,
                value: `${player.region}/${player.account_id}`,
              }) satisfies ApplicationCommandOptionChoiceData<string>,
          )
        : [],
    );
  } catch (error) {}
}
