import { useRef } from 'react';
import { Toast } from 'primereact/toast';

interface ToastMessage {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail?: string;
  life?: number;
  sticky?: boolean;
}

export const useToastPrime = () => {
  const toast = useRef<Toast>(null);

  const showToast = (message: ToastMessage) => {
    toast.current?.show({
      severity: message.severity,
      summary: message.summary,
      detail: message.detail,
      life: message.life || 3000,
      sticky: message.sticky || false
    });
  };

  const showSuccess = (summary: string, detail?: string) => {
    showToast({ severity: 'success', summary, detail });
  };

  const showInfo = (summary: string, detail?: string) => {
    showToast({ severity: 'info', summary, detail });
  };

  const showWarn = (summary: string, detail?: string) => {
    showToast({ severity: 'warn', summary, detail });
  };

  const showError = (summary: string, detail?: string) => {
    showToast({ severity: 'error', summary, detail });
  };

  return {
    toast,
    showToast,
    showSuccess,
    showInfo,
    showWarn,
    showError
  };
};