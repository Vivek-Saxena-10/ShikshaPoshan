export type SupplyRequest = {
  id: string;
  type: 'textbooks' | 'uniforms' | 'stationary';
  section: string;
  quantity: number;
  reason: string;
  target: string;
  date: string;
  forwardedToAdmin?: boolean;
  forwardedDate?: string;
};

const SUPPLY_REQUEST_STORAGE_KEY = 'school-supply-requests';
const SUPPLY_REQUEST_EVENT = 'supply-requests-updated';

const cloneRequests = (requests: SupplyRequest[]) => requests.map((request) => ({ ...request }));

export const getStoredSupplyRequests = (): SupplyRequest[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const stored = window.localStorage.getItem(SUPPLY_REQUEST_STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(SUPPLY_REQUEST_STORAGE_KEY, JSON.stringify([]));
    return [];
  }

  try {
    return JSON.parse(stored) as SupplyRequest[];
  } catch {
    const fallback: SupplyRequest[] = [];
    window.localStorage.setItem(SUPPLY_REQUEST_STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
};

export const saveSupplyRequests = (requests: SupplyRequest[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SUPPLY_REQUEST_STORAGE_KEY, JSON.stringify(cloneRequests(requests)));
  window.dispatchEvent(new Event(SUPPLY_REQUEST_EVENT));
};

export const subscribeSupplyRequests = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === SUPPLY_REQUEST_STORAGE_KEY) {
      callback();
    }
  };

  const handleEvent = () => callback();

  window.addEventListener('storage', handleStorage);
  window.addEventListener(SUPPLY_REQUEST_EVENT, handleEvent);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(SUPPLY_REQUEST_EVENT, handleEvent);
  };
};
