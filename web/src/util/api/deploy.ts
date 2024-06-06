import { z } from 'zod';

import {
  DEFAULT_PORTS,
  DeployConfiguration,
  GPU_MAPPINGS,
  OPERATING_SYSTEMS,
  OS_DETAILS,
  OS_MAPPINGS,
  getDefaultConfigurations,
} from '../../constants/datacenter';
import axios from '../axios';
import fetcher from '../fetcher';

const SAVE_RAM_AMOUNT = 64;
const SAVE_CPU_AMOUNT = 16;
const SAVE_STORAGE_AMOUNT = 600;

export interface HostnodeEntry {
  location: {
    id: string;
    country: string;
    region: string;
    city: string;
    dc?: { name: string; tier: string };
  };
  networking: { ports: unknown; receive: unknown; send: unknown };
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
    restrictions: Record<
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

/**
 * Step 1: fetch stocks from API
 */
export async function fetchHostnodeStock(params: {
  minGPUCount: number;
  minRAM: number;
  minvCPUs: number;
  minStorage: number;
  minVRAM: number;
  requiresRTX: boolean;
  domain: string;
}) {
  const stockRequestParams = new URLSearchParams({
    minGPUCount: params.minGPUCount.toFixed(0),
    minRAM: params.minRAM.toFixed(0),
    minvCPUs: params.minvCPUs.toFixed(0),
    minStorage: params.minStorage.toFixed(0),
    minVRAM: params.minVRAM.toFixed(0),
    requiresRTX: `${params.requiresRTX}`,
    domain: params.domain,
  });

  return fetcher<{
    hostnodes: Record<string, HostnodeEntry>;
  }>(`/api/v0/client/deploy/hostnodes?${stockRequestParams}`);
}

function roundValue(value: number) {
  return Math.round(value * 100) / 100;
}

/**
 * Step 2: generate optimal configurations for deployment
 *
 * This finds the best hostnode for each configuration based on hostnode listings
 */
export function generateDeployConfigurations(
  hostnodes: Record<string, HostnodeEntry>
) {
  const configs = getDefaultConfigurations();

  configs.forEach((configuration) => {
    const { gpu_count: gpuCount, ram, vcpu, storage } = configuration;

    let bestHostnode = null;
    let bestHostnodeConfig = null;
    let bestHostnodePrice = -1;
    for (const [hostnodeID, hostnode] of Object.entries(hostnodes)) {
      const { specs } = hostnode;
      if (
        specs.gpu[configuration.gpu_model].amount < gpuCount ||
        specs.ram.amount < ram ||
        specs.ram.amount -
          ram -
          SAVE_RAM_AMOUNT *
            (specs.gpu[configuration.gpu_model].amount - gpuCount) <
          0 ||
        specs.cpu.amount < vcpu ||
        specs.cpu.amount -
          vcpu -
          SAVE_CPU_AMOUNT *
            (specs.gpu[configuration.gpu_model].amount - gpuCount) <
          0 ||
        specs.storage.amount < storage ||
        specs.storage.amount -
          storage -
          SAVE_STORAGE_AMOUNT *
            (specs.gpu[configuration.gpu_model].amount - gpuCount) <
          0
      ) {
        continue;
      }

      if (!bestHostnode) {
        bestHostnode = hostnodeID;
        bestHostnodeConfig = hostnode;
        bestHostnodePrice = roundValue(
          specs.ram.price * ram +
            specs.cpu.price * vcpu +
            specs.storage.price * storage +
            specs.gpu[configuration.gpu_model].price * gpuCount
        );
      }

      if (
        roundValue(
          specs.ram.price * ram +
            specs.cpu.price * vcpu +
            specs.storage.price * storage +
            specs.gpu[configuration.gpu_model].price * gpuCount
        ) < bestHostnodePrice ||
        (specs.gpu[configuration.gpu_model].amount <
          bestHostnodeConfig!.specs.gpu[configuration.gpu_model].amount &&
          specs.gpu[configuration.gpu_model].amount >= gpuCount &&
          specs.ram.amount >= ram &&
          specs.cpu.amount >= vcpu &&
          specs.storage.amount >= storage &&
          roundValue(
            specs.ram.price * ram +
              specs.cpu.price * vcpu +
              specs.storage.price * storage +
              specs.gpu[configuration.gpu_model].price * gpuCount
          ) <= bestHostnodePrice)
      ) {
        bestHostnode = hostnodeID;
        bestHostnodeConfig = hostnode;
        bestHostnodePrice = roundValue(
          specs.ram.price * ram +
            specs.cpu.price * vcpu +
            specs.storage.price * storage +
            specs.gpu[configuration.gpu_model].price * gpuCount
        );
      }
    }

    if (bestHostnode) {
      configuration.hostnode = bestHostnode;
      configuration.stock = true;
      configuration.price = bestHostnodePrice;
    }
  });

  return configs;
}

/**
 * Step 3: Spruce up the display, filter out configurations that are out of stock
 */
export function getDisplayConfigurations(
  configurations: DeployConfiguration[]
): DeployConfiguration[] {
  return configurations
    .filter(({ stock }) => stock) // make sure we're in stock!
    .map((configuration) => {
      return {
        ...configuration,
        gpu_model: configuration.gpu_model
          .replace('h100', 'H100')
          .replace('-sxm5-', ' SXM5 ')
          .replace('gb', 'GB'),
      };
    });
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

export const deploySchema = z
  .object({
    configuration: z.string(),
    os: z.enum(OPERATING_SYSTEMS, {
      message: 'Please select an operating system',
    }),
    adminPassword: z
      .string()
      .min(1, 'Please provide an admin password')
      .min(8, 'Must be at least 8 characters')
      .refine(
        (password) =>
          /[A-Z]/.test(password) ||
          /[\W_]/.test(password) ||
          /\d/.test(password),
        'Password must contain at least 1 uppercase letter, symbol, or number'
      ),
    serverName: z.string().min(1, 'Please name your server'),
    portForwards: z.array(
      z.object({
        from: portSchema({ min: 20019, max: 20099 }).refine(
          (port) => DEFAULT_PORTS.findIndex(({ from }) => from === port) === -1,
          'Cannot override default ports'
        ),
        to: portSchema({ min: 0, max: 65535 }),
      })
    ),
    cloudinitScript: z.string(),
  })
  .superRefine(({ os, configuration }, ctx) => {
    const minStorage = OS_DETAILS[os].minStorageGB;
    if (minStorage === undefined || configuration === undefined) return;

    const config = JSON.parse(configuration) as DeployConfiguration;

    if (config.storage < minStorage) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: minStorage,
        type: 'number',
        inclusive: true,
        message: `Please ensure you have enough storage space (${minStorage.toFixed(0)} GB) for our ${os} operating system template`,
        path: ['configuration'],
      });
    }
  });

export async function deploy(values: z.infer<typeof deploySchema>) {
  const {
    configuration: configString,
    os,
    adminPassword,
    serverName,
    portForwards,
    cloudinitScript,
  } = values;

  const config = JSON.parse(configString) as DeployConfiguration;

  const externalPorts = portForwards.map(({ from }) => from);
  const internalPorts = portForwards.map(({ to }) => to);

  const body = {
    deployment_type: 'local',
    password: adminPassword,
    name: serverName,
    vcpus: config.vcpu,
    storage: config.storage,
    ram: config.ram,
    country: 'United States',
    gpu_count: config.gpu_count,
    gpu_model: GPU_MAPPINGS[config.gpu_model as keyof typeof GPU_MAPPINGS],
    operating_system: OS_MAPPINGS[os as keyof typeof OS_MAPPINGS],
    hostnode: config.hostnode,
    external_ports: `[${externalPorts.join(', ')}]`,
    internal_ports: `[${internalPorts.join(', ')}]`,
    ...(!!cloudinitScript && { cloudinit_script: cloudinitScript }),
    // ...(selectedBid && {
    //   price_type: 'spot',
    //   price: selectedBid,
    // }),
  };

  const formData = new FormData();

  Object.keys(body).forEach((key) => {
    const value = body[key as keyof typeof body];
    if (value === undefined) return;
    formData.append(key, `${value}`);
  });

  console.log(formData);

  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/deploy/single`,
    formData,
    { validateStatus: (status) => status < 500 }
  );

  const data = res.data as
    | { success: true }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);
}
