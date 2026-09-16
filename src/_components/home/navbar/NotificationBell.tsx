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
                color="aoe.textMuted"
                _hover={{ bg: "aoe.surface", color: "aoe.text" }}
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
                    bg="aoe.bgAlt"
                    boxShadow="0 18px 40px rgba(0,0,0,0.5)"
                    borderRadius="14px"
                    zIndex={20}
                    maxH="400px"
                    overflowY="auto"
                    borderWidth="1px"
                    borderColor="aoe.borderSubtle"
                >
                    <HStack
                        justify="space-between"
                        p={3}
                        borderBottomWidth="1px"
                        borderColor="aoe.borderSubtle"
                        bg="aoe.bg"
                    >
                        <Text fontFamily="mono" fontSize="10px" letterSpacing="0.12em" textTransform="uppercase" color="aoe.textMuted">
                            Notificaciones
                        </Text>
                        {unreadCount > 0 && (
                            <Text
                                fontSize="xs"
                                color="aoe.red"
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
                            <Spinner size="sm" color="aoe.red" />
                        </Box>
                    ) : notifications.length === 0 ? (
                        <Box p={4} textAlign="center">
                            <Text fontSize="sm" color="aoe.textFaint">
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
                                    bg={notification.isRead ? "transparent" : "aoe.surface"}
                                    _hover={{ bg: "aoe.surface" }}
                                    onClick={() => handleNotificationClick(notification)}
                                    borderBottomWidth="1px"
                                    borderColor="aoe.borderSubtle"
                                    position="relative"
                                >
                                    <HStack justify="space-between" align="start">
                                        <Box flex={1}>
                                            <Text
                                                fontSize="sm"
                                                fontWeight={notification.isRead ? "normal" : "bold"}
                                                color="aoe.text"
                                            >
                                                {notification.message}
                                            </Text>
                                            <Text fontFamily="mono" fontSize="10px" color="aoe.textFaint" mt={1}>
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </Text>
                                        </Box>
                                        <IconButton
                                            aria-label="Delete notification"
                                            size="xs"
                                            variant="ghost"
                                            color="aoe.textGhost"
                                            onClick={(e) => handleDeleteNotification(e, notification._id)}
                                            _hover={{ bg: "aoe.bg", color: "aoe.red" }}
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
