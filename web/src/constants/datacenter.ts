export const OPERATING_SYSTEMS = [
  'TensorML 20.04 LTS TensorFlow',
  'TensorML 20.04 LTS PyTorch',
  'TensorML 20.04 LTS Everything',
  'Ubuntu 22.04 LTS',
] as const;

export type OperatingSystem = (typeof OPERATING_SYSTEMS)[number];

export const OS_DETAILS: {
  [key in OperatingSystem]: {
    features: string;
    minStorageGB?: number;
    forAI?: boolean;
  };
} = {
  'TensorML 20.04 LTS TensorFlow': {
    features: 'Docker, Jupyter, TensorFlow, Keras, CUDA',
    minStorageGB: 40,
    forAI: true,
  },
  'TensorML 20.04 LTS PyTorch': {
    features: 'Docker, Jupyter, PyTorch, CUDA',
    minStorageGB: 40,
    forAI: true,
  },
  'TensorML 20.04 LTS Everything': {
    features:
      'Docker, Jupyter, RAPIDS, TensorFlow, PyTorch, Keras, fastai, CUDA',
    minStorageGB: 60,
    forAI: true,
  },
  'Ubuntu 22.04 LTS': {
    features: 'Docker',
  },
};

export const DEFAULT_PORTS = [
  { from: '20004', to: '22', id: 'default1' },
  { from: '20018', to: '3389', id: 'default2' },
  { from: '20022', to: '8888', id: 'default3' },
];

export type DeployConfiguration = {
  gpu_count: number;
  gpu_model: string;
  ram: number;
  vcpu: number;
  storage: number;
  nvlink: boolean;
  bandwidth: number;
  stock: boolean;
  hostnode: null | string;
  price: number;
};

export const getDefaultConfigurations = (): DeployConfiguration[] => [
  {
    gpu_count: 1,
    gpu_model: 'h100-sxm5-80gb',
    ram: 62,
    vcpu: 12,
    storage: 600,
    nvlink: false,
    bandwidth: 10,
    stock: false,
    hostnode: null,
    price: 0,
  },
  {
    gpu_count: 1,
    gpu_model: 'h100-sxm5-80gb',
    ram: 124,
    vcpu: 24,
    storage: 1200,
    nvlink: false,
    bandwidth: 10,
    stock: false,
    hostnode: null,
    price: 0,
  },
  {
    gpu_count: 2,
    gpu_model: 'h100-sxm5-80gb',
    ram: 124,
    vcpu: 24,
    storage: 1200,
    nvlink: false,
    bandwidth: 10,
    stock: false,
    hostnode: null,
    price: 0,
  },
  {
    gpu_count: 2,
    gpu_model: 'h100-sxm5-80gb',
    ram: 248,
    vcpu: 48,
    storage: 2400,
    nvlink: false,
    bandwidth: 10,
    stock: false,
    hostnode: null,
    price: 0,
  },
  {
    gpu_count: 4,
    gpu_model: 'h100-sxm5-80gb',
    ram: 248,
    vcpu: 48,
    storage: 2400,
    nvlink: false,
    bandwidth: 10,
    stock: false,
    hostnode: null,
    price: 0,
  },
  {
    gpu_count: 4,
    gpu_model: 'h100-sxm5-80gb',
    ram: 496,
    vcpu: 96,
    storage: 4800,
    nvlink: false,
    bandwidth: 10,
    stock: false,
    hostnode: null,
    price: 0,
  },
  {
    gpu_count: 8,
    gpu_model: 'h100-sxm5-80gb',
    ram: 496,
    vcpu: 96,
    storage: 4800,
    nvlink: true,
    bandwidth: 100,
    stock: false,
    hostnode: null,
    price: 0,
  },
  {
    gpu_count: 8,
    gpu_model: 'h100-sxm5-80gb',
    ram: 906,
    vcpu: 208,
    storage: 11680,
    nvlink: true,
    bandwidth: 100,
    stock: false,
    hostnode: null,
    price: 0,
  },
];

export const GPU_MAPPINGS = {
  'A100 80GB SXM4': 'a100-sxm4-80gb',
  'A100 80GB PCIE': 'a100-pcie-80gb',
  'A100 40GB PCIE': 'a100-pcie-40gb',
  'A100 40GB NVLink': 'a100-nvlink-40gb',
  'L40S 48GB PCIE': 'l40s-pcie-48gb',
  'L40 48GB PCIE': 'l40-pcie-48gb',
  'V100 16GB SXM2': 'v100-sxm2-16gb',
  'V100 16GB NVLink': 'v100-nvlink-16gb',
  'RTX 6000 ADA 48GB': 'rtx6000ada-pcie-48gb',
  'RTX 5000 ADA 32GB': 'rtx5000ada-pcie-32gb',
  'RTX 4500 ADA 24GB': 'rtx4500ada-pcie-24gb',
  'RTX 4000 ADA 20GB': 'rtx4000ada-pcie-20gb',
  'RTX 4000 SFF ADA 20GB': 'rtx4000sffada-pcie-20gb',
  'RTX A6000 48GB': 'rtxa6000-pcie-48gb',
  'RTX A5000 24GB': 'rtxa5000-pcie-24gb',
  'RTX A4000 16GB': 'rtxa4000-pcie-16gb',
  'GeForce RTX 4090 24GB': 'geforcertx4090-pcie-24gb',
  'GeForce RTX 3090 24GB': 'geforcertx3090-pcie-24gb',
  'GeForce RTX 3080 Ti 12GB': 'geforcertx3080ti-pcie-12gb',
  'GeForce RTX 3080 10GB': 'geforcertx3080-pcie-10gb',
  'GeForce RTX 3070 Ti 8GB': 'geforcertx3070ti-pcie-8gb',
  'GeForce RTX 3060 12GB': 'geforcertx3060-pcie-12gb',
  'Quadro RTX 4000 8GB': 'quadrortx4000-pcie-8gb',
  'Quadro RTX 5000 16GB': 'quadrortx5000-pcie-16gb',
  'H100 SXM5 80GB': 'h100-sxm5-80gb',
};

export const OS_MAPPINGS = {
  'Ubuntu 20.04 LTS': 'Ubuntu 20.04 LTS',
  'Ubuntu 22.04 LTS': 'Ubuntu 22.04 LTS',
  'TensorML 20.04 LTS TensorFlow': 'TensorML 20 TensorFlow',
  'TensorML 20.04 LTS PyTorch': 'TensorML 20 PyTorch',
  'TensorML 20.04 LTS Everything': 'TensorML 20 Everything',
  'TensorML 20.04 LTS RAPIDS': 'TensorML 20 RAPIDS',
  'Windows 10': 'Windows 10',
};
