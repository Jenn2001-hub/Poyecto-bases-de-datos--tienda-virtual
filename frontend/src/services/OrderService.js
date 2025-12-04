import API_URL from "./api";

const OrderService = {
  createOrder: async (orderData) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });

    if (!res.ok) throw new Error("No se pudo crear el pedido");
    return res.json();
  },

  getOrders: async (userId) => {
    const res = await fetch(`${API_URL}/orders/user/${userId}`);
    if (!res.ok) throw new Error("Error obteniendo pedidos");
    return res.json();
  },

  getOrderById: async (orderId) => {
    const res = await fetch(`${API_URL}/orders/${orderId}`);
    if (!res.ok) throw new Error("Pedido no encontrado");
    return res.json();
  }
};

export default OrderService;
