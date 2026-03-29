import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { InventoryItem, DashboardStats, SalesRecord, UserProfile } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Inventory CRUD ---

export const getInventory = (callback: (items: InventoryItem[]) => void) => {
  const path = 'inventory';
  try {
    return onSnapshot(collection(db, path), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
      callback(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const addInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
  const path = 'inventory';
  const id = item.name.toLowerCase().replace(/\s+/g, '-'); // Simple ID generation
  try {
    await setDoc(doc(db, path, id), { ...item, id });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const updateInventoryItem = async (id: string, data: Partial<InventoryItem>) => {
  const path = `inventory/${id}`;
  try {
    await updateDoc(doc(db, 'inventory', id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteInventoryItem = async (id: string) => {
  const path = `inventory/${id}`;
  try {
    await deleteDoc(doc(db, 'inventory', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// --- Dashboard Stats ---

export const getDashboardStats = (callback: (stats: DashboardStats) => void) => {
  const path = 'stats/dashboard';
  try {
    return onSnapshot(doc(db, 'stats', 'dashboard'), (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as DashboardStats);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const updateDashboardStats = async (stats: Partial<DashboardStats>) => {
  const path = 'stats/dashboard';
  try {
    await setDoc(doc(db, 'stats', 'dashboard'), stats, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

// --- Sales Records ---

export const getSales = (callback: (sales: SalesRecord[]) => void) => {
  const path = 'sales';
  try {
    return onSnapshot(collection(db, path), (snapshot) => {
      const sales = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SalesRecord));
      callback(sales);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const addSale = async (sale: Omit<SalesRecord, 'id'>) => {
  const path = 'sales';
  const id = `sale-${Date.now()}`;
  try {
    await setDoc(doc(db, path, id), { ...sale, id });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

// --- User Profiles ---

export const getUserProfile = (uid: string, callback: (profile: UserProfile | null) => void) => {
  const path = `users/${uid}`;
  try {
    return onSnapshot(doc(db, 'users', uid), (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as UserProfile);
      } else {
        callback(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const path = `users/${uid}`;
  try {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

// --- Connection Test ---
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}
