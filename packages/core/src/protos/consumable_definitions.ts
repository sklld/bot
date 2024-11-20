// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.2
//   protoc               v5.28.2
// source: packages/core/src/protos/consumable_definitions.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "blitzkit";

export enum ConsumableTankCategoryFilterCategory {
  CLIP = 0,
}

export function consumableTankCategoryFilterCategoryFromJSON(object: any): ConsumableTankCategoryFilterCategory {
  switch (object) {
    case 0:
    case "CONSUMABLE_TANK_CATEGORY_FILTER_CATEGORY_CLIP":
      return ConsumableTankCategoryFilterCategory.CLIP;
    default:
      throw new globalThis.Error(
        "Unrecognized enum value " + object + " for enum ConsumableTankCategoryFilterCategory",
      );
  }
}

export function consumableTankCategoryFilterCategoryToJSON(object: ConsumableTankCategoryFilterCategory): string {
  switch (object) {
    case ConsumableTankCategoryFilterCategory.CLIP:
      return "CONSUMABLE_TANK_CATEGORY_FILTER_CATEGORY_CLIP";
    default:
      throw new globalThis.Error(
        "Unrecognized enum value " + object + " for enum ConsumableTankCategoryFilterCategory",
      );
  }
}

export interface ConsumableDefinitions {
  consumables: { [key: number]: Consumable };
}

export interface ConsumableDefinitions_ConsumablesEntry {
  key: number;
  value: Consumable | undefined;
}

export interface Consumable {
  id: number;
  name: string;
  cooldown: number;
  duration?: number | undefined;
  game_mode_exclusive: boolean;
  include: ConsumableTankFilter[];
  exclude: ConsumableTankFilter[];
}

export interface ConsumableTankFilter {
  filter_type?:
    | { $case: "tiers"; value: ConsumableTankTierFilter }
    | { $case: "ids"; value: ConsumableTankIdsFilter }
    | { $case: "categories"; value: ConsumableTankCategoryFilter }
    | { $case: "nations"; value: ConsumableTankNationFilter }
    | undefined;
}

export interface ConsumableTankTierFilter {
  min: number;
  max: number;
}

export interface ConsumableTankIdsFilter {
  ids: number[];
}

export interface ConsumableTankCategoryFilter {
  categories: ConsumableTankCategoryFilterCategory[];
}

export interface ConsumableTankNationFilter {
  nations: string[];
}

function createBaseConsumableDefinitions(): ConsumableDefinitions {
  return { consumables: {} };
}

export const ConsumableDefinitions: MessageFns<ConsumableDefinitions> = {
  encode(message: ConsumableDefinitions, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    Object.entries(message.consumables).forEach(([key, value]) => {
      ConsumableDefinitions_ConsumablesEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).join();
    });
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ConsumableDefinitions {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsumableDefinitions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          const entry1 = ConsumableDefinitions_ConsumablesEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.consumables[entry1.key] = entry1.value;
          }
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConsumableDefinitions {
    return {
      consumables: isObject(object.consumables)
        ? Object.entries(object.consumables).reduce<{ [key: number]: Consumable }>((acc, [key, value]) => {
          acc[globalThis.Number(key)] = Consumable.fromJSON(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: ConsumableDefinitions): unknown {
    const obj: any = {};
    if (message.consumables) {
      const entries = Object.entries(message.consumables);
      if (entries.length > 0) {
        obj.consumables = {};
        entries.forEach(([k, v]) => {
          obj.consumables[k] = Consumable.toJSON(v);
        });
      }
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConsumableDefinitions>, I>>(base?: I): ConsumableDefinitions {
    return ConsumableDefinitions.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConsumableDefinitions>, I>>(object: I): ConsumableDefinitions {
    const message = createBaseConsumableDefinitions();
    message.consumables = Object.entries(object.consumables ?? {}).reduce<{ [key: number]: Consumable }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[globalThis.Number(key)] = Consumable.fromPartial(value);
        }
        return acc;
      },
      {},
    );
    return message;
  },
};

function createBaseConsumableDefinitions_ConsumablesEntry(): ConsumableDefinitions_ConsumablesEntry {
  return { key: 0, value: createBaseConsumable() };
}

export const ConsumableDefinitions_ConsumablesEntry: MessageFns<ConsumableDefinitions_ConsumablesEntry> = {
  encode(message: ConsumableDefinitions_ConsumablesEntry, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.key !== undefined) {
      writer.uint32(8).uint32(message.key);
    }
    if (message.value !== undefined) {
      Consumable.encode(message.value, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ConsumableDefinitions_ConsumablesEntry {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsumableDefinitions_ConsumablesEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.key = reader.uint32();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.value = Consumable.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConsumableDefinitions_ConsumablesEntry {
    return {
      key: globalThis.Number(assertSet("ConsumableDefinitions_ConsumablesEntry.key", object.key)),
      value: Consumable.fromJSON(assertSet("ConsumableDefinitions_ConsumablesEntry.value", object.value)),
    };
  },

  toJSON(message: ConsumableDefinitions_ConsumablesEntry): unknown {
    const obj: any = {};
    if (message.key !== undefined) {
      obj.key = Math.round(message.key);
    }
    if (message.value !== undefined) {
      obj.value = Consumable.toJSON(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConsumableDefinitions_ConsumablesEntry>, I>>(
    base?: I,
  ): ConsumableDefinitions_ConsumablesEntry {
    return ConsumableDefinitions_ConsumablesEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConsumableDefinitions_ConsumablesEntry>, I>>(
    object: I,
  ): ConsumableDefinitions_ConsumablesEntry {
    const message = createBaseConsumableDefinitions_ConsumablesEntry();
    message.key = object.key ?? 0;
    message.value = (object.value !== undefined && object.value !== null)
      ? Consumable.fromPartial(object.value)
      : createBaseConsumable();
    return message;
  },
};

function createBaseConsumable(): Consumable {
  return { id: 0, name: "", cooldown: 0, duration: undefined, game_mode_exclusive: false, include: [], exclude: [] };
}

export const Consumable: MessageFns<Consumable> = {
  encode(message: Consumable, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== 0) {
      writer.uint32(8).uint32(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.cooldown !== 0) {
      writer.uint32(24).uint32(message.cooldown);
    }
    if (message.duration !== undefined && message.duration !== undefined) {
      writer.uint32(37).float(message.duration);
    }
    if (message.game_mode_exclusive !== false) {
      writer.uint32(40).bool(message.game_mode_exclusive);
    }
    for (const v of message.include) {
      ConsumableTankFilter.encode(v!, writer.uint32(50).fork()).join();
    }
    for (const v of message.exclude) {
      ConsumableTankFilter.encode(v!, writer.uint32(58).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Consumable {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsumable();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.id = reader.uint32();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.cooldown = reader.uint32();
          continue;
        }
        case 4: {
          if (tag !== 37) {
            break;
          }

          message.duration = reader.float();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.game_mode_exclusive = reader.bool();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.include.push(ConsumableTankFilter.decode(reader, reader.uint32()));
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }

          message.exclude.push(ConsumableTankFilter.decode(reader, reader.uint32()));
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Consumable {
    return {
      id: globalThis.Number(assertSet("Consumable.id", object.id)),
      name: globalThis.String(assertSet("Consumable.name", object.name)),
      cooldown: globalThis.Number(assertSet("Consumable.cooldown", object.cooldown)),
      duration: isSet(object.duration) ? globalThis.Number(object.duration) : undefined,
      game_mode_exclusive: globalThis.Boolean(assertSet("Consumable.game_mode_exclusive", object.game_mode_exclusive)),
      include: globalThis.Array.isArray(object?.include)
        ? object.include.map((e: any) => ConsumableTankFilter.fromJSON(e))
        : [],
      exclude: globalThis.Array.isArray(object?.exclude)
        ? object.exclude.map((e: any) => ConsumableTankFilter.fromJSON(e))
        : [],
    };
  },

  toJSON(message: Consumable): unknown {
    const obj: any = {};
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.cooldown !== 0) {
      obj.cooldown = Math.round(message.cooldown);
    }
    if (message.duration !== undefined && message.duration !== undefined) {
      obj.duration = message.duration;
    }
    if (message.game_mode_exclusive !== false) {
      obj.game_mode_exclusive = message.game_mode_exclusive;
    }
    if (message.include?.length) {
      obj.include = message.include.map((e) => ConsumableTankFilter.toJSON(e));
    }
    if (message.exclude?.length) {
      obj.exclude = message.exclude.map((e) => ConsumableTankFilter.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Consumable>, I>>(base?: I): Consumable {
    return Consumable.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Consumable>, I>>(object: I): Consumable {
    const message = createBaseConsumable();
    message.id = object.id ?? 0;
    message.name = object.name ?? "";
    message.cooldown = object.cooldown ?? 0;
    message.duration = object.duration ?? undefined;
    message.game_mode_exclusive = object.game_mode_exclusive ?? false;
    message.include = object.include?.map((e) => ConsumableTankFilter.fromPartial(e)) || [];
    message.exclude = object.exclude?.map((e) => ConsumableTankFilter.fromPartial(e)) || [];
    return message;
  },
};

function createBaseConsumableTankFilter(): ConsumableTankFilter {
  return { filter_type: undefined };
}

export const ConsumableTankFilter: MessageFns<ConsumableTankFilter> = {
  encode(message: ConsumableTankFilter, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    switch (message.filter_type?.$case) {
      case "tiers":
        ConsumableTankTierFilter.encode(message.filter_type.value, writer.uint32(10).fork()).join();
        break;
      case "ids":
        ConsumableTankIdsFilter.encode(message.filter_type.value, writer.uint32(18).fork()).join();
        break;
      case "categories":
        ConsumableTankCategoryFilter.encode(message.filter_type.value, writer.uint32(26).fork()).join();
        break;
      case "nations":
        ConsumableTankNationFilter.encode(message.filter_type.value, writer.uint32(34).fork()).join();
        break;
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ConsumableTankFilter {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsumableTankFilter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.filter_type = { $case: "tiers", value: ConsumableTankTierFilter.decode(reader, reader.uint32()) };
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.filter_type = { $case: "ids", value: ConsumableTankIdsFilter.decode(reader, reader.uint32()) };
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.filter_type = {
            $case: "categories",
            value: ConsumableTankCategoryFilter.decode(reader, reader.uint32()),
          };
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.filter_type = { $case: "nations", value: ConsumableTankNationFilter.decode(reader, reader.uint32()) };
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConsumableTankFilter {
    return {
      filter_type: isSet(object.tiers)
        ? { $case: "tiers", value: ConsumableTankTierFilter.fromJSON(object.tiers) }
        : isSet(object.ids)
        ? { $case: "ids", value: ConsumableTankIdsFilter.fromJSON(object.ids) }
        : isSet(object.categories)
        ? { $case: "categories", value: ConsumableTankCategoryFilter.fromJSON(object.categories) }
        : isSet(object.nations)
        ? { $case: "nations", value: ConsumableTankNationFilter.fromJSON(object.nations) }
        : undefined,
    };
  },

  toJSON(message: ConsumableTankFilter): unknown {
    const obj: any = {};
    if (message.filter_type?.$case === "tiers") {
      obj.tiers = ConsumableTankTierFilter.toJSON(message.filter_type.value);
    }
    if (message.filter_type?.$case === "ids") {
      obj.ids = ConsumableTankIdsFilter.toJSON(message.filter_type.value);
    }
    if (message.filter_type?.$case === "categories") {
      obj.categories = ConsumableTankCategoryFilter.toJSON(message.filter_type.value);
    }
    if (message.filter_type?.$case === "nations") {
      obj.nations = ConsumableTankNationFilter.toJSON(message.filter_type.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConsumableTankFilter>, I>>(base?: I): ConsumableTankFilter {
    return ConsumableTankFilter.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConsumableTankFilter>, I>>(object: I): ConsumableTankFilter {
    const message = createBaseConsumableTankFilter();
    if (
      object.filter_type?.$case === "tiers" &&
      object.filter_type?.value !== undefined &&
      object.filter_type?.value !== null
    ) {
      message.filter_type = { $case: "tiers", value: ConsumableTankTierFilter.fromPartial(object.filter_type.value) };
    }
    if (
      object.filter_type?.$case === "ids" &&
      object.filter_type?.value !== undefined &&
      object.filter_type?.value !== null
    ) {
      message.filter_type = { $case: "ids", value: ConsumableTankIdsFilter.fromPartial(object.filter_type.value) };
    }
    if (
      object.filter_type?.$case === "categories" &&
      object.filter_type?.value !== undefined &&
      object.filter_type?.value !== null
    ) {
      message.filter_type = {
        $case: "categories",
        value: ConsumableTankCategoryFilter.fromPartial(object.filter_type.value),
      };
    }
    if (
      object.filter_type?.$case === "nations" &&
      object.filter_type?.value !== undefined &&
      object.filter_type?.value !== null
    ) {
      message.filter_type = {
        $case: "nations",
        value: ConsumableTankNationFilter.fromPartial(object.filter_type.value),
      };
    }
    return message;
  },
};

function createBaseConsumableTankTierFilter(): ConsumableTankTierFilter {
  return { min: 0, max: 0 };
}

export const ConsumableTankTierFilter: MessageFns<ConsumableTankTierFilter> = {
  encode(message: ConsumableTankTierFilter, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.min !== 0) {
      writer.uint32(8).uint32(message.min);
    }
    if (message.max !== 0) {
      writer.uint32(16).uint32(message.max);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ConsumableTankTierFilter {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsumableTankTierFilter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.min = reader.uint32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.max = reader.uint32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConsumableTankTierFilter {
    return {
      min: globalThis.Number(assertSet("ConsumableTankTierFilter.min", object.min)),
      max: globalThis.Number(assertSet("ConsumableTankTierFilter.max", object.max)),
    };
  },

  toJSON(message: ConsumableTankTierFilter): unknown {
    const obj: any = {};
    if (message.min !== 0) {
      obj.min = Math.round(message.min);
    }
    if (message.max !== 0) {
      obj.max = Math.round(message.max);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConsumableTankTierFilter>, I>>(base?: I): ConsumableTankTierFilter {
    return ConsumableTankTierFilter.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConsumableTankTierFilter>, I>>(object: I): ConsumableTankTierFilter {
    const message = createBaseConsumableTankTierFilter();
    message.min = object.min ?? 0;
    message.max = object.max ?? 0;
    return message;
  },
};

function createBaseConsumableTankIdsFilter(): ConsumableTankIdsFilter {
  return { ids: [] };
}

export const ConsumableTankIdsFilter: MessageFns<ConsumableTankIdsFilter> = {
  encode(message: ConsumableTankIdsFilter, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.ids) {
      writer.uint32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ConsumableTankIdsFilter {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsumableTankIdsFilter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag === 8) {
            message.ids.push(reader.uint32());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.ids.push(reader.uint32());
            }

            continue;
          }

          break;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConsumableTankIdsFilter {
    return { ids: globalThis.Array.isArray(object?.ids) ? object.ids.map((e: any) => globalThis.Number(e)) : [] };
  },

  toJSON(message: ConsumableTankIdsFilter): unknown {
    const obj: any = {};
    if (message.ids?.length) {
      obj.ids = message.ids.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConsumableTankIdsFilter>, I>>(base?: I): ConsumableTankIdsFilter {
    return ConsumableTankIdsFilter.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConsumableTankIdsFilter>, I>>(object: I): ConsumableTankIdsFilter {
    const message = createBaseConsumableTankIdsFilter();
    message.ids = object.ids?.map((e) => e) || [];
    return message;
  },
};

function createBaseConsumableTankCategoryFilter(): ConsumableTankCategoryFilter {
  return { categories: [] };
}

export const ConsumableTankCategoryFilter: MessageFns<ConsumableTankCategoryFilter> = {
  encode(message: ConsumableTankCategoryFilter, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.categories) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ConsumableTankCategoryFilter {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsumableTankCategoryFilter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag === 8) {
            message.categories.push(reader.int32() as any);

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.categories.push(reader.int32() as any);
            }

            continue;
          }

          break;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConsumableTankCategoryFilter {
    return {
      categories: globalThis.Array.isArray(object?.categories)
        ? object.categories.map((e: any) => consumableTankCategoryFilterCategoryFromJSON(e))
        : [],
    };
  },

  toJSON(message: ConsumableTankCategoryFilter): unknown {
    const obj: any = {};
    if (message.categories?.length) {
      obj.categories = message.categories.map((e) => consumableTankCategoryFilterCategoryToJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConsumableTankCategoryFilter>, I>>(base?: I): ConsumableTankCategoryFilter {
    return ConsumableTankCategoryFilter.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConsumableTankCategoryFilter>, I>>(object: I): ConsumableTankCategoryFilter {
    const message = createBaseConsumableTankCategoryFilter();
    message.categories = object.categories?.map((e) => e) || [];
    return message;
  },
};

function createBaseConsumableTankNationFilter(): ConsumableTankNationFilter {
  return { nations: [] };
}

export const ConsumableTankNationFilter: MessageFns<ConsumableTankNationFilter> = {
  encode(message: ConsumableTankNationFilter, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    for (const v of message.nations) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ConsumableTankNationFilter {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsumableTankNationFilter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.nations.push(reader.string());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConsumableTankNationFilter {
    return {
      nations: globalThis.Array.isArray(object?.nations) ? object.nations.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: ConsumableTankNationFilter): unknown {
    const obj: any = {};
    if (message.nations?.length) {
      obj.nations = message.nations;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConsumableTankNationFilter>, I>>(base?: I): ConsumableTankNationFilter {
    return ConsumableTankNationFilter.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConsumableTankNationFilter>, I>>(object: I): ConsumableTankNationFilter {
    const message = createBaseConsumableTankNationFilter();
    message.nations = object.nations?.map((e) => e) || [];
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends { $case: string; value: unknown } ? { $case: T["$case"]; value?: DeepPartial<T["value"]> }
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

function assertSet<T>(field: string, value: T | undefined): T {
  if (!isSet(value)) {
    throw new TypeError(`Required field ${field} is not set`);
  }

  return value as T;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
