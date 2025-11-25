"use client";

import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    IconButton,
    Badge,
    VStack,
    Text,
    HStack,
    Spinner,
} from "@chakra-ui/react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from "@/lib/actions/notification.actions";
import { FaRegBell, FaTrash } from "react-icons/fa";
import { Notification } from "@/models/notification.model";
import { useRouter } from "next/navigation";

type ClientNotification = Omit<Notification, "_id" | "userId" | "orderId"> & {
    _id: string;
    userId: string;
    orderId?: string;
};

const NotificationBell = ({ userId }: { userId: string }) => {
    const [notifications, setNotifications] = useState<ClientNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const ref = useRef<HTMLDivElement>(null);

    useOutsideClick({
        ref: ref,
        handler: () => setIsOpen(false),
    });

    const fetchNotifications = async () => {
        try {
            const data = await getUserNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 300000); // Poll every 5 minutes
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleNotificationClick = async (notification: ClientNotification) => {
        if (!notification.isRead && notification._id) {
            await markNotificationAsRead(notification._id);
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === notification._id ? { ...n, isRead: true } : n
                )
            );
        }
        if (notification.orderId) {
            router.push(`/mis-pedidos`);
            setIsOpen(false);
        }
    };

    const handleMarkAllRead = async () => {
        await markAllNotificationsAsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const handleDeleteNotification = async (
        e: React.MouseEvent,
        notificationId: string
    ) => {
        e.stopPropagation();
        await deleteNotification(notificationId);
        setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    };

    return (
        <Box position="relative" ref={ref}>
            <IconButton
                aria-label="Notifications"
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                _dark={{ color: "blackAlpha.900", _hover: { bg: "gray.300" } }}
            >
                <FaRegBell />
            </IconButton>
            {unreadCount > 0 && (
                <Badge
                    colorPalette="red"
                    borderRadius="full"
                    position="absolute"
                    top={0}
                    right={-1}
                    fontSize="0.7em"
                    px={2}
                >
                    {unreadCount}
                </Badge>
            )}

            {isOpen && (
                <Box
                    position="absolute"
                    top="100%"
                    right={0}
                    mt={2}
                    w="300px"
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                    boxShadow="lg"
                    borderRadius="md"
                    zIndex={20}
                    maxH="400px"
                    overflowY="auto"
                    borderWidth="1px"
                >
                    <HStack
                        justify="space-between"
                        p={3}
                        borderBottomWidth="1px"
                        bg="gray.50"
                        _dark={{ bg: "gray.700" }}
                    >
                        <Text fontWeight="bold" fontSize="sm">
                            Notificaciones
                        </Text>
                        {unreadCount > 0 && (
                            <Text
                                fontSize="xs"
                                color="blue.500"
                                cursor="pointer"
                                onClick={handleMarkAllRead}
                                _hover={{ textDecoration: "underline" }}
                            >
                                Marcar todas leídas
                            </Text>
                        )}
                    </HStack>

                    {loading ? (
                        <Box p={4} textAlign="center">
                            <Spinner size="sm" />
                        </Box>
                    ) : notifications.length === 0 ? (
                        <Box p={4} textAlign="center">
                            <Text fontSize="sm" color="gray.500">
                                No tienes notificaciones
                            </Text>
                        </Box>
                    ) : (
                        <VStack gap={0} align="stretch">
                            {notifications.map((notification) => (
                                <Box
                                    key={notification._id}
                                    p={3}
                                    cursor="pointer"
                                    bg={notification.isRead ? "transparent" : "blue.50"}
                                    _dark={{
                                        bg: notification.isRead ? "transparent" : "whiteAlpha.100",
                                        _hover: { bg: "whiteAlpha.200" },
                                    }}
                                    _hover={{ bg: "gray.50" }}
                                    onClick={() => handleNotificationClick(notification)}
                                    borderBottomWidth="1px"
                                    position="relative"
                                >
                                    <HStack justify="space-between" align="start">
                                        <Box flex={1}>
                                            <Text
                                                fontSize="sm"
                                                fontWeight={notification.isRead ? "normal" : "bold"}
                                            >
                                                {notification.message}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500" mt={1}>
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </Text>
                                        </Box>
                                        <IconButton
                                            aria-label="Delete notification"
                                            size="xs"
                                            variant="ghost"
                                            colorPalette="red"
                                            onClick={(e) => handleDeleteNotification(e, notification._id)}
                                            _hover={{ bg: "red.100", color: "red.600" }}
                                        >
                                            <FaTrash />
                                        </IconButton>
                                    </HStack>
                                </Box>
                            ))}
                        </VStack>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default NotificationBell;
