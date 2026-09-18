'use client';

import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";

interface LoginSectionProps {
  handleLogin: () => void;
}

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    viewBox="0 0 256 262"
    width="18"
    height="18"
  >
    <path
      fill="#4285F4"
      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
    ></path>
    <path
      fill="#34A853"
      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
    ></path>
    <path
      fill="#FBBC05"
      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
    ></path>
    <path
      fill="#EB4335"
      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
    ></path>
  </svg>
);

export default function LoginSection({ handleLogin }: LoginSectionProps) {
  return (
    <Flex align="center" justify="center" px={{ base: 4, md: 5 }} py={{ base: 10, md: 16 }}>
      <Box
        w="100%"
        maxW="1060px"
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
        border="1px solid"
        borderColor="aoe.borderSubtle"
        borderRadius="26px"
        overflow="hidden"
        bg="aoe.bgAlt"
        animation="aoeUp 0.5s ease both"
      >
        <Box
          position="relative"
          minH="440px"
          bg="aoe.tile"
          display={{ base: "none", md: "block" }}
        >
          <Image
            src="/login_image.jpeg"
            alt="AOE"
            position="absolute"
            inset={0}
            w="100%"
            h="100%"
            objectFit="cover"
            opacity={0.85}
          />
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear-gradient(180deg, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.55) 55%, rgba(10,10,10,0.95) 100%)"
          />
          <Flex position="relative" h="100%" direction="column" justify="space-between" p={7}>
            <Flex
              alignSelf="flex-start"
              align="center"
              gap={2}
              border="1px solid"
              borderColor="rgba(245,245,245,0.25)"
              borderRadius="pill"
              px={3}
              py="6px"
              fontFamily="mono"
              fontSize="10px"
              letterSpacing="0.16em"
              textTransform="uppercase"
              bg="rgba(10,10,10,0.5)"
              backdropFilter="blur(6px)"
            >
              <Box as="span" w="6px" h="6px" borderRadius="pill" bg="aoe.red" />
              Miembros AOE
            </Flex>
            <Box>
              <Heading
                as="h2"
                fontFamily="heading"
                fontSize="clamp(34px, 4vw, 52px)"
                lineHeight="0.88"
                textTransform="uppercase"
                m={0}
              >
                Tu cuenta,
                <br />
                <Box as="span" color="aoe.red">tus drops</Box>
              </Heading>
              <Text mt={3.5} color="aoe.textMuted" fontSize="15px" lineHeight="1.5" maxW="320px">
                Guardá tus talles, seguí tus pedidos y accedé primero a cada lanzamiento.
              </Text>
            </Box>
          </Flex>
        </Box>

        <Flex direction="column" gap={5} p={{ base: 8, md: "36px 32px 40px" }}>
          <Box>
            <Heading as="h1" fontFamily="heading" fontSize="34px" lineHeight="1" textTransform="uppercase" m={0}>
              Bienvenido de vuelta
            </Heading>
            <Text mt={2.5} color="aoe.textSubtle" fontSize="14px" lineHeight="1.5">
              Ingresá para ver tus pedidos, guardar tus talles y acceder primero a cada lanzamiento.
            </Text>
          </Box>

          <form action={handleLogin}>
            <Button
              type="submit"
              w="100%"
              h="52px"
              border="1px solid"
              borderColor="aoe.borderControl"
              borderRadius="14px"
              bg="aoe.text"
              color="aoe.bg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={3}
              fontSize="13px"
              fontWeight="800"
              letterSpacing="0.08em"
              textTransform="uppercase"
              loadingText="Iniciando..."
              _hover={{ bg: "white", borderColor: "aoe.text" }}
            >
              <GoogleIcon />
              Continuar con Google
            </Button>
          </form>

          <Text m={0} color="aoe.textGhost" fontSize="12px" lineHeight="1.55">
            Protegemos tus datos. Nunca compartimos tu email.
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
