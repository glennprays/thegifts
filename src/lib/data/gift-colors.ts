export interface GiftColor {
  accent: string;
  pale: string;
  glyph: GlyphName;
}

export type GlyphName =
  | 'star'
  | 'eye'
  | 'speech'
  | 'flame'
  | 'dove'
  | 'gift'
  | 'hands'
  | 'sun'
  | 'house'
  | 'pray'
  | 'book'
  | 'crown'
  | 'heart'
  | 'footprints'
  | 'plant'
  | 'lamp';

const COLORS = {
  red: { accent: '#d22628', pale: '#ffe0e1' },
  amber: { accent: '#d97706', pale: '#ffecc7' },
  green: { accent: '#24843f', pale: '#e4fbe9' },
  blue: { accent: '#0d76cc', pale: '#e5f3ff' },
  plum: { accent: '#6d28d9', pale: '#ede9fe' },
  teal: { accent: '#0f766e', pale: '#ccfbf1' },
} as const;

export const GIFT_COLORS: Record<string, GiftColor> = {
  administration: { ...COLORS.blue, glyph: 'star' },
  discernment: { ...COLORS.plum, glyph: 'eye' },
  evangelist: { ...COLORS.blue, glyph: 'speech' },
  exhortation: { ...COLORS.red, glyph: 'flame' },
  faith: { ...COLORS.blue, glyph: 'dove' },
  giving: { ...COLORS.teal, glyph: 'gift' },
  healing: { ...COLORS.green, glyph: 'hands' },
  helps: { ...COLORS.green, glyph: 'sun' },
  hospitality: { ...COLORS.teal, glyph: 'house' },
  intercession: { ...COLORS.plum, glyph: 'pray' },
  knowledge: { ...COLORS.blue, glyph: 'book' },
  leadership: { ...COLORS.amber, glyph: 'crown' },
  mercy: { ...COLORS.red, glyph: 'heart' },
  missionary: { ...COLORS.amber, glyph: 'footprints' },
  pastor: { ...COLORS.red, glyph: 'plant' },
  service: { ...COLORS.teal, glyph: 'hands' },
  teacher: { ...COLORS.teal, glyph: 'book' },
  wisdom: { ...COLORS.plum, glyph: 'lamp' },
};

export function giftColor(category: string): GiftColor {
  return (
    GIFT_COLORS[category.toLowerCase()] ?? {
      accent: '#1b1b1b',
      pale: '#edeceb',
      glyph: 'star',
    }
  );
}
