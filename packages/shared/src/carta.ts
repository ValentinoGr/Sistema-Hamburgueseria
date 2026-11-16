export interface CartaTamano {
  id: number;
  nombre: string;
  precioAdicional: number;
}

export interface CartaExtra {
  id: number;
  nombre: string;
  precio: number;
}

export interface CartaIngrediente {
  id: number;
  nombre: string;
}

export interface CartaProducto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagenUrl: string | null;
  disponible: boolean;
  esPersonalizable: boolean;
  tamanos: CartaTamano[];
  extras: CartaExtra[];
  ingredientes: CartaIngrediente[];
}

export interface CartaCategoria {
  id: number;
  nombre: string;
  productos: CartaProducto[];
}