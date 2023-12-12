import { asset } from '../asset';

export type ShellType = 'ap' | 'apcr' | 'he' | 'heat';

export interface BlitzkriegShellDefinition {
  id: number;
  name: string;
  speed: number;
  damage: { armor: number; devices: number };
  caliber: number;
  normalization: number;
  ricochet: number;
  type: ShellType;
}

export type BlitzkriegShellDefinitions = Record<
  number,
  BlitzkriegShellDefinition
>;

export const shellDefinitions = fetch(asset('definitions/shells.json'), {
  cache: 'no-cache',
}).then(
  async (response) => response.json() as Promise<BlitzkriegShellDefinitions>,
);
