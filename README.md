# Microservicios — descomposición de un monolito de pedidos

Ejercicio de arquitectura: tomar un sistema de pedidos y partirlo en servicios que se despliegan y se caen por separado, con un API gateway como única puerta de entrada.

## Los servicios

| Servicio | De qué es dueño |
|---|---|
| `api-gateway` | Punto único de entrada; rutea a los demás servicios |
| `pedidos` | Creación y estado de los pedidos |
| `inventario` | Existencias y descuento de stock |
| `pagos` | Cobro del pedido |

Cada uno es un proceso Node.js/Express independiente, con su propio `package.json` y su propio puerto.

## Correr

Un servicio por terminal:

```bash
cd pedidos && npm install && node server.js
```

Repite para `inventario`, `pagos` y `api-gateway`. El gateway espera que los demás estén arriba; los puertos están en cada `server.js`.

## Lo que se aprende aquí

Dónde cortar los límites (por dueño del dato, no por capa técnica), qué pasa cuando un servicio no responde y por qué el gateway deja de ser trivial en cuanto hay más de dos servicios atrás.
