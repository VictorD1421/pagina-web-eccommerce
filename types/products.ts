export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_bs?: number;
  stock: number;
  imagen_url: string;
  categoria: string;
}