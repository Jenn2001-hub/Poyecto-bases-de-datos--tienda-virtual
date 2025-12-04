class PaymentStrategy {
  static getStrategy(method) {
    switch (method) {
      case 'tarjeta':
        return new CardPayment();
      case 'paypal':
        return new PayPalPayment();
      case 'contraentrega':
        return new CashOnDelivery();
      default:
        throw new Error('Método de pago no soportado');
    }
  }
}

class CardPayment {
  pagar(monto) {
    console.log(`Pagando $${monto} con tarjeta de crédito/débito`);
    // Simular procesamiento de pago
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1500);
    });
  }
}

class PayPalPayment {
  pagar(monto) {
    console.log(`Pagando $${monto} con PayPal`);
    // Simular procesamiento de pago
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1500);
    });
  }
}

class CashOnDelivery {
  pagar(monto) {
    console.log(`Pago contra entrega por $${monto}`);
    // No se procesa inmediatamente
    return Promise.resolve(true);
  }
}

export default PaymentStrategy;