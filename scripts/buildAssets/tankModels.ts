import { NodeIO } from '@gltf-transform/core';
import { readdir } from 'fs/promises';
import { Vector3Tuple } from 'three';
import { extractModel } from '../../src/core/blitz/extractModel';
import { readXMLDVPL } from '../../src/core/blitz/readXMLDVPL';
import { readYAMLDVPL } from '../../src/core/blitz/readYAMLDVPL';
import { toUniqueId } from '../../src/core/blitz/toUniqueId';
// import { AssetCommit } from '../../src/core/github/assetCommit';
import { commitAssets } from '../../src/core/blitzkrieg/commitAssets';
import { FileChange } from '../../src/core/blitzkrieg/commitMultipleFiles';
import { DATA, POI } from './constants';
import { VehicleDefinitionList } from './definitions';
import { TankParameters } from './tankIcons';

interface VehicleCustomization {
  armorColor: string;
}

export async function tankModels(production: boolean) {
  console.log('Building tank models...');

  const nodeIO = new NodeIO();
  const nations = await readdir(`${DATA}/${POI.vehicleDefinitions}`).then(
    (nations) => nations.filter((nation) => nation !== 'common'),
  );

  for (const nationIndex in nations) {
    const nation = nations[nationIndex];
    const changes: FileChange[] = [];
    // const assetCommit = new AssetCommit(`tank models ${nation}`, production);
    const tanks = await readXMLDVPL<{ root: VehicleDefinitionList }>(
      `${DATA}/${POI.vehicleDefinitions}/${nation}/list.xml.dvpl`,
    );
    const customization = await readXMLDVPL<{ root: VehicleCustomization }>(
      `${DATA}/${POI.vehicleDefinitions}/${nation}/customization.xml.dvpl`,
    );
    const baseColor = customization.root.armorColor
      .split(' ')
      .slice(0, 3)
      .map(Number)
      .map((channel) => channel / 255) as Vector3Tuple;

    console.log(`Building models for ${nation}`);

    await Promise.all(
      Object.entries(tanks.root).map(async ([tankKey, tank]) => {
        if (tankKey.includes('tutorial_bot')) return;

        const id = toUniqueId(nation, tank.id);

        console.log(`Building model ${id} @ ${nation}/${tankKey}`);

        const parameters = await readYAMLDVPL<TankParameters>(
          `${DATA}/${POI.tankParameters}/${nation}/${tankKey}.yaml.dvpl`,
        );
        const model = await extractModel(
          DATA,
          parameters.resourcesPath.blitzModelPath.replace(/\.sc2$/, ''),
          baseColor,
        );

        // writeFile(`test.${tankKey}.glb`, await nodeIO.writeBinary(model));

        changes.push({
          path: `3d/tanks/models/${id}.glb`,
          content: Buffer.from(await nodeIO.writeBinary(model)).toString(
            'base64',
          ),
          encoding: 'base64',
        });
      }),
    );

    // assetCommit.push();
    await commitAssets(`tank models ${nation}`, changes, production);
  }
}
