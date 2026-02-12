
export enum AppState {
  UPLOAD = 'UPLOAD',
  EDITOR = 'EDITOR',
  GENERATING = 'GENERATING',
  RESULTS = 'RESULTS'
}

export enum RoomType {
  BEDROOM = 'Bedroom',
  LIVING_ROOM = 'Living Room / Hall',
  KITCHEN = 'Kitchen',
  BATHROOM = 'Bathroom',
  OFFICE = 'Office',
  DINING_ROOM = 'Dining Room',
  BALCONY = 'Balcony',
  STUDIO = 'Studio',
  OUTDOOR = 'Outdoor Area',
  CUSTOM = 'Custom Room Type'
}

export enum StylePreset {
  MODERN = 'Modern',
  SCANDINAVIAN = 'Scandinavian',
  JAPANDI = 'Japandi',
  MID_CENTURY = 'Mid-century',
  MINIMAL_TRADITIONAL = 'Minimal Traditional',
  INDUSTRIAL = 'Industrial',
  BOHEMIAN = 'Bohemian'
}

export enum LightingOption {
  DAYLIGHT = 'Daylight',
  WARM_INDOOR = 'Warm indoor',
  GOLDEN_HOUR = 'Golden hour',
  NEUTRAL = 'Neutral'
}

export enum TimePeriod {
  MORNING = 'Morning',
  AFTERNOON = 'Afternoon',
  EVENING = 'Evening',
  NIGHT = 'Night'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  NEUTRAL = 'Neutral'
}

export enum AvatarStyle {
  AVATAAARS = 'avataaars',
  LORELEI = 'lorelei',
  BOTTTS = 'bottts',
  NOTIONISTS = 'notionists',
  PIXEL_ART = 'pixel-art'
}

export interface SavedPreset {
  id: string;
  name: string;
  roomType: RoomType;
  style: StylePreset;
  lighting: LightingOption;
  creativity: number;
  prompt: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface UserPreferences {
  defaultRoomType: RoomType;
  defaultStyle: StylePreset;
  defaultLighting: LightingOption;
  savedPresets: SavedPreset[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatarStyle: AvatarStyle;
  isPro: boolean;
  joinedAt: number;
  gender: Gender;
  preferences: UserPreferences;
}

export interface GenerationSettings {
  prompt: string;
  roomType: RoomType;
  style: StylePreset;
  lighting: LightingOption;
  creativity: number; 
  preserveStructure: boolean;
  autoSuggest: boolean;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
}

export interface GenerationResult {
  id: string;
  imageUrl: string;
  depthMapUrl?: string;
  promptUsed: string;
  timestamp: number;
  sourceImage: string;
  settings: GenerationSettings;
}

export interface DesignSuggestion {
  id: string;
  text: string;
  category: 'decor' | 'lighting' | 'furniture' | 'color';
  box_2d?: [number, number, number, number]; 
}

export interface ProductItem {
  id: string;
  name: string;
  query: string;
  category: string;
  priceRange?: string;
  box_2d?: [number, number, number, number];
  dimensions?: {
    length: string;
    width: string;
    height: string;
  };
  isSpaceOptimized?: boolean;
}

export interface BudgetItem {
  id: string;
  item: string;
  costMin: number;
  costMax: number;
  category: string;
}

export interface Project {
  id: string;
  name: string;
  userId?: string;
  updatedAt: number;
  sourceImage: string;
  settings: GenerationSettings;
  result: GenerationResult | null;
  history: GenerationResult[];
  shoppingItems: ProductItem[];
  budgetItems: BudgetItem[];
}

export interface MeasurementPoint {
  x: number; // 0-1000
  y: number; // 0-1000
}

export interface ManualMeasurement {
  id: string;
  start: MeasurementPoint;
  end: MeasurementPoint;
  distanceLabel?: string;
}
