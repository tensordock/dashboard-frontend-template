import { z } from 'zod';
import type * as api from '../util/api';

export const DEFAULT_DEPLOY_SPECS = {
  gpu_model: 'geforcertx4090-pcie-24gb',
  gpu_count: 1,
  ram: 4,
  vcpu: 2,
  storage: 20,
} satisfies Partial<z.infer<typeof api.deploySchema>['specs']>;

// Update this list to match the GPUs you want to rent out.
export const ALLOWED_GPUS: GpuModel[] = [
  'h100-sxm5-80gb',
  'a100-pcie-80gb',
  'a100-pcie-40gb',
  'a100-nvlink-40gb',
  'geforcertx4090-pcie-24gb',
  'geforcertx3090-pcie-24gb',
  'geforcertx3070ti-pcie-8gb',
  'geforcertx3060-pcie-12gb',
];

export const SINGLE_LOCATION = false;

export const ALLOWED_OS: OperatingSystem[] = [
  'Ubuntu 20.04 LTS',
  'Ubuntu 22.04 LTS',
  'TensorML 20 Everything',
  'TensorML 20 PyTorch',
  'TensorML 20 TensorFlow',
  'Windows 10',
];

export const ALLOWED_GPU_COUNT = [1, 2, 3, 4, 5, 6, 7, 8];

export const ALLOWED_RAM_GB = [
  4, 6, 8, 10, 12, 16, 20, 24, 30, 32, 48, 61, 64, 100, 112, 120, 128, 160, 240,
  256, 300, 366, 384, 492, 640, 768, 896, 940, 1420,
];

export const ALLOWED_VCPU_COUNT = [
  2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 46, 60, 94, 104, 128,
  254,
];

export const ALLOWED_STORAGE_GB = [
  20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 300, 400, 500, 600, 700, 800,
  900, 1000, 1200, 1400, 1600, 1800, 2000, 2500, 3000, 3500, 4000, 4500, 5000,
  5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000,
];

export type GpuModel = keyof typeof GPU_INFO;

// Shouldn't have to update anything below here

export const GPU_SWITCHING_ALLOWED = ALLOWED_GPUS.length > 1;

export const GPU_INFO = {
  'a100-sxm4-80gb': { displayName: 'A100 80GB SXM4', shortName: 'A100 SXM4' },
  'a100-pcie-80gb': { displayName: 'A100 80GB PCIE', shortName: 'A100' },
  'a100-pcie-40gb': { displayName: 'A100 40GB PCIE', shortName: 'A100' },
  'a100-nvlink-40gb': {
    displayName: 'A100 40GB NVLink',
    shortName: 'A100 NVLink',
  },
  'l40s-pcie-48gb': { displayName: 'L40S 48GB PCIE', shortName: 'L40S' },
  'l40-pcie-48gb': { displayName: 'L40 48GB PCIE', shortName: 'L40' },
  'v100-sxm2-16gb': { displayName: 'V100 16GB SXM2', shortName: 'V100 SXM2' },
  'v100-nvlink-16gb': {
    displayName: 'V100 16GB NVLink',
    shortName: 'V100 NVLink',
  },
  'rtx6000ada-pcie-48gb': {
    displayName: 'RTX 6000 ADA 48GB',
    shortName: 'RTX 6000 Ada',
  },
  'rtx5000ada-pcie-32gb': {
    displayName: 'RTX 5000 ADA 32GB',
    shortName: 'RTX 6000 Ada',
  },
  'rtx4500ada-pcie-24gb': {
    displayName: 'RTX 4500 ADA 24GB',
    shortName: 'RTX 4500 Ada',
  },
  'rtx4000ada-pcie-20gb': {
    displayName: 'RTX 4000 ADA 20GB',
    shortName: 'RTX 4000 Ada',
  },
  'rtx4000sffada-pcie-20gb': {
    displayName: 'RTX 4000 SFF ADA 20GB',
    shortName: 'RTX 4000 SFF Ada',
  },
  'rtxa6000-pcie-48gb': {
    displayName: 'RTX A6000 48GB',
    shortName: 'RTX A6000',
  },
  'rtxa5000-pcie-24gb': {
    displayName: 'RTX A5000 24GB',
    shortName: 'RTX A5000',
  },
  'rtxa4000-pcie-16gb': {
    displayName: 'RTX A4000 16GB',
    shortName: 'RTX A4000',
  },
  'geforcertx4090-pcie-24gb': {
    displayName: 'GeForce RTX 4090 24GB',
    shortName: 'RTX 4090',
  },
  'geforcertx3090-pcie-24gb': {
    displayName: 'GeForce RTX 3090 24GB',
    shortName: 'RTX 3090',
  },
  'geforcertx3080ti-pcie-12gb': {
    displayName: 'GeForce RTX 3080 Ti 12GB',
    shortName: 'RTX 3080ti',
  },
  'geforcertx3080-pcie-10gb': {
    displayName: 'GeForce RTX 3080 10GB',
    shortName: 'RTX 3080',
  },
  'geforcertx3070ti-pcie-8gb': {
    displayName: 'GeForce RTX 3070 Ti 8GB',
    shortName: 'RTX 3070ti',
  },
  'geforcertx3060-pcie-12gb': {
    displayName: 'GeForce RTX 3060 12GB',
    shortName: 'RTX 3060ti',
  },
  'quadrortx4000-pcie-8gb': {
    displayName: 'Quadro RTX 4000 8GB',
    shortName: 'Quadro RTX 4000',
  },
  'quadrortx5000-pcie-16gb': {
    displayName: 'Quadro RTX 5000 16GB',
    shortName: 'Quadro RTX 5000',
  },
  'h100-sxm5-80gb': { displayName: 'H100 SXM5 80GB', shortName: 'H100 SXM5' },
} as const satisfies Record<string, { displayName: string; shortName: string }>;

export type OperatingSystem = keyof typeof OS_INFO;

export const OS_INFO = {
  'TensorML 20 TensorFlow': {
    displayName: 'TensorML 20.04 LTS TensorFlow',
    features: 'Docker, Jupyter, TensorFlow, Keras, CUDA',
    minStorageGB: 40,
    forAI: true,
  },
  'TensorML 20 PyTorch': {
    displayName: 'TensorML 20.04 LTS PyTorch',
    features: 'Docker, Jupyter, PyTorch, CUDA',
    minStorageGB: 40,
    forAI: true,
  },
  'TensorML 20 Everything': {
    displayName: 'TensorML 20.04 LTS Everything',
    features:
      'Docker, Jupyter, RAPIDS, TensorFlow, PyTorch, Keras, fastai, CUDA',
    minStorageGB: 60,
    forAI: true,
  },
  'Ubuntu 22.04 LTS': {
    displayName: 'Ubuntu 22.04 LTS',
    features: 'Docker',
    minStorageGB: 20,
    forAI: false,
  },
  'Ubuntu 20.04 LTS': {
    displayName: 'Ubuntu 20.04 LTS',
    features: 'Docker',
    minStorageGB: 20,
    forAI: false,
  },
  'TensorML 20 RAPIDS': {
    displayName: 'TensorML 20.04 LTS RAPIDS',
    features: 'Docker, Jupyter, RAPIDS', // TODO: might be wrong lol
    minStorageGB: 40,
    forAI: false,
  },
  'Windows 10': {
    displayName: 'Windows 10',
    features: 'NVIDIA drivers preinstalled. Bring Your Own License.',
    minStorageGB: 90,
    forAI: false,
  },
} as const satisfies Record<
  string,
  {
    displayName: string;
    features: string;
    minStorageGB: number;
    forAI: boolean;
  }
>;
