import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import type { TxCategory, BillerCategory } from '@/data/types';

type IconName = keyof typeof Ionicons.glyphMap;

export const categoryMeta: Record<TxCategory, { icon: IconName; color: string; bg: string; label: string }> = {
  transfer: { icon: 'swap-horizontal', color: '#2F6FED', bg: '#E8F0FE', label: 'Transfer' },
  salary: { icon: 'cash-outline', color: colors.success, bg: colors.successSoft, label: 'Income' },
  shopping: { icon: 'bag-handle-outline', color: '#8B5CF6', bg: '#F1ECFE', label: 'Shopping' },
  dining: { icon: 'restaurant-outline', color: '#E0733A', bg: '#FCEEE4', label: 'Dining' },
  groceries: { icon: 'cart-outline', color: '#0EA36F', bg: '#E4F6EE', label: 'Groceries' },
  utilities: { icon: 'flash-outline', color: '#E0A800', bg: '#FBF3D9', label: 'Utilities' },
  fuel: { icon: 'car-outline', color: '#4B5563', bg: '#EEF0F3', label: 'Fuel' },
  atm: { icon: 'wallet-outline', color: '#0B7D6E', bg: colors.primarySoft, label: 'Cash' },
  fees: { icon: 'pricetag-outline', color: colors.danger, bg: colors.dangerSoft, label: 'Fees' },
  refund: { icon: 'return-down-back-outline', color: colors.success, bg: colors.successSoft, label: 'Refund' },
  other: { icon: 'ellipse-outline', color: colors.muted, bg: '#EEF1F0', label: 'Other' },
};

export const billerMeta: Record<BillerCategory, { icon: IconName; color: string; bg: string }> = {
  telecom: { icon: 'call-outline', color: '#2F6FED', bg: '#E8F0FE' },
  electricity: { icon: 'flash-outline', color: '#E0A800', bg: '#FBF3D9' },
  water: { icon: 'water-outline', color: '#0EA5C4', bg: '#E2F5FA' },
  government: { icon: 'business-outline', color: '#0B7D6E', bg: colors.primarySoft },
  internet: { icon: 'wifi-outline', color: '#8B5CF6', bg: '#F1ECFE' },
  traffic: { icon: 'car-sport-outline', color: '#E0733A', bg: '#FCEEE4' },
};
