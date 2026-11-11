import type { Carta, Extra, Ingrediente, Tamano } from '../tipos/carta'

// Datos falsos con la misma forma que devolverá GET /api/carta.
// Cuando exista la API, se borra este archivo y se reemplaza por un fetch.

const tamanos: Tamano[] = [
  { id: 1, nombre: 'Simple', precioAdicional: 0 },
  { id: 2, nombre: 'Doble', precioAdicional: 2500 },
  { id: 3, nombre: 'Triple', precioAdicional: 4500 },
]

const extras: Extra[] = [
  { id: 1, nombre: 'Cheddar extra', precio: 600 },
  { id: 2, nombre: 'Bacon', precio: 900 },
  { id: 3, nombre: 'Huevo', precio: 500 },
]

const ingredientes: Ingrediente[] = [
  { id: 1, nombre: 'Cebolla' },
  { id: 2, nombre: 'Tomate' },
  { id: 3, nombre: 'Lechuga' },
  { id: 4, nombre: 'Pickles' },
]

// Un producto que no se personaliza no necesita estas listas
const sinPersonalizar = { esPersonalizable: false, tamanos: [], extras: [], ingredientes: [] }
const personalizable = { esPersonalizable: true, tamanos, extras, ingredientes }

export const cartaMock: Carta = [
  {
    id: 1,
    nombre: 'Burgers',
    productos: [
      {
        id: 1,
        nombre: 'Clásica',
        descripcion: 'Medallón de carne, cheddar, lechuga, tomate y salsa de la casa.',
        precio: 8500,
        imagenUrl: null,
        disponible: true,
        ...personalizable,
      },
      {
        id: 2,
        nombre: 'Cheddar Bacon',
        descripcion: 'Doble cheddar, bacon crocante, cebolla caramelizada y barbacoa.',
        precio: 10200,
        imagenUrl: null,
        disponible: true,
        ...personalizable,
      },
      {
        id: 3,
        nombre: 'Crispy Chicken',
        descripcion: 'Pollo crocante, lechuga, pickles y mayonesa de ajo.',
        precio: 9300,
        imagenUrl: null,
        disponible: false,
        ...personalizable,
      },
    ],
  },
  {
    id: 2,
    nombre: 'Combos',
    productos: [
      {
        id: 4,
        nombre: 'Combo Clásica',
        descripcion: 'Burger Clásica, papas medianas y gaseosa 500 ml.',
        precio: 12900,
        imagenUrl: null,
        disponible: true,
        ...sinPersonalizar,
      },
      {
        id: 5,
        nombre: 'Combo Cheddar Bacon',
        descripcion: 'Burger Cheddar Bacon, papas medianas y gaseosa 500 ml.',
        precio: 14800,
        imagenUrl: null,
        disponible: true,
        ...sinPersonalizar,
      },
    ],
  },
  {
    id: 3,
    nombre: 'Papas',
    productos: [
      {
        id: 6,
        nombre: 'Papas fritas',
        descripcion: 'Porción mediana de papas fritas con sal.',
        precio: 4200,
        imagenUrl: null,
        disponible: true,
        ...sinPersonalizar,
      },
      {
        id: 7,
        nombre: 'Papas con cheddar',
        descripcion: 'Papas fritas bañadas en salsa cheddar y bacon.',
        precio: 6100,
        imagenUrl: null,
        disponible: true,
        ...sinPersonalizar,
      },
    ],
  },
  {
    id: 4,
    nombre: 'Bebidas',
    productos: [
      {
        id: 8,
        nombre: 'Gaseosa 500 ml',
        descripcion: 'Cola, lima-limón o naranja.',
        precio: 2500,
        imagenUrl: null,
        disponible: true,
        ...sinPersonalizar,
      },
      {
        id: 9,
        nombre: 'Cerveza artesanal',
        descripcion: 'Lata de 473 ml, rubia o roja.',
        precio: 4800,
        imagenUrl: null,
        disponible: true,
        ...sinPersonalizar,
      },
    ],
  },
]
