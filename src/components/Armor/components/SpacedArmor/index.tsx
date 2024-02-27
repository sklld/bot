import { MeshBasicMaterial, Object3D } from 'three';
import { ArmorType } from '../../../../app/tools/tankopedia/[id]/components/Model/components/TankArmor/components/Spaced';
import { resolveNearPenetration } from '../../../../core/blitz/resolveNearPenetration';
import { jsxTree } from '../../../../core/blitzkrieg/jsxTree';
import { useDuel } from '../../../../stores/duel';
import { SpacedArmorSubExternal } from './components/SpacedArmorSubExternal';
import { SpacedArmorSubSpaced } from './components/SpacedArmorSubSpaced';
// import fragmentShader from './shaders/fragment.glsl';
// import vertexShader from './shaders/vertex.glsl';

interface SpacedArmorProps {
  node: Object3D;
  ornamental?: boolean;
  type: ArmorType;
  thickness: number;
}

const omitMaterial = new MeshBasicMaterial({
  colorWrite: false,
  depthWrite: true,
});

export function SpacedArmor({ node, type, thickness }: SpacedArmorProps) {
  const penetrationRaw = useDuel(
    (state) => state.antagonist!.shell.penetration,
  );
  const penetration = resolveNearPenetration(penetrationRaw);

  /**
   * Render orders allocations:
   * - 0  : core omission
   * - 1-2: spaced without depth buffer write but do test to allow additive blending
   * - 3-4: external with depth buffer write in first pass and read in second to simplify geometry
   */

  return (
    <>
      {type === ArmorType.Core &&
        jsxTree(node, {
          renderOrder: 0,
          material: omitMaterial,
        })}

      {type === ArmorType.Spaced && (
        <SpacedArmorSubSpaced node={node} thickness={thickness} />
      )}

      {type === ArmorType.External && (
        <SpacedArmorSubExternal node={node} thickness={thickness} />
      )}
    </>
  );
}
