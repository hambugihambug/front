// 간단한 토스트 훅 구현
import { useState, useCallback } from 'react';

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = 'default' }) => {
    const id = toastId++;
    
    setToasts((state) => [
      ...state,
      { id, title, description, variant },
    ]);

    // 3초 후 자동으로 토스트 제거
    setTimeout(() => {
      setToasts((state) => state.filter((toast) => toast.id !== id));
    }, 3000);

    return id;
  }, []);

  return {
    toast,
    toasts,
    dismiss: (id) => {
      setToasts((state) => state.filter((toast) => toast.id !== id));
    },
  };
}

// 실제 프로젝트에서는 이 파일을 더 확장하여 사용할 수 있습니다.