import { Input, InputGroup } from "@chakra-ui/react";

interface FilterInputProps {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
}

export const FilterInput = ({ value, onChange, placeholder, icon }: FilterInputProps) => (
    <InputGroup flex="1" startElement={icon}>
        <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rounded="full"
        />
    </InputGroup>
);
