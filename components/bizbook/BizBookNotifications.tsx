import React, { useCallback, useState } from 'react';
import { Bell, X, AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number; // ms, 0 = permanent
}

interface BizBookNotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  darkMode?: boolean;
}

export const BizBookNotifications: React.FC<BizBookNotificationsProps> = ({
  notifications,
  onDismiss,
  darkMode = false,
}) => {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          bg: darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50',
          border: 'border-l-4 border-emerald-500',
        };
      case 'warning':
        return {
          bg: darkMode ? 'bg-amber-900/20' : 'bg-amber-50',
          border: 'border-l-4 border-amber-500',
        };
      case 'error':
        return {
          bg: darkMode ? 'bg-rose-900/20' : 'bg-rose-50',
          border: 'border-l-4 border-rose-500',
        };
      case 'info':
      default:
        return {
          bg: darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50',
          border: 'border-l-4 border-indigo-500',
        };
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed top-0 right-0 p-4 z-50 space-y-3 pointer-events-none md:pointer-events-auto">
      <AnimatePresence>
        {notifications.map((notification) => {
          const styles = getStyles(notification.type);
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 100, y: -20 }}
              className={`${styles.bg} ${styles.border} rounded-lg p-4 max-w-sm shadow-lg backdrop-blur-sm pointer-events-auto`}
            >
              <div className="flex items-start gap-3">
                {getIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{notification.title}</div>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{notification.message}</p>
                  {notification.actionLabel && (
                    <button
                      onClick={notification.onAction}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 mt-2"
                    >
                      → {notification.actionLabel}
                    </button>
                  )}
                  <div className="text-xs text-slate-400 mt-2">{formatTime(notification.timestamp)}</div>
                </div>
                <button
                  onClick={() => onDismiss(notification.id)}
                  className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      options?: {
        duration?: number;
        actionLabel?: string;
        onAction?: () => void;
      }
    ) => {
      const id = crypto.randomUUID();
      const notification: Notification = {
        id,
        type,
        title,
        message,
        timestamp: new Date(),
        duration: options?.duration ?? 5000,
        actionLabel: options?.actionLabel,
        onAction: options?.onAction,
      };

      setNotifications((prev) => [...prev, notification]);

      if (notification.duration && notification.duration > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, notification.duration);
      }

      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = {
    success: (title: string, message: string, options?: any) =>
      addNotification('success', title, message, options),
    warning: (title: string, message: string, options?: any) =>
      addNotification('warning', title, message, options),
    error: (title: string, message: string, options?: any) =>
      addNotification('error', title, message, options),
    info: (title: string, message: string, options?: any) =>
      addNotification('info', title, message, options),
  };

  return { notifications, notify, removeNotification };
};

export default BizBookNotifications;
