import { z } from 'zod';

import * as constants from '../../constants';
import axios from '../axios';
import fetcher from '../fetcher';

export interface HostnodeEntry {
  location: {
    id: string;
    country: string;
    region: string;
    city: string;
    dc?: { name: string; tier: string };
  };
  networking: {
    ports: number[];
    receive: number;
    send: number;
    dedicated_ip?: boolean;
  };
  specs: {
    cpu: { amount: number; type: string; price: number };
    ram: { amount: number; price: number };
    storage: { amount: number; price: number };
    gpu: Record<
      string,
      {
        amount: number;
        price: number;
        pcie: boolean;
        gtx: boolean;
        rtx: boolean;
        vram: number;
      }
    >;
    restrictions?: Record<
      `${number}`,
      {
        cpu: { min: number; max: number };
        ram: { min: number; max: number };
        storage: { min: number; max: number };
      }
    >;
  };
  status: {
    online: boolean;
    listed: boolean;
    reserved: boolean;
    uptime: number;
    report: `https://monitor.m.tensordock.com/report/uptime/${string}/`;
  };
}

export interface FetchHostnodesParams {
  minGPUCount: number;
  minRAM: number;
  minvCPUs: number;
  minStorage: number;
  minVRAM?: number;
  requiresRTX?: boolean;
  subdomain?: string;
}

/**
 * Step 1: fetch hostnode availability from API
 */
export async function fetchHostnodeStock(params: FetchHostnodesParams) {
  const stockRequestParams = new URLSearchParams({
    minGPUCount: params.minGPUCount.toFixed(0),
    minRAM: params.minRAM.toFixed(0),
    minvCPUs: params.minvCPUs.toFixed(0),
    minStorage: params.minStorage.toFixed(0),
    ...(params.minVRAM && { minVRAM: params.minVRAM.toFixed(0) }),
    ...(params.requiresRTX && { requiresRTX: `${params.requiresRTX}` }),
    ...(params.subdomain && { subdomain: params.subdomain }),
  });

  return fetcher<{
    hostnodes: Record<string, HostnodeEntry>;
  }>(`/api/v0/client/deploy/hostnodes?${stockRequestParams}`);
}

/**
 * Fetches information about preconfigured options, as well as a list of all available instant VMs.
 *
 * To deploy an instant VM, call `deploy` with `is_instant: true` and provide a `instance_uuid`.
 */
export async function fetchInstantVMStock() {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/deploy/instantvms`,
    { validateStatus: (status) => status < 500 }
  );

  const data = res.data as
    | {
        success: true;
        preconfig_options: {
          cpu_count: number;
          gpu_count: number[];
          gpu_model: constants.GpuModel[];
          operating_system: constants.OperatingSystem;
          ram: number;
          storage: number;
          uuid: string;
        }[];
        virtual_machines: Record<
          string,
          {
            city: string;
            country: string;
            cpu_count: number;
            cpu_model: string;
            dc_name: string;
            dc_tier: number;
            gpu_count: number[];
            gpu_model: string[];
            hostnode: string;
            location: string;
            price: {
              compute_price: string;
              gpu_price: string;
              price: string;
              ram_price: string;
              storage_price: string;
              vcpus_price: string;
            };
            ram: number;
            stateprovince: string;
            storage: number;
            uptime: string;
            uuid: string;
          }
        >;
      }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);
  else return data;
}

function formatLocationAvailability(stock: number) {
  if (stock >= 8) return 'High Stock';
  if (stock >= 4 && stock < 8) return 'Medium Stock';
  return 'Low Stock';
}

/**
 * Rounds numbers to nearest 1000th
 */
function roundValue(value: number) {
  return Math.round(value * 1000) / 1000;
}

export function calculateVMPrice(
  {
    gpuPrice,
    ramPrice,
    cpuPrice,
    storagePrice,
  }: {
    gpuPrice: number;
    ramPrice: number;
    cpuPrice: number;
    storagePrice: number;
  },
  selectedSpecs: DeployValues['specs']
) {
  const resourcePrices = {
    gpuTotal: gpuPrice * selectedSpecs.gpu_count,
    ramTotal: ramPrice * selectedSpecs.ram,
    cpuTotal: cpuPrice * selectedSpecs.vcpu,
    storageTotal: storagePrice * selectedSpecs.storage,
  };

  // TODO: Increase granularity of rounding for merging purposes
  const total = Object.values(resourcePrices).reduce(
    (acc, curr) => acc + roundValue(curr),
    0
  );

  return {
    ...resourcePrices,
    total,
  };
}

export function getVRAM(model: constants.GpuModel) {
  const gpuSplit = model.split('-');
  return Number(gpuSplit[gpuSplit.length - 1].replace('gb', ''));
}

function sortLocations(locations: Record<string, LocationInfo>) {
  return Object.fromEntries(
    Object.entries(locations).sort((a, b) => {
      const [, locationA] = a;
      const [, locationB] = b;

      const reservedDiff =
        (locationA.hostnodes?.find((node) => node.reserved) ? 0 : 1) -
        (locationB.hostnodes?.find((node) => node.reserved) ? 0 : 1);

      if (reservedDiff) return reservedDiff;

      return locationA.price - locationB.price;
    })
  );
}

export interface LocationInfo {
  availability: string;
  location: string;
  price: number;
  gpuType: constants.GpuModel;
  stock: number;
  cpuType: string;
  hostnodes: [
    {
      id: string;
      ports: HostnodeEntry['networking']['ports'];
      specs: HostnodeEntry['specs'];
      reserved: HostnodeEntry['status']['reserved'];
      uptime: HostnodeEntry['status']['uptime'];
    },
  ];
}

/**
 * Step 2: generate location information
 */
export function generateLocations(
  selectedSpecs: DeployValues['specs'],
  hostnodes: Record<string, HostnodeEntry>
) {
  const locations: Record<string, LocationInfo> = {};
  const suggestedLocations: Record<string, LocationInfo> = {};

  for (const hostnodeId in hostnodes) {
    const hostnode = hostnodes[hostnodeId];

    for (const hostnodeGPU in hostnode.specs.gpu) {
      const vmPrice = calculateVMPrice(
        {
          gpuPrice: hostnode.specs.gpu[hostnodeGPU].price,
          ramPrice: hostnode.specs.ram.price,
          cpuPrice: hostnode.specs.cpu.price,
          storagePrice: hostnode.specs.storage.price,
        },
        selectedSpecs
      ).total;

      const listToUpdate =
        selectedSpecs.gpu_model === hostnodeGPU
          ? locations
          : suggestedLocations;

      const currentLocationId = hostnode.location.id + vmPrice.toString();

      // Validate each GPU individually, as the returned hostnodes may have GPUs not matching the criteria
      if (
        hostnode.specs.gpu[hostnodeGPU].amount < selectedSpecs.gpu_count ||
        hostnode.specs.gpu[hostnodeGPU].vram <
          getVRAM(selectedSpecs.gpu_model) ||
        (constants.GPU_INFO[selectedSpecs.gpu_model].displayName.includes(
          'RTX'
        ) &&
          !hostnode.specs.gpu[hostnodeGPU].rtx)
      )
        continue;

      if (listToUpdate[currentLocationId]) {
        // If there are two or more hostnodes, we automatically say there is medium availability, even if there is only 1 GPU on each
        // If there are more than 8 GPUs, we say there is high availability... 8 unrented GPUs in one location is a lot!
        listToUpdate[currentLocationId].stock +=
          hostnode.specs.gpu[hostnodeGPU].amount;
        listToUpdate[currentLocationId].availability =
          formatLocationAvailability(listToUpdate[currentLocationId].stock);

        if (
          !listToUpdate[currentLocationId].hostnodes.find(
            (node) => node.id === hostnodeId
          )
        ) {
          listToUpdate[currentLocationId].hostnodes.push({
            id: hostnodeId,
            ports: hostnode.networking.ports,
            specs: hostnode.specs,
            reserved: hostnode.status.reserved,
            uptime: hostnode.status.uptime,
          });
        }
      } else {
        listToUpdate[currentLocationId] = {
          availability: formatLocationAvailability(
            hostnode.specs.gpu[hostnodeGPU].amount
          ),
          location: `${hostnode.location.city}, ${hostnode.location.region}, ${hostnode.location.country}`,
          price: vmPrice,
          gpuType: hostnodeGPU as constants.GpuModel,
          stock: hostnode.specs.gpu[hostnodeGPU].amount,
          cpuType: hostnode.specs.cpu.type,
          hostnodes: [
            {
              id: hostnodeId,
              ports: hostnode.networking.ports,
              specs: hostnode.specs,
              reserved: hostnode.status.reserved,
              uptime: hostnode.status.uptime,
            },
          ],
        };
      }
    }
  }
  return {
    locations: sortLocations(locations),
    suggestedLocations: sortLocations(suggestedLocations),
  };
}

const portSchema = ({ min, max }: { min?: number; max?: number } = {}) =>
  z
    .string()
    .regex(/^[1-9][0-9]*$/, 'Please enter a valid port')
    .refine(
      (val) => min === undefined || parseInt(val) >= min,
      `Must be at least ${min}`
    )
    .refine(
      (val) => max === undefined || parseInt(val) <= max,
      `Must be at most ${max}`
    );

/**
 * zod validator for deployment parameters
 */
export const deploySchema = (hostnodes?: Record<string, HostnodeEntry>) =>
  z
    .object({
      specs: z.object({
        gpu_count: z.number().min(1),
        // @ts-expect-error it's an array we're fiine
        gpu_model: z.enum([...constants.ALLOWED_GPUS.values()], {
          message: 'Please select a GPU model',
        }) as z.ZodSchema<constants.GpuModel>,
        ram: z.number().min(1),
        vcpu: z.number().min(1),
        storage: z.number().min(1),
      }),
      hostnode: z.string(),
      // @ts-expect-error it's an array we're fiine
      os: z.enum(constants.ALLOWED_OS, {
        message: 'Please select an operating system',
      }) as z.ZodSchema<constants.OperatingSystem>,
      adminPassword: z
        .string()
        .min(8, 'Must be at least 8 characters')
        .refine(
          (password) =>
            /[A-Z]/.test(password) ||
            /[\W_]/.test(password) ||
            /\d/.test(password),
          'Password must contain at least 1 uppercase letter, symbol, or number'
        )
        .or(z.literal(''))
        .optional(),
      sshKey: z.string().or(z.literal('')).optional(),
      serverName: z.string().min(1, 'Please name your server'),
      portForwards: z
        .array(
          z.object({
            from: portSchema(),
            to: portSchema({ min: 0, max: 65535 }),
          })
        )
        .superRefine((forwards, ctx) => {
          const externalPortsSet = new Set(forwards.map(({ from }) => from));
          if (externalPortsSet.size === forwards.length) return;

          forwards.forEach(({ from }, idx) => {
            if (
              forwards.find(
                ({ from: from2 }, idx2) => from === from2 && idx !== idx2
              )
            )
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Duplicate external ports not allowed',
                path: [idx, 'from'],
              });
          });
        }),
      cloudinitScript: z.string(),
    })
    .and(
      z.discriminatedUnion('is_instant', [
        z.object({ is_instant: z.literal(false) }),
        z.object({
          is_instant: z.literal(true),
          instance_uuid: z.string(),
        }),
      ])
    )
    // Check we have enough storage for this OS
    .superRefine(({ os, specs }, ctx) => {
      const minStorage = constants.OS_INFO[os].minStorageGB;
      if (minStorage === undefined || specs?.storage === undefined) return;

      if (specs.storage < minStorage) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: minStorage,
          type: 'number',
          inclusive: true,
          message: `Please ensure you have enough storage space (${minStorage.toFixed(0)} GB) for our ${os} operating system template`,
          path: ['specs', 'storage'],
        });
      }
    })
    .superRefine(({ hostnode: hostnodeId, specs, portForwards }, ctx) => {
      if (!hostnodes) {
        return;
      }

      if (!(hostnodeId in hostnodes)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select an available location',
          path: ['hostnode'],
        });
        return;
      }

      // validate that we use only available ports
      for (const [idx, { from }] of portForwards.entries()) {
        if (!hostnodes[hostnodeId].networking.ports.includes(parseInt(from)))
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            fatal: true,
            message: `Port ${from} is unavailable`,
            path: ['portForwards', idx, 'from'],
          });
      }

      const {
        gpu: hostnodeGPUs,
        cpu: hostnodeCPU,
        ram: hostnodeRam,
        storage: hostnodeStorage,
        restrictions,
      } = hostnodes[hostnodeId].specs;

      // Check that hostnode actually has GPU
      if (!(specs.gpu_model in hostnodeGPUs)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Location does not have selected GPU',
          path: ['hostnode'],
        });
        return;
      }

      const gpuCountString = specs.gpu_count.toFixed(0) as `${number}`;
      (
        [
          {
            totalCount: hostnodeGPUs[specs.gpu_model].amount,
            customRestrictions: undefined,
            specsField: 'gpu_count',
            display: 'GPUs',
            unit: '',
          },
          {
            totalCount: hostnodeCPU.amount,
            customRestrictions: restrictions?.[gpuCountString]?.cpu,
            specsField: 'vcpu',
            display: 'VCPUs',
            unit: '',
          },
          {
            totalCount: hostnodeRam.amount,
            customRestrictions: restrictions?.[gpuCountString]?.ram,
            specsField: 'ram',
            display: 'RAM',
            unit: ' GB',
          },
          {
            totalCount: hostnodeStorage.amount,
            customRestrictions: restrictions?.[gpuCountString]?.storage,
            specsField: 'storage',
            display: 'storage',
            unit: ' GB',
          },
        ] as const
      ).forEach(
        ({ totalCount, customRestrictions, specsField, display, unit }) => {
          if (specs[specsField] > totalCount) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              maximum: totalCount,
              type: 'number',
              inclusive: true,
              message: `Too large: ${totalCount}${unit} available at location`,
              path: ['specs', specsField],
            });
          }

          if (!customRestrictions) return;

          if (specs[specsField] < customRestrictions.min)
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              type: 'number',
              message: `Not enough ${display} for ${gpuCountString} GPU${specs.gpu_count === 1 ? '' : 's'} at this location. Minimum is ${customRestrictions.min.toFixed(0)}${unit}`,
              inclusive: true,
              minimum: customRestrictions.min,
              path: ['specs', specsField],
            });

          if (specs[specsField] > customRestrictions.max)
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              type: 'number',
              message: `Too large for ${gpuCountString} GPU${specs.gpu_count === 1 ? '' : 's'} at this location. Maximum is ${customRestrictions.max.toFixed(0)}${unit}`,
              inclusive: true,
              maximum: customRestrictions.max,
              path: ['specs', specsField],
            });
        }
      );
    });

export type DeployValues = z.infer<ReturnType<typeof deploySchema>>;

export async function deploy(
  values: DeployValues,
  hostnodes: Record<string, HostnodeEntry>,
  validate?: boolean
) {
  if (validate) deploySchema(hostnodes).parse(values);

  const { specs, portForwards } = values;

  const externalPorts = portForwards.map(({ from }) => from);
  const internalPorts = portForwards.map(({ to }) => to);

  const body = {
    deployment_type: 'local',
    ...(!!values.adminPassword && { password: values.adminPassword }),
    ...(!!values.sshKey && { ssh_key: values.sshKey }),
    name: values.serverName,
    vcpus: specs.vcpu,
    storage: specs.storage,
    ram: specs.ram,
    gpu_count: specs.gpu_count,
    gpu_model: specs.gpu_model,
    operating_system: values.os,
    hostnode: values.hostnode,
    ...(values.is_instant && { instance_uuid: values.instance_uuid }),
    external_ports: `[${externalPorts.join(', ')}]`,
    internal_ports: `[${internalPorts.join(', ')}]`,
    ...(!!values.cloudinitScript && {
      cloudinit_script: values.cloudinitScript,
    }),
  };

  const formData = new FormData();

  Object.keys(body).forEach((key) => {
    const value = body[key as keyof typeof body];
    if (value === undefined) return;
    formData.append(key, `${value}`);
  });

  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/${values.is_instant ? 'deployinstant' : 'deploy'}/single`,
    formData,
    { validateStatus: (status) => status < 500 }
  );

  const data = res.data as
    | {
        success: true;
        cost: {
          total_price: number;
          compute_price: number;
          storage_price: number;
        };
        ip: string;
        /**
         * Mapping from external network ports to internal ports
         */
        port_forwards: Record<string, string>;
        /**
         * Resulting virtual machine UUID
         */
        server: string;
      }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);

  return data;
}
