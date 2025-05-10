export const motionModules = [
  {
    id: 'mm_sd_v15',
    name: 'SD 1.5 Motion Module',
    description: 'Standard motion module for Stable Diffusion 1.5'
  },
  {
    id: 'mm_sdxl',
    name: 'SDXL Motion Module',
    description: 'Enhanced motion module for SDXL'
  },
  {
    id: 'mm_ad_v3',
    name: 'AnimateDiff v3 Module',
    description: 'Latest AnimateDiff motion module'
  }
];

export const modelOptions = [
  { value: 'sd15', label: 'SD 1.5' },
  { value: 'sdxl', label: 'SDXL' },
  { value: 'animatediff_v3', label: 'AnimateDiff v3' }
];

export const outputTypes = [
  { value: 'gif', label: 'GIF' },
  { value: 'mp4', label: 'MP4' }
];
