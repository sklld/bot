import type { TankopediaSortBy } from '.';

export const SORT_UNITS: Record<TankopediaSortBy, string | undefined> = {
  'meta.none': undefined,
  'survivability.health': 'hp',
  'fire.aimTime': 's',
  'fire.caliber': 'mm',
  'fire.damage': 'hp',
  'fire.dispersionMoving': 'm',
  'fire.dispersionStill': 'm',
  'fire.dpm': undefined,
  'fire.dpmPremium': undefined,
  'fire.gunDepression': '°',
  'fire.gunElevation': '°',
  'fire.premiumPenetration': 'mm',
  'fire.reload': 's',
  'fire.shellVelocity': 'm/s',
  'fire.shellRange': 'm',
  'fire.standardPenetration': 'mm',
  'maneuverability.backwardsSpeed': 'kph',
  'maneuverability.forwardsSpeed': 'kph',
  'maneuverability.power': 'hp',
  'maneuverability.powerToWeight': 'hp/tn',
  'maneuverability.traverseSpeed': '°/s',
  'maneuverability.weight': 'tn',
  'survivability.camouflageMoving': '%',
  'survivability.camouflageShooting': '%',
  'survivability.camouflageStill': '%',
  'survivability.length': 'm',
  'survivability.viewRange': 'm',
  'survivability.volume': 'm^3',
};
export const SORT_NAMES = {
  'meta.none': 'none',
  'survivability.health': 'health',
  'survivability.viewRange': 'view range',
  'survivability.camouflageStill': 'camouflage still',
  'survivability.camouflageMoving': 'camouflage moving',
  'survivability.camouflageShooting': 'camouflage shooting',
  'survivability.volume': 'volume',
  'survivability.length': 'length',
  'fire.dpm': 'standard DPM',
  'fire.dpmPremium': 'premium DPM',
  'fire.reload': 'reload',
  'fire.caliber': 'caliber',
  'fire.standardPenetration': 'standard penetration',
  'fire.premiumPenetration': 'premium penetration',
  'fire.damage': 'damage',
  'fire.shellVelocity': 'shell velocity',
  'fire.shellRange': 'shell range',
  'fire.aimTime': 'aim time',
  'fire.dispersionStill': 'dispersion still',
  'fire.dispersionMoving': 'dispersion moving',
  'fire.gunDepression': 'gun depression',
  'fire.gunElevation': 'gun elevation',
  'maneuverability.forwardsSpeed': 'forwards speed',
  'maneuverability.backwardsSpeed': 'backwards speed',
  'maneuverability.power': 'power',
  'maneuverability.powerToWeight': 'power to weight',
  'maneuverability.weight': 'weight',
  'maneuverability.traverseSpeed': 'traverse speed',
} as const;
export enum TankopediaDisplay {
  Model,
  DynamicArmor,
  StaticArmor,
}
