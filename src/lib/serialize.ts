/**
 * Serializa profundamente objetos de MongoDB para que puedan ser pasados
 * desde Server Components a Client Components en Next.js.
 *
 * Convierte:
 * - ObjectIds -> strings
 * - Dates -> ISO strings
 * - Arrays -> arrays serializados recursivamente
 * - Objetos -> objetos serializados recursivamente
 */
export function deepSerialize<T = any>(obj: any): T {
  // Manejo de valores null o undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Manejo de tipos primitivos
  if (typeof obj !== 'object') {
    return obj;
  }

  // Manejo de Dates
  if (obj instanceof Date) {
    return obj.toISOString() as any;
  }

  // Manejo de ObjectIds
  // Un ObjectId de MongoDB tiene la propiedad _bsontype o tiene tanto 'id' como 'toHexString'
  if (
    obj._bsontype === 'ObjectId' ||
    (obj.id && typeof obj.toHexString === 'function')
  ) {
    return obj.toString() as any;
  }

  // Manejo de Arrays
  if (Array.isArray(obj)) {
    return obj.map(item => deepSerialize(item)) as any;
  }

  // Manejo de objetos planos
  const serialized: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      serialized[key] = deepSerialize(obj[key]);
    }
  }

  return serialized;
}
