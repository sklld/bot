import {
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';

export type Period = 'today' | '30' | '60' | '90' | 'career' | 'custom';

export const PERIOD_NAMES: Record<Period, string> = {
  today: "Today's statistics",
  '30': "30 days' statistics",
  '60': "60 days' statistics",
  '90': "90 days' statistics",
  career: 'Career statistics',
  custom: 'Custom period',
};

export default function addPeriodSubCommands(
  option: SlashCommandSubcommandGroupBuilder,
  extra: (
    option: SlashCommandSubcommandBuilder,
  ) => SlashCommandSubcommandBuilder = (option) => option,
) {
  return option
    .addSubcommand((option) =>
      extra(option.setName('today').setDescription(PERIOD_NAMES.today)),
    )
    .addSubcommand((option) =>
      extra(option.setName('30').setDescription(PERIOD_NAMES['30'])),
    )
    .addSubcommand((option) =>
      extra(option.setName('60').setDescription(PERIOD_NAMES['60'])),
    )
    .addSubcommand((option) =>
      extra(option.setName('90').setDescription(PERIOD_NAMES['90'])),
    )
    .addSubcommand((option) =>
      extra(option.setName('career').setDescription(PERIOD_NAMES.career)),
    )
    .addSubcommand((option) =>
      extra(
        option
          .setName('custom')
          .setDescription(PERIOD_NAMES.custom)
          .addIntegerOption((option) =>
            option
              .setName('start')
              .setDescription('Start of period in days ago from today')
              .setMinValue(0)
              .setRequired(true),
          )
          .addIntegerOption((option) =>
            option
              .setName('end')
              .setDescription('End of period in days ago from today')
              .setMinValue(0)
              .setRequired(true),
          ),
      ),
    );
}
