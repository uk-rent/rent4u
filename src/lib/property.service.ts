
import { supabase } from '@/integrations/supabase/client';
import { 
  Property, 
  PropertyImage, 
  PropertyType, 
  PropertyStatus,
  PropertyFeatures
} from '@/types/property.types';
import { ApiError, PaginationParams } from '@/types/api.types';
import { checkSubscriptionLimits, getActiveSubscription } from './subscription.service';
import { SubscriptionPlan } from '@/types/subscription.types';

/**
 * Obtener propiedades con paginación y filtros
 */
export const getProperties = async (
  params: {
    page?: number;
    limit?: number;
    search?: string;
    propertyType?: PropertyType;
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
    featured?: boolean;
    userId?: string; // Para obtener propiedades de un usuario específico
  }
): Promise<{ data: Property[]; total: number; page: number; limit: number; pages: number }> => {
  const {
    page = 1,
    limit = 10,
    search,
    propertyType,
    minPrice,
    maxPrice,
    beds,
    baths,
    featured,
    userId
  } = params;

  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .eq('visibility', 'public');

  // Añadir filtros si están presentes
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,address.ilike.%${search}%`);
  }
  
  if (propertyType) {
    query = query.eq('property_type', propertyType);
  }
  
  if (minPrice !== undefined) {
    query = query.gte('price', minPrice);
  }
  
  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice);
  }
  
  if (beds !== undefined) {
    query = query.gte('bedrooms', beds);
  }
  
  if (baths !== undefined) {
    query = query.gte('bathrooms', baths);
  }
  
  if (featured !== undefined) {
    query = query.eq('is_featured', featured);
  }
  
  if (userId) {
    query = query.eq('user_id', userId);
  }

  // Añadir paginación
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  // Ordenar por propiedades destacadas primero, luego por fecha de creación
  query = query.order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new ApiError(
      'Error al obtener propiedades', 
      'FETCH_PROPERTIES_ERROR', 
      500, 
      error
    );
  }

  const total = count || 0;
  const pages = Math.ceil(total / limit);

  return {
    data: data as Property[],
    total,
    page,
    limit,
    pages
  };
};

/**
 * Obtener una propiedad por su ID
 */
export const getPropertyById = async (id: string): Promise<Property> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new ApiError(
      'Propiedad no encontrada', 
      'PROPERTY_NOT_FOUND', 
      404, 
      error
    );
  }

  return data as Property;
};

/**
 * Incrementar contador de vistas de una propiedad
 */
export const incrementViewCount = async (id: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_property_view', { property_id: id });

  if (error) {
    console.error('Error incrementando las vistas:', error);
    // No lanzamos error para no interrumpir la experiencia del usuario
  }
};

/**
 * Incrementar contador de clics de contacto
 */
export const incrementContactClickCount = async (id: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_property_contact_click', { property_id: id });

  if (error) {
    console.error('Error incrementando los clics de contacto:', error);
    // No lanzamos error para no interrumpir la experiencia del usuario
  }
};

/**
 * Crear una nueva propiedad
 */
export const createProperty = async (
  userId: string,
  propertyData: Omit<Property, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<Property> => {
  // Verificar límites de suscripción antes de crear
  const { hasReachedLimit, limit } = await checkSubscriptionLimits(userId, 'properties');
  
  if (hasReachedLimit) {
    throw new ApiError(
      `Has alcanzado el límite de propiedades de tu plan (${limit})`, 
      'SUBSCRIPTION_LIMIT_REACHED', 
      403
    );
  }
  
  // Obtener la suscripción del usuario para determinar la fecha de expiración
  const subscription = await getActiveSubscription(userId);
  
  if (!subscription) {
    throw new ApiError(
      'No tienes una suscripción activa', 
      'NO_ACTIVE_SUBSCRIPTION', 
      403
    );
  }
  
  // Calcular fecha de expiración basada en la duración del plan
  const plan = subscription.plan_id as unknown as SubscriptionPlan;
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + plan.listing_duration);
  
  // Preparar datos para inserción
  const newPropertyData = {
    ...propertyData,
    user_id: userId,
    status: propertyData.status || 'draft',
    listing_expires_at: expirationDate.toISOString(),
    ad_type: propertyData.is_featured ? 'featured' : 'standard'
  };
  
  const { data, error } = await supabase
    .from('properties')
    .insert(newPropertyData)
    .select()
    .single();

  if (error) {
    throw new ApiError(
      'Error al crear la propiedad', 
      'CREATE_PROPERTY_ERROR', 
      500, 
      error
    );
  }

  return data as Property;
};

/**
 * Actualizar una propiedad existente
 */
export const updateProperty = async (
  id: string, 
  userId: string, 
  propertyData: Partial<Property>
): Promise<Property> => {
  // Verificar que la propiedad pertenece al usuario
  const property = await getPropertyById(id);
  
  if (property.user_id !== userId) {
    throw new ApiError(
      'No tienes permiso para actualizar esta propiedad', 
      'PERMISSION_DENIED', 
      403
    );
  }

  // Si se está cambiando a destacado, verificar límites
  if (propertyData.is_featured && !property.is_featured) {
    const { hasReachedLimit, limit } = await checkSubscriptionLimits(userId, 'featured');
    
    if (hasReachedLimit) {
      throw new ApiError(
        `Has alcanzado el límite de propiedades destacadas de tu plan (${limit})`, 
        'FEATURED_LIMIT_REACHED', 
        403
      );
    }
    
    // Establecer la fecha de destacado por 30 días (o según configuración)
    const featuredUntil = new Date();
    featuredUntil.setDate(featuredUntil.getDate() + 30);
    propertyData.featured_until = featuredUntil.toISOString();
    propertyData.ad_type = 'featured';
  }
  
  const { data, error } = await supabase
    .from('properties')
    .update(propertyData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new ApiError(
      'Error al actualizar la propiedad', 
      'UPDATE_PROPERTY_ERROR', 
      500, 
      error
    );
  }

  return data as Property;
};

/**
 * Eliminar una propiedad
 */
export const deleteProperty = async (id: string, userId: string): Promise<void> => {
  // Verificar que la propiedad pertenece al usuario
  const property = await getPropertyById(id);
  
  if (property.user_id !== userId) {
    throw new ApiError(
      'No tienes permiso para eliminar esta propiedad', 
      'PERMISSION_DENIED', 
      403
    );
  }

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) {
    throw new ApiError(
      'Error al eliminar la propiedad', 
      'DELETE_PROPERTY_ERROR', 
      500, 
      error
    );
  }
};

/**
 * Renovar la fecha de expiración de una propiedad
 */
export const renewProperty = async (id: string, userId: string): Promise<Property> => {
  // Verificar que la propiedad pertenece al usuario
  const property = await getPropertyById(id);
  
  if (property.user_id !== userId) {
    throw new ApiError(
      'No tienes permiso para renovar esta propiedad', 
      'PERMISSION_DENIED', 
      403
    );
  }
  
  // Obtener la suscripción activa para calcular la nueva fecha de expiración
  const subscription = await getActiveSubscription(userId);
  
  if (!subscription) {
    throw new ApiError(
      'No tienes una suscripción activa', 
      'NO_ACTIVE_SUBSCRIPTION', 
      403
    );
  }
  
  // Calcular nueva fecha de expiración
  const plan = subscription.plan_id as unknown as SubscriptionPlan;
  const newExpirationDate = new Date();
  newExpirationDate.setDate(newExpirationDate.getDate() + plan.listing_duration);
  
  // Actualizar la propiedad
  const { data, error } = await supabase
    .from('properties')
    .update({
      listing_expires_at: newExpirationDate.toISOString(),
      status: 'published' // Si estaba expirada, vuelve a publicarse
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new ApiError(
      'Error al renovar la propiedad', 
      'RENEW_PROPERTY_ERROR', 
      500, 
      error
    );
  }

  return data as Property;
};

/**
 * Guardar una propiedad como favorita para un usuario
 */
export const saveProperty = async (propertyId: string, userId: string): Promise<void> => {
  // Verificar primero si ya está guardada
  const { data: existing } = await supabase
    .from('saved_properties')
    .select('*')
    .eq('property_id', propertyId)
    .eq('user_id', userId)
    .single();
    
  if (existing) {
    // Ya está guardada, no hacer nada
    return;
  }

  const { error } = await supabase
    .from('saved_properties')
    .insert({
      property_id: propertyId,
      user_id: userId
    });

  if (error) {
    throw new ApiError(
      'Error al guardar la propiedad', 
      'SAVE_PROPERTY_ERROR', 
      500, 
      error
    );
  }
};

/**
 * Eliminar una propiedad de favoritos
 */
export const unsaveProperty = async (propertyId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('saved_properties')
    .delete()
    .eq('property_id', propertyId)
    .eq('user_id', userId);

  if (error) {
    throw new ApiError(
      'Error al eliminar la propiedad de favoritos', 
      'UNSAVE_PROPERTY_ERROR', 
      500, 
      error
    );
  }
};

/**
 * Obtener propiedades guardadas por un usuario
 */
export const getSavedProperties = async (
  userId: string,
  pagination: PaginationParams = {}
): Promise<{ data: Property[]; total: number; page: number; limit: number; pages: number }> => {
  const { page = 1, limit = 10 } = pagination;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Primero obtenemos los IDs de propiedades guardadas
  const { data: savedData, error: savedError, count } = await supabase
    .from('saved_properties')
    .select('property_id', { count: 'exact' })
    .eq('user_id', userId)
    .range(from, to);

  if (savedError) {
    throw new ApiError(
      'Error al obtener propiedades guardadas', 
      'FETCH_SAVED_ERROR', 
      500, 
      savedError
    );
  }

  if (!savedData || savedData.length === 0) {
    return {
      data: [],
      total: 0,
      page,
      limit,
      pages: 0
    };
  }

  // Extraer los IDs de propiedades
  const propertyIds = savedData.map(item => item.property_id);

  // Obtener las propiedades completas
  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .select('*')
    .in('id', propertyIds);

  if (propertiesError) {
    throw new ApiError(
      'Error al obtener detalles de propiedades guardadas', 
      'FETCH_SAVED_DETAILS_ERROR', 
      500, 
      propertiesError
    );
  }

  const total = count || 0;
  const pages = Math.ceil(total / limit);

  return {
    data: properties as Property[],
    total,
    page,
    limit,
    pages
  };
};
