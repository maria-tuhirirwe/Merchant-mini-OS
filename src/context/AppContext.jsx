import { createContext, useContext, useReducer, useCallback } from 'react';
import {
  sampleUser,
  sampleTransactions,
  defaultCategories,
} from '../data/sampleData';

// --- State shape ---
const initialState = {
  user: sampleUser,
  isAuthenticated: false,
  transactions: sampleTransactions,
  categories: defaultCategories,
  loading: false,
  error: null,
};

// --- Action types ---
const A = {
  LOGIN:                'LOGIN',
  LOGOUT:               'LOGOUT',
  ADD_TRANSACTION:      'ADD_TRANSACTION',
  UPDATE_TRANSACTION:   'UPDATE_TRANSACTION',
  DELETE_TRANSACTION:   'DELETE_TRANSACTION',
  ADD_CATEGORY:         'ADD_CATEGORY',
  UPDATE_CATEGORY:      'UPDATE_CATEGORY',
  DELETE_CATEGORY:      'DELETE_CATEGORY',
  SET_LOADING:          'SET_LOADING',
  SET_ERROR:            'SET_ERROR',
  CLEAR_ERROR:          'CLEAR_ERROR',
  UPDATE_USER:          'UPDATE_USER',
};

function reducer(state, action) {
  switch (action.type) {
    case A.LOGIN:
      return { ...state, isAuthenticated: true, user: action.payload || state.user, error: null };

    case A.LOGOUT:
      return { ...state, isAuthenticated: false };

    case A.ADD_TRANSACTION:
      return { ...state, transactions: [action.payload, ...state.transactions] };

    case A.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    case A.DELETE_TRANSACTION:
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };

    case A.ADD_CATEGORY:
      return { ...state, categories: [...state.categories, action.payload] };

    case A.UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        ),
      };

    case A.DELETE_CATEGORY:
      return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };

    case A.SET_LOADING:
      return { ...state, loading: action.payload };

    case A.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case A.CLEAR_ERROR:
      return { ...state, error: null };

    case A.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Simulate async login
  const login = useCallback(async (email, password) => {
    dispatch({ type: A.SET_LOADING, payload: true });
    await new Promise(r => setTimeout(r, 900));

    // Demo: any valid-looking email/password works
    if (!email || !password || password.length < 6) {
      dispatch({ type: A.SET_ERROR, payload: 'Invalid email or password.' });
      return false;
    }
    dispatch({ type: A.SET_LOADING, payload: false });
    dispatch({ type: A.LOGIN, payload: { ...state.user, email } });
    return true;
  }, [state.user]);

  const signup = useCallback(async (name, email, password) => {
    dispatch({ type: A.SET_LOADING, payload: true });
    await new Promise(r => setTimeout(r, 1000));

    if (!name || !email || !password || password.length < 6) {
      dispatch({ type: A.SET_ERROR, payload: 'Please fill all fields. Password must be 6+ characters.' });
      return false;
    }
    dispatch({ type: A.SET_LOADING, payload: false });
    dispatch({ type: A.LOGIN, payload: { ...sampleUser, name, email } });
    return true;
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: A.LOGOUT });
  }, []);

  const addTransaction = useCallback((transaction) => {
    const newTx = {
      ...transaction,
      id: `t-${Date.now()}`,
      date: transaction.date || new Date().toISOString().split('T')[0],
    };
    dispatch({ type: A.ADD_TRANSACTION, payload: newTx });
    return newTx;
  }, []);

  const updateTransaction = useCallback((transaction) => {
    dispatch({ type: A.UPDATE_TRANSACTION, payload: transaction });
  }, []);

  const deleteTransaction = useCallback((id) => {
    dispatch({ type: A.DELETE_TRANSACTION, payload: id });
  }, []);

  const addCategory = useCallback((category) => {
    const newCat = {
      ...category,
      id: `cat-${Date.now()}`,
      color: category.color || '#94a3b8',
      icon:  category.icon  || '📝',
    };
    dispatch({ type: A.ADD_CATEGORY, payload: newCat });
    return newCat;
  }, []);

  const updateCategory = useCallback((category) => {
    dispatch({ type: A.UPDATE_CATEGORY, payload: category });
  }, []);

  const deleteCategory = useCallback((id) => {
    dispatch({ type: A.DELETE_CATEGORY, payload: id });
  }, []);

  const updateUser = useCallback((updates) => {
    dispatch({ type: A.UPDATE_USER, payload: updates });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: A.CLEAR_ERROR });
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      login,
      signup,
      logout,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      updateUser,
      clearError,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
