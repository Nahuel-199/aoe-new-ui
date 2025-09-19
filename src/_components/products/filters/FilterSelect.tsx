import { ListCollection, Portal, Select } from "@chakra-ui/react";

interface FilterItem {
  value: string;
  label: string;
}

interface FilterSelectProps {
  collection: ListCollection<FilterItem>;
  value: string[];
  onValueChange: (v: string[]) => void;
  label?: string;
  placeholder?: string;
  width?: string | number;
}

export const FilterSelect = ({
  collection,
  value,
  onValueChange,
  label,
  placeholder,
  width,
}: FilterSelectProps) => (
  <Select.Root collection={collection} value={value} onValueChange={(e) => onValueChange(e.value)} width={width || "200px"}>
    <Select.HiddenSelect />
    <Select.Label>{placeholder}</Select.Label>
    <Select.Control>
      <Select.Trigger>
        <Select.ValueText placeholder={placeholder} />
      </Select.Trigger>
      <Select.IndicatorGroup>
        <Select.Indicator />
      </Select.IndicatorGroup>
    </Select.Control>
    <Portal>
      <Select.Positioner>
        <Select.Content>
          {(collection.items as FilterItem[]).map((item: FilterItem) => (
            <Select.Item key={item.value} item={item}>
              {item.label}
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Portal>
  </Select.Root>
);
