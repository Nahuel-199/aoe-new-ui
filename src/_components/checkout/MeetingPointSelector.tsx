"use client";

import { Box, Grid, Text } from "@chakra-ui/react";
import { MEETING_POINTS } from "@/lib/constants/meetingPoints";

interface MeetingPointSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MeetingPointSelector({
  value,
  onChange,
}: MeetingPointSelectorProps) {
  return (
    <Box display="grid" gap={2}>
      <Text
        fontFamily="mono"
        fontSize="xs"
        letterSpacing="0.08em"
        textTransform="uppercase"
        color="aoe.textMuted"
      >
        Elegí el punto de encuentro
      </Text>
      <Grid templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }} gap={2}>
        {MEETING_POINTS.map((point) => {
          const active = value === point;
          return (
            <Box
              key={point}
              as="button"
              onClick={() => onChange(point)}
              textAlign="center"
              py={3}
              px={2}
              borderRadius="10px"
              border="1px solid"
              borderColor={active ? "aoe.red" : "aoe.borderSubtle"}
              bg={active ? "aoe.surface" : "transparent"}
              cursor="pointer"
              fontSize="sm"
              fontWeight="700"
              color="aoe.text"
            >
              {point}
            </Box>
          );
        })}
      </Grid>
      <Text fontSize="xs" color="aoe.textFaint">
        Una vez que confirmes la compra, nos comunicamos para coordinar día y horario.
      </Text>
    </Box>
  );
}
