export const OPERATING_SYSTEMS = [
  'TensorML 20.04 LTS TensorFlow',
  'TensorML 20.04 LTS PyTorch',
  'TensorML 20.04 LTS Everything',
  'Ubuntu 22.04 LTS',
] as const;

export type OperatingSystem = (typeof OPERATING_SYSTEMS)[number];

export const OS_DETAILS: {
  [key in OperatingSystem]: { features: string; forAI?: boolean };
} = {
  'TensorML 20.04 LTS TensorFlow': {
    features: 'Docker, Jupyter, TensorFlow, Keras, CUDA',
    forAI: true,
  },
  'TensorML 20.04 LTS PyTorch': {
    features: 'Docker, Jupyter, PyTorch, CUDA',
    forAI: true,
  },
  'TensorML 20.04 LTS Everything': {
    features:
      'Docker, Jupyter, RAPIDS, TensorFlow, PyTorch, Keras, fastai, CUDA',
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

export type Configuration = {
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

export const createConfigurations = (): Configuration[] => [
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
