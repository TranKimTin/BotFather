import type { ToastServiceMethods } from 'primevue/toastservice';
import { useToast } from 'primevue/usetoast';

let toast: ToastServiceMethods;
export const init = () => {
    if (!toast) toast = useToast();
}

export const showSuccess = (detail: string, life = 3000) => {
    init()
    toast.add({
        severity: 'success',
        summary: 'success',
        detail: detail,
        life: life
    });
};

export const showError = (detail: string, life = 3000) => {
    init()
    toast.add({
        severity: 'error',
        summary: 'error',
        detail: detail,
        life: life
    });
};

export const showWarning = (detail: string, life = 3000) => {
    init()
    toast.add({
        severity: 'warn',
        summary: 'warning',
        detail: detail,
        life: life
    });
};

export const showInfo = (detail: string, life = 3000) => {
    init()
    toast.add({
        severity: 'info',
        summary: 'info',
        detail: detail,
        life: life
    });
};
