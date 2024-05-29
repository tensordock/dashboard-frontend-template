export type Configuration = {
  gpu_count: number;
  gpu_model: string;
  ram: number;
  vcpu: number;
  storage: number;
  nvlink: boolean;
  bandwidth: number;
  stock: boolean;
  hostnode: null;
  price: number;
};

// prettier-ignore
export const validConfigurations: Configuration[] = [
  {gpu_count: 1, gpu_model: 'h100-sxm5-80gb', ram: 62,  vcpu: 12,  storage: 600,   nvlink: false, bandwidth: 10,  stock: false, hostnode: null, price: 0},
  {gpu_count: 1, gpu_model: 'h100-sxm5-80gb', ram: 124, vcpu: 24,  storage: 1200,  nvlink: false, bandwidth: 10,  stock: false, hostnode: null, price: 0},
  {gpu_count: 2, gpu_model: 'h100-sxm5-80gb', ram: 124, vcpu: 24,  storage: 1200,  nvlink: false, bandwidth: 10,  stock: false, hostnode: null, price: 0},
  {gpu_count: 2, gpu_model: 'h100-sxm5-80gb', ram: 248, vcpu: 48,  storage: 2400,  nvlink: false, bandwidth: 10,  stock: false, hostnode: null, price: 0},
  {gpu_count: 4, gpu_model: 'h100-sxm5-80gb', ram: 248, vcpu: 48,  storage: 2400,  nvlink: false, bandwidth: 10,  stock: false, hostnode: null, price: 0},
  {gpu_count: 4, gpu_model: 'h100-sxm5-80gb', ram: 496, vcpu: 96,  storage: 4800,  nvlink: false, bandwidth: 10,  stock: false, hostnode: null, price: 0},
  {gpu_count: 8, gpu_model: 'h100-sxm5-80gb', ram: 496, vcpu: 96,  storage: 4800,  nvlink: true,  bandwidth: 100, stock: false, hostnode: null, price: 0},
  {gpu_count: 8, gpu_model: 'h100-sxm5-80gb', ram: 906, vcpu: 208, storage: 11680, nvlink: true,  bandwidth: 100, stock: false, hostnode: null, price: 0},
];
