export type ThemeKey = 
  | 'fresh_water' 
  | 'warm_amber' 
  | 'green_nature' 
  | 'sweet_rose' 
  | 'dark_mystery';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textMuted: string;
  border: string;
  glow: string;
  cardBg: string;
  gradient: string;
}

export interface ThemeShader {
  shadow: [number, number, number];
  wave1: [number, number, number];
  wave2: [number, number, number];
  crest: [number, number, number];
}

export interface ThemeParticles {
  type: 'snow' | 'amber_sparks' | 'leaves' | 'rose_petals' | 'stardust';
  color: string;
  count: number;
  speed: number;
  size: number;
  opacity: number;
}

export interface ThemeConfig {
  id: ThemeKey;
  name: string;
  subtitle: string;
  description: string;
  colors: ThemeColors;
  shader: ThemeShader;
  particles: ThemeParticles;
}

export const PERFUME_THEMES: Record<ThemeKey, ThemeConfig> = {
  fresh_water: {
    id: 'fresh_water',
    name: 'Fresh Water',
    subtitle: 'Băng Tuyết & Biển Khơi',
    description: 'Tone mát rượi, sảng khoái từ gió biển mặn mòi và dòng suối băng tinh khiết.',
    colors: {
      background: '#0A192F',
      surface: '#112240',
      primary: '#38BDF8',
      secondary: '#1E3A5F',
      accent: '#7DD3FC',
      text: '#F0F9FF',
      textMuted: '#94A3B8',
      border: 'rgba(56, 189, 248, 0.25)',
      glow: 'rgba(56, 189, 248, 0.45)',
      cardBg: 'rgba(10, 25, 47, 0.75)',
      gradient: 'linear-gradient(135deg, #0A192F 0%, #112240 50%, #1E3A5F 100%)',
    },
    shader: {
      shadow: [0.039, 0.098, 0.184], // #0A192F
      wave1: [0.118, 0.227, 0.373],  // #1E3A5F
      wave2: [0.220, 0.741, 0.973],  // #38BDF8
      crest: [0.750, 0.920, 1.000],  // Ice white-blue
    },
    particles: {
      type: 'snow',
      color: '#A5F3FC',
      count: 60,
      speed: 0.8,
      size: 3.5,
      opacity: 0.75,
    },
  },

  warm_amber: {
    id: 'warm_amber',
    name: 'Warm Amber',
    subtitle: 'Rượu Rum, Thuốc Lá & Khói Hổ Phách',
    description: 'Tone ấm nồng, say đắm và quyến rũ như ly rượu mạnh bên lò sưởi đêm đông.',
    colors: {
      background: '#1A0C06',
      surface: '#241008',
      primary: '#F59E0B',
      secondary: '#2E150A',
      accent: '#D97706',
      text: '#FEF3C7',
      textMuted: '#D97706',
      border: 'rgba(245, 158, 11, 0.25)',
      glow: 'rgba(245, 158, 11, 0.45)',
      cardBg: 'rgba(26, 12, 6, 0.75)',
      gradient: 'linear-gradient(135deg, #1A0C06 0%, #241008 50%, #2E150A 100%)',
    },
    shader: {
      shadow: [0.102, 0.047, 0.024], // #1A0C06
      wave1: [0.180, 0.082, 0.039],  // #2E150A
      wave2: [0.851, 0.467, 0.125],  // #D97706
      crest: [0.980, 0.760, 0.320],  // Golden amber glow
    },
    particles: {
      type: 'amber_sparks',
      color: '#FBBF24',
      count: 50,
      speed: 1.2,
      size: 2.8,
      opacity: 0.85,
    },
  },

  green_nature: {
    id: 'green_nature',
    name: 'Green Nature',
    subtitle: 'Lá Sung Non & Thảo Mộc Tươi',
    description: 'Tone thảo mộc trong lành, xanh tươi mọng nước giữa khu vườn Địa Trung Hải.',
    colors: {
      background: '#0A1810',
      surface: '#0E2016',
      primary: '#10B981',
      secondary: '#142C1D',
      accent: '#34D399',
      text: '#ECFDF5',
      textMuted: '#6EE7B7',
      border: 'rgba(16, 185, 129, 0.25)',
      glow: 'rgba(16, 185, 129, 0.45)',
      cardBg: 'rgba(10, 24, 16, 0.75)',
      gradient: 'linear-gradient(135deg, #0A1810 0%, #0E2016 50%, #142C1D 100%)',
    },
    shader: {
      shadow: [0.039, 0.094, 0.063], // #0A1810
      wave1: [0.078, 0.173, 0.114],  // #142C1D
      wave2: [0.063, 0.725, 0.506],  // #10B981
      crest: [0.655, 0.945, 0.733],  // Mint leaf crest
    },
    particles: {
      type: 'leaves',
      color: '#6EE7B7',
      count: 45,
      speed: 0.7,
      size: 4.0,
      opacity: 0.75,
    },
  },

  sweet_rose: {
    id: 'sweet_rose',
    name: 'Sweet Rose',
    subtitle: 'Hoa Hồng Rượu Vang & Pastel Kiêu Kỳ',
    description: 'Tone hoa hồng ngọt ngào nịnh mũi, nữ tính quý phái như một nàng tiểu thư kiêu sa.',
    colors: {
      background: '#1F0B14',
      surface: '#2A0E1B',
      primary: '#F43F5E',
      secondary: '#381324',
      accent: '#FB7185',
      text: '#FFF1F2',
      textMuted: '#FDA4AF',
      border: 'rgba(244, 63, 94, 0.25)',
      glow: 'rgba(244, 63, 94, 0.45)',
      cardBg: 'rgba(31, 11, 20, 0.75)',
      gradient: 'linear-gradient(135deg, #1F0B14 0%, #2A0E1B 50%, #381324 100%)',
    },
    shader: {
      shadow: [0.122, 0.043, 0.078], // #1F0B14
      wave1: [0.220, 0.075, 0.141],  // #381324
      wave2: [0.835, 0.224, 0.459],  // Rose berry
      crest: [0.992, 0.710, 0.812],  // Soft pink crest
    },
    particles: {
      type: 'rose_petals',
      color: '#FDA4AF',
      count: 40,
      speed: 0.6,
      size: 4.5,
      opacity: 0.8,
    },
  },

  dark_mystery: {
    id: 'dark_mystery',
    name: 'Dark Mystery',
    subtitle: 'Màn Đêm Ma Mị & Bụi Sao Huyền Bí',
    description: 'Tone tím than đậm đặc, quyền lực và bí ẩn tột cùng của bóng tối vương giả.',
    colors: {
      background: '#0A0512',
      surface: '#10071E',
      primary: '#A855F7',
      secondary: '#170B28',
      accent: '#C084FC',
      text: '#FAF5FF',
      textMuted: '#D8B4FE',
      border: 'rgba(168, 85, 247, 0.25)',
      glow: 'rgba(168, 85, 247, 0.45)',
      cardBg: 'rgba(10, 5, 18, 0.75)',
      gradient: 'linear-gradient(135deg, #0A0512 0%, #10071E 50%, #170B28 100%)',
    },
    shader: {
      shadow: [0.039, 0.020, 0.071], // #0A0512
      wave1: [0.090, 0.043, 0.157],  // #170B28
      wave2: [0.459, 0.184, 0.784],  // Mystic violet
      crest: [0.851, 0.722, 1.000],  // Starlight crest
    },
    particles: {
      type: 'stardust',
      color: '#E9D5FF',
      count: 65,
      speed: 1.0,
      size: 2.2,
      opacity: 0.85,
    },
  },
};

export const DEFAULT_THEME_ID: ThemeKey = 'sweet_rose';

export function getTheme(themeId?: string): ThemeConfig {
  if (themeId && themeId in PERFUME_THEMES) {
    return PERFUME_THEMES[themeId as ThemeKey];
  }
  return PERFUME_THEMES[DEFAULT_THEME_ID];
}
