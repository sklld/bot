import { ProvisionDefinitions, TankDefinition } from '@blitzkit/core';
import { uniqueId } from 'lodash';
import { CompareMember } from '../../stores/compareEphemeral';
import { tankToDuelMember } from './tankToDuelMember';

export function tankToCompareMember(
  tank: TankDefinition,
  provisionDefinitions: ProvisionDefinitions,
) {
  return {
    ...tankToDuelMember(tank, provisionDefinitions),
    key: uniqueId(),
  } satisfies CompareMember;
}
