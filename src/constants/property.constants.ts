export const PROPERTY_TYPES = {
  APARTMENT: 'apartment',
  HOUSE: 'house',
  ROOM: 'room',
  STUDIO: 'studio',
  COMMERCIAL: 'commercial',
  LAND: 'land',
} as const;

export const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  RENTED: 'rented',
  PENDING: 'pending',
  UNAVAILABLE: 'unavailable',
} as const;

export const PROPERTY_LISTING_TYPES = {
  RENT: 'rent',
  SALE: 'sale',
  BOTH: 'both',
} as const;

export const PROPERTY_FEATURES = {
  FURNISHED: 'furnished',
  PETS_ALLOWED: 'petsAllowed',
  AIR_CONDITIONING: 'airConditioning',
  HEATING: 'heating',
  PARKING: 'parking',
  ELEVATOR: 'elevator',
} as const;

export const PROPERTY_AMENITIES = {
  WIFI: 'wifi',
  POOL: 'pool',
  GYM: 'gym',
  SECURITY: 'security',
  PARKING: 'parking',
  GARDEN: 'garden',
  BALCONY: 'balcony',
  TERRACE: 'terrace',
  FIREPLACE: 'fireplace',
  DISHWASHER: 'dishwasher',
  WASHER: 'washer',
  DRYER: 'dryer',
} as const;

export const PROPERTY_SORT_OPTIONS = {
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  DATE_ASC: 'date_asc',
  DATE_DESC: 'date_desc',
  RATING_DESC: 'rating_desc',
} as const;

export const PROPERTY_DEFAULTS = {
  PAGE_SIZE: 12,
  MAX_PRICE: 10000,
  MIN_PRICE: 0,
  MAX_AREA: 1000,
  MIN_AREA: 0,
} as const;

export const PROPERTY_VALIDATION = {
  TITLE_MIN_LENGTH: 10,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 2000,
  PRICE_MIN: 0,
  PRICE_MAX: 1000000,
  AREA_MIN: 0,
  AREA_MAX: 10000,
  BEDROOMS_MIN: 0,
  BEDROOMS_MAX: 20,
  BATHROOMS_MIN: 0,
  BATHROOMS_MAX: 10,
} as const; 