import API_URL from "./api";

// ====== Categorías estáticas (fallback en frontend) ======
export const categories = [
  { id: 1, name: "Amigurumis", icon: "🧸" },
  { id: 2, name: "Ropa", icon: "👕" },
  { id: 3, name: "Llaveros", icon: "🔑" },
  { id: 4, name: "Bolsos", icon: "👜" },
  { id: 5, name: "Hogar", icon: "🏠" },
  { id: 6, name: "Joyeria", icon: "💍" },
];

// ====== Catálogo estático con imágenes (fallback) ======
export const sampleProducts = [
  {
    id: 1,
    nombre: "Amigurumi Osito",
    descripcion: "Osito tejido a mano con lana hipoalergénica",
    precioBase: 35000,
    stock: 10,
    disponible: true,
    categoriaId: 1,
    imagenes: [
      { url: "/assets/products/product-1.jpg", descripcion: "Amigurumi osito frente" },
      { url: "/assets/products/product-1b.jpg", descripcion: "Amigurumi osito lado" },
    ],
  },
  {
    id: 2,
    nombre: "Amigurumi Conejito",
    descripcion: "Conejito tierno con orejas largas",
    precioBase: 40000,
    stock: 8,
    disponible: true,
    categoriaId: 1,
    imagenes: [
      { url: "/assets/products/product-2.jpg", descripcion: "Amigurumi conejito" },
    ],
  },
  {
    id: 3,
    nombre: "Sweater tejido",
    descripcion: "Sweater tejido a mano, talla M",
    precioBase: 80000,
    stock: 5,
    disponible: true,
    categoriaId: 2,
    imagenes: [
      { url: "/assets/products/product-3.jpg", descripcion: "Sweater tejido" },
    ],
  },
  {
    id: 4,
    nombre: "Bolso tejido",
    descripcion: "Bolso de mano tejido con patrón geométrico",
    precioBase: 60000,
    stock: 7,
    disponible: true,
    categoriaId: 4,
    imagenes: [
      { url: "/assets/products/product-4.jpg", descripcion: "Bolso tejido" },
    ],
  },
  {
    id: 5,
    nombre: "Llavero corazón",
    descripcion: "Llavero en forma de corazón con detalles",
    precioBase: 15000,
    stock: 30,
    disponible: true,
    categoriaId: 3,
    imagenes: [
      { url: "/assets/products/product-5.jpg", descripcion: "Llavero corazón" },
    ],
  },
  {
    id: 6,
    nombre: "Llavero animal",
    descripcion: "Llavero con forma de animalito",
    precioBase: 18000,
    stock: 25,
    disponible: true,
    categoriaId: 3,
    imagenes: [
      { url: "/assets/products/product-6.jpg", descripcion: "Llavero animal" },
    ],
  },
];

// ====== Helpers de mapeo ======

const mapProductFromApi = (apiProduct) => ({
  id: apiProduct.id,
  nombre: apiProduct.nombre,
  descripcion: apiProduct.descripcion,
  precioBase: apiProduct.precioBase,
  stock: apiProduct.stock,
  disponible: apiProduct.estado === 'activo',
  categoriaId: apiProduct.idCategoria,
  imagenes: apiProduct.imagenes || [
    {
      url: `/assets/products/product-${apiProduct.id}.jpg`,
      descripcion: apiProduct.nombre,
    },
  ],
});

const mapSampleToUi = (p) => ({
  id: p.id,
  nombre: p.nombre,
  descripcion: p.descripcion,
  precioBase: p.precioBase,
  stock: p.stock,
  disponible: p.disponible,
  categoriaId: p.categoriaId,
  imagenes: p.imagenes,
});

// ====== Cliente de API ======

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    let error;
    try {
      const json = JSON.parse(text);
      error = json.error || text;
    } catch {
      error = text;
    }
    throw new Error(error || `Error HTTP ${res.status}`);
  }
  return res.json();
}

const ProductService = {
  getProducts: async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await handleResponse(res);
      return data.map(mapProductFromApi);
    } catch (error) {
      console.error("Backend caído, usando sampleProducts:", error);
      return sampleProducts.map(mapSampleToUi);
    }
  },

  getProductsByCategory: async (categoryId) => {
    try {
      const res = await fetch(
        `${API_URL}/products?categoryId=${encodeURIComponent(categoryId)}`
      );
      const data = await handleResponse(res);
      return data.map(mapProductFromApi);
    } catch (error) {
      console.error("Backend caído, usando sampleProducts por categoría:", error);
      const idNum = Number(categoryId);
      return sampleProducts
        .filter(
          (p) =>
            Number(
              p.categoriaId ?? p.idCategoria ?? p.categoria_id ?? p.categoryId
            ) === idNum
        )
        .map(mapSampleToUi);
    }
  },

  getProductById: async (id) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`);
      const data = await handleResponse(res);
      return mapProductFromApi(data);
    } catch (error) {
      console.error("Error obteniendo producto, intentando fallback:", error);
      const fallback = sampleProducts.find((p) => p.id === Number(id));
      return fallback ? mapSampleToUi(fallback) : null;
    }
  },

  // (Opcional) otros métodos create/update/delete si los estás usando…
  // createProduct, updateProduct, deleteProduct...

  getCategories: async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await handleResponse(res);
      return data.map((c) => ({
        id: c.id,
        name: c.nombre,
      }));
    } catch (error) {
      console.error("Backend caído, usando categorías locales:", error);
      return categories;
    }
  },
};

export default ProductService;
