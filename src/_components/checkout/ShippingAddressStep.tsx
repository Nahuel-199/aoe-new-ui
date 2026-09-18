"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Field,
  Grid,
  Input,
  NativeSelect,
  Text,
} from "@chakra-ui/react";
import { ARGENTINE_PROVINCES } from "@/lib/constants/provinces";
import { geocodeAddress } from "@/lib/actions/geocoding.actions";
import { getShippingCost } from "@/lib/actions/shippingZone.actions";
import { ShippingAddress } from "@/types/address.types";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shipping";

const AddressMapPicker = dynamic(() => import("./AddressMapPicker"), {
  ssr: false,
  loading: () => (
    <Box
      w="full"
      h="280px"
      borderRadius="10px"
      border="1px solid"
      borderColor="aoe.borderSubtle"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="xs" color="aoe.textFaint">
        Cargando mapa...
      </Text>
    </Box>
  ),
});

interface ShippingAddressStepProps {
  address: ShippingAddress;
  onAddressChange: (address: ShippingAddress) => void;
  onCostChange: (cost: number | null) => void;
  subtotal: number;
}

const ars = (n: number) => "$" + n.toLocaleString("es-AR");

export default function ShippingAddressStep({
  address,
  onAddressChange,
  onCostChange,
  subtotal,
}: ShippingAddressStepProps) {
  const [geocoding, setGeocoding] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [costState, setCostState] = useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "free" }
    | { status: "resolved"; cost: number; zoneName: string }
    | { status: "error"; message: string }
  >({ status: "idle" });

  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  const set = (field: keyof ShippingAddress, value: string) => {
    onAddressChange({ ...address, [field]: value });
  };

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const digits = address.postalCode.replace(/\D/g, "");
    if (!address.province || digits.length < 4) {
      setCostState({ status: "idle" });
      onCostChange(null);
      return;
    }

    if (freeShipping) {
      setCostState({ status: "free" });
      onCostChange(0);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setCostState({ status: "loading" });
      const result = await getShippingCost({
        province: address.province,
        postalCode: address.postalCode,
      });

      if (result.success) {
        setCostState({ status: "resolved", cost: result.cost, zoneName: result.zoneName });
        onCostChange(result.cost);
      } else {
        setCostState({ status: "error", message: result.message });
        onCostChange(null);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address.province, address.postalCode, freeShipping]);

  const geocodeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastGeocodedQueryRef = useRef<string | null>(null);

  const performGeocode = async (query: string) => {
    setMapError(null);
    setGeocoding(true);

    const result = await geocodeAddress(query);

    setGeocoding(false);

    if (!result.success) {
      setMapError(result.message);
      return;
    }

    lastGeocodedQueryRef.current = query;
    onAddressChange({ ...address, lat: result.result.lat, lng: result.result.lng });
  };

  // Busca la dirección en el mapa automáticamente en cuanto están completos
  // calle, altura, localidad y provincia (con debounce para no golpear el
  // servicio de geocoding en cada tecla).
  useEffect(() => {
    if (geocodeDebounceRef.current) clearTimeout(geocodeDebounceRef.current);

    if (!address.street || !address.streetNumber || !address.city || !address.province) {
      return;
    }

    const query = `${address.street} ${address.streetNumber}, ${address.city}, ${address.province}, Argentina`;
    if (query === lastGeocodedQueryRef.current) return;

    geocodeDebounceRef.current = setTimeout(() => {
      performGeocode(query);
    }, 800);

    return () => {
      if (geocodeDebounceRef.current) clearTimeout(geocodeDebounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address.street, address.streetNumber, address.city, address.province]);

  const handleLocateOnMap = () => {
    if (!address.street || !address.streetNumber || !address.city || !address.province) {
      setMapError("Completá calle, altura, localidad y provincia para ubicarte en el mapa.");
      return;
    }

    const query = `${address.street} ${address.streetNumber}, ${address.city}, ${address.province}, Argentina`;
    performGeocode(query);
  };

  return (
    <Box display="grid" gap={4}>
      <Text fontSize="xs" color="aoe.textSubtle" bg="aoe.surface" borderRadius="8px" p={3}>
        ⏱ Tené en cuenta que la prenda puede demorar 5 días o más en estar lista antes de
        despacharse.
      </Text>

      <Grid templateColumns={{ base: "1fr", sm: "2fr 1fr" }} gap={3}>
        <Field.Root required>
          <Field.Label>Calle</Field.Label>
          <Input value={address.street} onChange={(e) => set("street", e.target.value)} />
        </Field.Root>
        <Field.Root required>
          <Field.Label>Altura</Field.Label>
          <Input
            value={address.streetNumber}
            onChange={(e) => set("streetNumber", e.target.value)}
          />
        </Field.Root>
      </Grid>

      <Grid templateColumns={{ base: "1fr", sm: "1fr 2fr" }} gap={3}>
        <Field.Root>
          <Field.Label>Piso / Depto (opcional)</Field.Label>
          <Input value={address.floorApt ?? ""} onChange={(e) => set("floorApt", e.target.value)} />
        </Field.Root>
        <Field.Root required>
          <Field.Label>Localidad</Field.Label>
          <Input value={address.city} onChange={(e) => set("city", e.target.value)} />
        </Field.Root>
      </Grid>

      <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={3}>
        <Field.Root required>
          <Field.Label>Provincia</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={address.province}
              onChange={(e) => set("province", e.target.value)}
            >
              <option value="">Elegí una provincia</option>
              {ARGENTINE_PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>
        <Field.Root required>
          <Field.Label>Código postal</Field.Label>
          <Input
            value={address.postalCode}
            onChange={(e) => set("postalCode", e.target.value)}
            placeholder="Ej: 1425"
          />
        </Field.Root>
      </Grid>

      {costState.status === "loading" && (
        <Text fontSize="xs" color="aoe.textFaint">
          Calculando costo de envío...
        </Text>
      )}
      {costState.status === "free" && (
        <Text fontSize="xs" color="aoe.textSubtle">
          🎉 ¡Envío gratis! Superaste los {ars(FREE_SHIPPING_THRESHOLD)} en productos.
        </Text>
      )}
      {costState.status === "resolved" && (
        <Text fontSize="xs" color="aoe.textSubtle">
          Envío a zona {costState.zoneName}: <strong>{ars(costState.cost)}</strong>
        </Text>
      )}
      {costState.status === "error" && (
        <Text fontSize="xs" color="aoe.red">
          {costState.message}
        </Text>
      )}

      <Box>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLocateOnMap}
          loading={geocoding}
        >
          Buscar de nuevo en el mapa
        </Button>
        {geocoding && (
          <Text fontSize="xs" color="aoe.textFaint" mt={2}>
            Buscando tu dirección en el mapa...
          </Text>
        )}
        {mapError && !geocoding && (
          <Text fontSize="xs" color="aoe.red" mt={2}>
            {mapError}
          </Text>
        )}
      </Box>

      <AddressMapPicker
        lat={address.lat}
        lng={address.lng}
        onPositionChange={(lat, lng) => onAddressChange({ ...address, lat, lng })}
      />
      <Text fontSize="xs" color="aoe.textFaint">
        Buscamos tu dirección en el mapa automáticamente. Podés arrastrar el pin o tocar
        el mapa para ajustar el punto exacto de entrega.
      </Text>
    </Box>
  );
}
