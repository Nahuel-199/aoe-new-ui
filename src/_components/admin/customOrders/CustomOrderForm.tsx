"use client";

import { createCustomOrder } from "@/lib/actions/customOrder.action";
import { Box, Heading, VStack } from "@chakra-ui/react";
import { useActionState, useState } from "react";

const initialState = { message: "" };

export default function CustomOrderForm() {
    const [state, formAction, pending] = useActionState(createCustomOrder, initialState);

    const [items, setItems] = useState([
        { name: "", description: "", color: "", size: "", quantity: 1, price: 0 },
    ]);

    const addItem = () => {
        setItems([...items, { name: "", description: "", color: "", size: "", quantity: 1, price: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, field: string, value: string | number) => {
        const updated = [...items];
        (updated[index] as any)[field] = value;
        setItems(updated);
    };

    return (
        <Box maxW="6xl" mx="auto" p={6}>
            <Heading size="lg" mb={6}>
                Crear Pedido Personalizado
            </Heading>
            <VStack gap={6} align="stretch">

            <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "400px" }}>
                <h2>Datos del cliente</h2>

                <label>
                    Nombre del cliente:
                    <input type="text" name="clientName" required />
                </label>

                <label>
                    Teléfono:
                    <input type="text" name="phoneNumber" />
                </label>

                <label>
                    Email:
                    <input type="email" name="email" />
                </label>

                <hr />
                <h2>Productos</h2>

                {items.map((item, index) => (
                    <div key={index} style={{ border: "1px solid #ccc", padding: "1rem" }}>
                        <label>
                            Nombre:
                            <input
                                type="text"
                                name={`items[${index}][name]`}
                                value={item.name}
                                onChange={(e) => handleItemChange(index, "name", e.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Descripción:
                            <input
                                type="text"
                                name={`items[${index}][description]`}
                                value={item.description}
                                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                            />
                        </label>

                        <label>
                            Color:
                            <input
                                type="text"
                                name={`items[${index}][color]`}
                                value={item.color}
                                onChange={(e) => handleItemChange(index, "color", e.target.value)}
                            />
                        </label>

                        <label>
                            Talle:
                            <input
                                type="text"
                                name={`items[${index}][size]`}
                                value={item.size}
                                onChange={(e) => handleItemChange(index, "size", e.target.value)}
                            />
                        </label>

                        <label>
                            Cantidad:
                            <input
                                type="number"
                                name={`items[${index}][quantity]`}
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                            />
                        </label>

                        <label>
                            Precio:
                            <input
                                type="number"
                                name={`items[${index}][price]`}
                                min="0"
                                step="0.01"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, "price", Number(e.target.value))}
                            />
                        </label>

                        {items.length > 1 && (
                            <button type="button" onClick={() => removeItem(index)}>
                                Eliminar producto
                            </button>
                        )}
                    </div>
                ))}

                <button type="button" onClick={addItem}>
                    + Agregar producto
                </button>

                <hr />
                <h2>Totales y entrega</h2>

                <label>
                    Total:
                    <input type="number" name="total" min="0" step="0.01" required />
                </label>

                <label>
                    Monto pagado:
                    <input type="number" name="paidAmount" min="0" step="0.01" />
                </label>

                <label>
                    Monto restante:
                    <input type="number" name="remainingAmount" min="0" step="0.01" />
                </label>

                <label>
                    Costo de envío:
                    <input type="number" name="deliveryCost" min="0" step="0.01" />
                </label>

                <label>
                    Método de entrega:
                    <input type="text" name="deliveryMethod" />
                </label>

                <label>
                    Dirección de envío:
                    <input type="text" name="shippingAddress" />
                </label>

                <label>
                    Dirección de encuentro:
                    <input type="text" name="meetingAddress" />
                </label>

                <hr />
                <h2>Estado</h2>

                <label>
                    Estado de la orden:
                    <select name="status" defaultValue="pending">
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En progreso</option>
                        <option value="completed">Completada</option>
                        <option value="cancelled">Cancelada</option>
                    </select>
                </label>

                <label>
                    Estado de pago:
                    <select name="paymentStatus" defaultValue="pending">
                        <option value="pending">Pendiente</option>
                        <option value="paid">Pagado</option>
                        <option value="refunded">Reembolsado</option>
                    </select>
                </label>

                <hr />
                <h2>Notas</h2>

                <label>
                    Comentarios:
                    <textarea name="comments" rows={3} />
                </label>

                <label>
                    Notas de diseño:
                    <textarea name="designNotes" rows={3} />
                </label>

                <button type="submit" disabled={pending}>
                    {pending ? "Creando..." : "Crear orden"}
                </button>
            </form>
            </VStack>
        </Box>
    );
}
