import {
  Select,
  Portal,
  createListCollection,
} from "@chakra-ui/react"

const deliveryMethods = createListCollection({
  items: [
    { label: "Envío", value: "envio" },
    { label: "Retiro", value: "retiro" },
    { label: "Reunión presencial", value: "reunion" },
  ],
})

export const DeliverySelect = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  return (
    <Select.Root
      collection={deliveryMethods}
      value={[value]}
      onValueChange={(e) => onChange(e.value[0])}
    >
      <Select.Label>Método de entrega</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Seleccionar..." />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>

      <Portal>
        <Select.Positioner>
          <Select.Content>
            {deliveryMethods.items.map((method) => (
              <Select.Item item={method} key={method.value}>
                {method.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}
