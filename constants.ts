import { Symptom } from './types';

export const SYMPTOMS_LIST: Symptom[] = [
  { id: 'hot_flashes', label: 'Hot flashes / Night sweats', category: 'physical' },
  { id: 'sleep', label: 'Sleep disruption / Insomnia', category: 'energy' },
  { id: 'mood', label: 'Mood changes (anxiety, depression, irritability)', category: 'emotional' },
  { id: 'brain_fog', label: 'Brain fog / Memory issues', category: 'emotional' },
  { id: 'libido', label: 'Low libido / Vaginal dryness', category: 'physical' },
  { id: 'weight', label: 'Weight gain (especially belly)', category: 'physical' },
  { id: 'fatigue', label: 'Fatigue / Low energy', category: 'energy' },
  { id: 'periods', label: 'Irregular or heavy periods', category: 'physical' },
  { id: 'headaches', label: 'Headaches / Migraines', category: 'physical' },
  { id: 'joint_pain', label: 'Joint pain', category: 'physical' },
  { id: 'hair_loss', label: 'Hair loss or thinning', category: 'physical' },
  { id: 'skin', label: 'Dry skin', category: 'physical' },
];

export const DURATION_OPTIONS = [
  '< 3 months',
  '3-6 months',
  '6-12 months',
  '1+ year',
];

export const AGE_RANGES = [
  'Under 35',
  '35-40',
  '41-45',
  '46-50',
  '51-55',
  '56-60',
  '61-65',
  'Over 65',
];

export const PERIOD_STATUS_OPTIONS = [
  'Regular',
  'Irregular / Skipped months',
  'Stopped < 12 months ago',
  'Stopped 12+ months ago (Menopause)',
  'Surgical Menopause (Hysterectomy/Oophorectomy)',
];

export const TEST_HISTORY_OPTIONS = [
  'Yes, recently (< 6 months)',
  'Yes, but it was a while ago',
  'Never',
];

export const THERAPY_OPTIONS = [
  'Yes, currently taking HRT/BHRT',
  'No, not currently',
];

// Product Catalog for Context (referenced in Prompt)
export const PRODUCT_CATALOG = {
  tests: {
    complete: { name: 'Complete Panel', price: 275, desc: 'Most comprehensive view.' },
    menopause: { name: 'Menopause Panel', price: 225, desc: 'Focuses on estrogen/progesterone balance.' },
    essential: { name: 'Essential Panel', price: 195, desc: 'Baseline hormone check.' },
  },
  supplements: {
    menoWell: 'MenoWell Complete',
    estroBalance: 'EstroBalance Daily',
    mag: 'Essential Mag',
    vitalDK: 'Vital D+K',
    omegas: 'Essential Omegas',
  }
};
