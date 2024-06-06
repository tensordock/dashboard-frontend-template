import {
  DeployConfiguration,
  getDefaultConfigurations,
} from '../constants/datacenter';
import fetcher from './fetcher';

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
