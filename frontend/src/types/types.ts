export type StateCode = 
  | 'AS' | 'BC' | 'BS' | 'CC' | 'CS' | 'CH' | 'DF' | 'CL' | 'CM' | 'DG'
  | 'GT' | 'GR' | 'HG' | 'JC' | 'MC' | 'MN' | 'MS' | 'NT' | 'NL' | 'OC'
  | 'PL' | 'QT' | 'QR' | 'SP' | 'SL' | 'SR' | 'TC' | 'TS' | 'TL' | 'VZ'
  | 'YN' | 'ZS' | 'NE';

export interface FederalEntity {
  code: StateCode;
  name: string;
}

export const FEDERAL_ENTITIES: FederalEntity[] = [
  { code: 'AS' as StateCode, name: 'Aguascalientes' },
  { code: 'BC' as StateCode, name: 'Baja California' },
  { code: 'BS' as StateCode, name: 'Baja California Sur' },
  { code: 'CC' as StateCode, name: 'Campeche' },
  { code: 'CS' as StateCode, name: 'Chiapas' },
  { code: 'CH' as StateCode, name: 'Chihuahua' },
  { code: 'DF' as StateCode, name: 'Ciudad de México' },
  { code: 'CL' as StateCode, name: 'Coahuila' },
  { code: 'CM' as StateCode, name: 'Colima' },
  { code: 'DG' as StateCode, name: 'Durango' },
  { code: 'GT' as StateCode, name: 'Guanajuato' },
  { code: 'GR' as StateCode, name: 'Guerrero' },
  { code: 'HG' as StateCode, name: 'Hidalgo' },
  { code: 'JC' as StateCode, name: 'Jalisco' },
  { code: 'MC' as StateCode, name: 'Estado de México' },
  { code: 'MN' as StateCode, name: 'Michoacán' },
  { code: 'MS' as StateCode, name: 'Morelos' },
  { code: 'NT' as StateCode, name: 'Nayarit' },
  { code: 'NL' as StateCode, name: 'Nuevo León' },
  { code: 'OC' as StateCode, name: 'Oaxaca' },
  { code: 'PL' as StateCode, name: 'Puebla' },
  { code: 'QT' as StateCode, name: 'Querétaro' },
  { code: 'QR' as StateCode, name: 'Quintana Roo' },
  { code: 'SP' as StateCode, name: 'San Luis Potosí' },
  { code: 'SL' as StateCode, name: 'Sinaloa' },
  { code: 'SR' as StateCode, name: 'Sonora' },
  { code: 'TC' as StateCode, name: 'Tabasco' },
  { code: 'TS' as StateCode, name: 'Tamaulipas' },
  { code: 'TL' as StateCode, name: 'Tlaxcala' },
  { code: 'VZ' as StateCode, name: 'Veracruz' },
  { code: 'YN' as StateCode, name: 'Yucatán' },
  { code: 'ZS' as StateCode, name: 'Zacatecas' },
  { code: 'NE' as StateCode, name: 'Nacido en el extranjero' },
].sort((a, b) => a.name.localeCompare(b.name, 'es'));