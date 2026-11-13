// Seed: carga datos de prueba en la base.
// Se corre desde apps/api con: npx prisma db seed
// ATENCIÓN: borra TODOS los datos antes de cargar. Nunca correrlo contra producción.

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { PrismaClient, Rol } from '../src/generated/prisma/client.js';

// Conexión a la base
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Lee una variable del .env y corta el seed si no existe
function variableRequerida(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) {
    throw new Error(`Falta la variable ${nombre} en apps/api/.env`);
  }
  return valor;
}

// ---------- Limpieza ----------

// Vacía todas las tablas y reinicia los ids en 1
async function limpiar() {
  await prisma.$executeRaw`
    TRUNCATE TABLE
      "PedidoCambioEstado", "PedidoItemSinIngrediente", "PedidoItemExtra",
      "PedidoItem", "Pedido",
      "ProductoTamano", "ProductoExtra", "ProductoIngrediente",
      "Producto", "Categoria", "Tamano", "Extra", "Ingrediente",
      "HorarioAtencion", "ConfiguracionLocal", "ZonaEnvio", "Usuario"
    RESTART IDENTITY CASCADE
  `;
}

// ---------- Configuración, horarios y zonas ----------

async function cargarConfiguracion() {
  // diaSemana: 0 = domingo, 1 = lunes ... 6 = sábado. El lunes (1) está cerrado.
  const noche = [0, 2, 3, 4, 5, 6].map((dia) => ({
    diaSemana: dia,
    abre: '20:00',
    cierra: '00:30',
  }));
  // Viernes y sábado también abren al mediodía (dos turnos en el mismo día)
  const mediodia = [5, 6].map((dia) => ({
    diaSemana: dia,
    abre: '12:00',
    cierra: '15:00',
  }));

  await prisma.configuracionLocal.create({
    data: {
      nombreLocal: 'Hamburguesería de prueba',
      telefono: '1100000000',
      aliasTransferencia: 'hamburgueseria.prueba',
      cbu: '0000000000000000000000',
      // minutosAlerta, horaCorteDia y pedidosPausados toman su @default del schema
      horarios: { create: [...mediodia, ...noche] },
    },
  });
}

async function cargarZonas() {
  await prisma.zonaEnvio.createMany({
    data: [
      { nombre: 'Centro', costo: 1000 },
      { nombre: 'Barrio Norte', costo: 1500 },
      { nombre: 'Afueras', costo: 2500 },
    ],
  });
}

// ---------- Catálogo ----------

type ConId = { id: number };

// Arma los datos de un producto personalizable: qué tamaños, extras e
// ingredientes acepta (las filas de las tablas puente)
function personalizacion(opciones: {
  tamanos?: ConId[];
  extras?: ConId[];
  ingredientes?: ConId[];
}) {
  return {
    esPersonalizable: true,
    tamanos: { create: (opciones.tamanos ?? []).map((t) => ({ tamanoId: t.id })) },
    extras: { create: (opciones.extras ?? []).map((e) => ({ extraId: e.id })) },
    ingredientes: {
      create: (opciones.ingredientes ?? []).map((i) => ({ ingredienteId: i.id })),
    },
  };
}

async function cargarCatalogo() {
  const [burgers, combos, papas, bebidas] = await prisma.categoria.createManyAndReturn({
    data: [
      { nombre: 'Burgers', orden: 1 },
      { nombre: 'Combos', orden: 2 },
      { nombre: 'Papas', orden: 3 },
      { nombre: 'Bebidas', orden: 4 },
    ],
  });

  const tamanos = await prisma.tamano.createManyAndReturn({
    data: [
      { nombre: 'Simple', precioAdicional: 0, orden: 1 },
      { nombre: 'Doble', precioAdicional: 2000, orden: 2 },
      { nombre: 'Triple', precioAdicional: 3500, orden: 3 },
    ],
  });
  const [simple, doble] = tamanos;

  const [cheddar, bacon, huevo, cebollaCaramelizada, jalapenos] =
    await prisma.extra.createManyAndReturn({
      data: [
        { nombre: 'Cheddar extra', precio: 800 },
        { nombre: 'Bacon', precio: 1200 },
        { nombre: 'Huevo', precio: 700 },
        { nombre: 'Cebolla caramelizada', precio: 600 },
        // Sin stock: sirve para probar que la carta no muestra extras no disponibles
        { nombre: 'Jalapeños', precio: 500, disponible: false },
      ],
    });
  const extrasBurger = [cheddar, bacon, huevo, cebollaCaramelizada, jalapenos];

  const [cebolla, pepinos, salsa, tomate, lechuga] =
    await prisma.ingrediente.createManyAndReturn({
      data: [
        { nombre: 'Cebolla' },
        { nombre: 'Pepinos' },
        { nombre: 'Salsa de la casa' },
        { nombre: 'Tomate' },
        { nombre: 'Lechuga' },
      ],
    });

  // Los productos se crean en este orden, así los ids van del 1 al 12
  const productos = [
    // Burgers
    {
      categoriaId: burgers.id,
      nombre: 'Cheese Burger',
      descripcion: 'Carne smash, doble cheddar, cebolla, pepinos y salsa de la casa',
      precio: 7500,
      ...personalizacion({
        tamanos,
        extras: extrasBurger,
        ingredientes: [cebolla, pepinos, salsa],
      }),
    },
    {
      categoriaId: burgers.id,
      nombre: 'Bacon Burger',
      descripcion: 'Carne smash, cheddar, bacon crocante, cebolla y salsa de la casa',
      precio: 8500,
      ...personalizacion({
        tamanos,
        extras: extrasBurger,
        ingredientes: [cebolla, salsa],
      }),
    },
    {
      categoriaId: burgers.id,
      nombre: 'Clásica',
      descripcion: 'Carne, queso tybo, lechuga, tomate y cebolla',
      precio: 7000,
      ...personalizacion({
        tamanos,
        extras: extrasBurger,
        ingredientes: [lechuga, tomate, cebolla],
      }),
    },
    {
      categoriaId: burgers.id,
      nombre: 'Veggie Burger',
      descripcion: 'Medallón de garbanzos, cheddar, lechuga y tomate',
      precio: 8000,
      ...personalizacion({
        tamanos: [simple, doble],
        extras: [cheddar, huevo],
        ingredientes: [lechuga, tomate],
      }),
    },
    // Combos
    {
      categoriaId: combos.id,
      nombre: 'Combo Cheese',
      descripcion: 'Cheese Burger simple + papas fritas + bebida',
      precio: 11000,
    },
    {
      categoriaId: combos.id,
      nombre: 'Combo Bacon',
      descripcion: 'Bacon Burger simple + papas fritas + bebida',
      precio: 12000,
    },
    {
      categoriaId: combos.id,
      nombre: 'Combo para dos',
      descripcion: 'Dos burgers simples a elección + papas grandes + dos bebidas',
      precio: 21000,
    },
    // Papas
    {
      categoriaId: papas.id,
      nombre: 'Papas fritas',
      descripcion: 'Porción de papas fritas con sal',
      precio: 4000,
      ...personalizacion({ extras: [cheddar, bacon] }),
    },
    {
      categoriaId: papas.id,
      nombre: 'Papas cheddar y bacon',
      descripcion: 'Papas fritas con salsa cheddar y bacon crocante',
      precio: 6000,
    },
    {
      categoriaId: papas.id,
      nombre: 'Aros de cebolla',
      descripcion: 'Ocho aros de cebolla rebozados',
      precio: 4500,
    },
    // Bebidas
    {
      categoriaId: bebidas.id,
      nombre: 'Agua 500ml',
      descripcion: null,
      precio: 1500,
    },
    {
      categoriaId: bebidas.id,
      nombre: 'Coca-Cola 500ml',
      descripcion: null,
      precio: 2000,
      // Sin stock por hoy: la carta lo muestra deshabilitado
      disponible: false,
    },
  ];

  for (const [indice, producto] of productos.entries()) {
    await prisma.producto.create({
      data: { ...producto, orden: indice + 1 },
    });
  }
}

// ---------- Usuarios ----------

async function cargarUsuarios() {
  const usuarios = [
    {
      nombre: 'Administrador',
      email: 'admin@hamburgueseria.local',
      rol: Rol.ADMIN,
      variable: 'SEED_PASSWORD_ADMIN',
    },
    {
      nombre: 'Caja',
      email: 'caja@hamburgueseria.local',
      rol: Rol.CAJA,
      variable: 'SEED_PASSWORD_CAJA',
    },
    {
      nombre: 'Cocina',
      email: 'cocina@hamburgueseria.local',
      rol: Rol.COCINA,
      variable: 'SEED_PASSWORD_COCINA',
    },
  ];

  for (const usuario of usuarios) {
    // 10 = "costo" del hash: cuántas vueltas hace bcrypt. Más alto, más lento de adivinar.
    const passwordHash = await bcrypt.hash(variableRequerida(usuario.variable), 10);
    await prisma.usuario.create({
      data: {
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        passwordHash,
      },
    });
  }
}

// ---------- Principal ----------

async function main() {
  console.log('Limpiando la base...');
  await limpiar();

  console.log('Cargando configuración, horarios y zonas...');
  await cargarConfiguracion();
  await cargarZonas();

  console.log('Cargando catálogo...');
  await cargarCatalogo();

  console.log('Cargando usuarios...');
  await cargarUsuarios();

  console.log('Seed terminado.');
}

main()
  .catch((error) => {
    console.error('Error en el seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });