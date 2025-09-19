'use client';

import { Box, Button, Flex, Heading, Image, Stack, useBreakpointValue } from "@chakra-ui/react";

interface LoginSectionProps {
  handleLogin: () => void;
}

export default function LoginSection({ handleLogin }: LoginSectionProps) {
    const flexDir = useBreakpointValue({ base: "column", md: "row" });

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            bg="white"
            _dark={{ bg: "black" }}
            minH={{ base: "50vh", md: "80vh" }}
            p={{ base: 4, md: 8 }}
        >
            <Box
                bg="white"
                boxShadow="lg"
                borderRadius="lg"
                overflow="hidden"
                w={{ base: "95%", md: "80%", lg: "70%" }}
                maxW="600px"
            >
                <Flex direction={flexDir}>
                    <Box flex="1" bg="blue.500" display={{ base: "none", md: "block" }}>
                        <Image
                            src="/login_image.jpeg"
                            alt="Admin Login"
                            objectFit="cover"
                            w="100%"
                            h="100%"
                        />
                    </Box>
                    <Box flex="1" p={{ base: 6, md: 8 }}>
                        <Heading
                            as="h2"
                            size="lg"
                            textAlign="center"
                            mb="6"
                            color="black"
                            _dark={{ color: "dark" }}
                        >
                            ¡Bienvenido!
                        </Heading>
                        <Stack
                            align="center"
                        >
                            <form action={handleLogin}>
                                <Button
                                    type="submit"
                                    maxWidth={"320px"}
                                    display={"flex"}
                                    justifyContent={"center"}
                                    padding={"0.5rem 1.4rem"}
                                    fontSize={"0.875rem"}
                                    fontWeight={700}
                                    lineHeight={"1.25rem"}
                                    textAlign={"center"}
                                    textTransform={"uppercase"}
                                    verticalAlign={"middle"}
                                    alignItems={"center"}
                                    borderRadius={"0.5rem"}
                                    border={"1px solid rgba(0,0,0,0.25)"}
                                    gap={"0.75ren"}
                                    color={"rgb(65, 63, 63)"}
                                    bg={"#fff"}
                                    cursor={"pointer"}
                                    transition={"all .6s ease"}
                                    _hover={{ transform: "scale(1.02)" }}
                                    loadingText="Iniciando..."
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        preserveAspectRatio="xMidYMid"
                                        viewBox="0 0 256 262"
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
                                    Iniciar Sesión con Google
                                </Button>
                            </form>
                        </Stack>
                    </Box>
                </Flex>
            </Box>
        </Flex>
    )
}
