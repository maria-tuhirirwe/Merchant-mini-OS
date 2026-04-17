import { createContext, useContext, useReducer, useCallback } from 'react';
import {
  sampleUser,
  sampleTransactions,
  defaultCategories,
  computeStreak,
} from '../data/sampleData';
import { sampleLoans, getLoanBalance } from '../data/loansData';

// --- State shape ---
const initialState = {
  user:          sampleUser,
  isAuthenticated: false,
  transactions:  sampleTransactions,
  categories:    defaultCategories,
  loans:         sampleLoans,
  businessMode:  'personal', // 'personal' | 'business'
  loading:       false,
  error:         null,
};

// --- Action types ---
const A = {
  LOGIN:              'LOGIN',
  LOGOUT:             'LOGOUT',
  ADD_TRANSACTION:    'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  ADD_CATEGORY:       'ADD_CATEGORY',
  UPDATE_CATEGORY:    'UPDATE_CATEGORY',
  DELETE_CATEGORY:    'DELETE_CATEGORY',
  ADD_LOAN:           'ADD_LOAN',
  UPDATE_LOAN:        'UPDATE_LOAN',
  DELETE_LOAN:        'DELETE_LOAN',
  ADD_LOAN_PAYMENT:   'ADD_LOAN_PAYMENT',
  SET_LOADING:        'SET_LOADING',
  SET_ERROR:          'SET_ERROR',
  CLEAR_ERROR:        'CLEAR_ERROR',
  UPDATE_USER:        'UPDATE_USER',
  SET_BUSINESS_MODE:  'SET_BUSINESS_MODE',
};

function computeLoanStatus(loan, payments) {
  const paid = payments.reduce((s, p) => s + p.amount, 0);
  if (paid === 0)          return 'pending';
  if (paid >= loan.amount) return 'settled';
  return 'partial';
}

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

    case A.ADD_LOAN:
      return { ...state, loans: [action.payload, ...state.loans] };

    case A.UPDATE_LOAN:
      return {
        ...state,
        loans: state.loans.map(l =>
          l.id === action.payload.id ? { ...l, ...action.payload } : l
        ),
      };

    case A.DELETE_LOAN:
      return { ...state, loans: state.loans.filter(l => l.id !== action.payload) };

    case A.ADD_LOAN_PAYMENT: {
      const { loanId, payment } = action.payload;
      return {
        ...state,
        loans: state.loans.map(l => {
          if (l.id !== loanId) return l;
          const payments = [...l.payments, payment];
          return { ...l, payments, status: computeLoanStatus(l, payments) };
        }),
      };
    }

    case A.SET_LOADING:
      return { ...state, loading: action.payload };

    case A.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case A.CLEAR_ERROR:
      return { ...state, error: null };

    case A.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };

    case A.SET_BUSINESS_MODE:
      return { ...state, businessMode: action.payload };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = useCallback(async (email, password) => {
    dispatch({ type: A.SET_LOADING, payload: true });
    await new Promise(r => setTimeout(r, 900));
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
      dispatch({ type: A.SET_ERROR, payload: 'Please fill all fields. Password must be 6+ chars.' });
      return false;
    }
    dispatch({ type: A.SET_LOADING, payload: false });
    dispatch({ type: A.LOGIN, payload: { ...sampleUser, name, email } });
    return true;
  }, []);

  const logout = useCallback(() => dispatch({ type: A.LOGOUT }), []);

  const addTransaction = useCallback((transaction) => {
    const newTx = {
      ...transaction,
      id:   `t-${Date.now()}`,
      date: transaction.date || new Date().toISOString().split('T')[0],
      mode: transaction.mode || state.businessMode,
    };
    dispatch({ type: A.ADD_TRANSACTION, payload: newTx });
    return newTx;
  }, [state.businessMode]);

  const updateTransaction = useCallback((transaction) => {
    dispatch({ type: A.UPDATE_TRANSACTION, payload: transaction });
  }, []);

  const deleteTransaction = useCallback((id) => {
    dispatch({ type: A.DELETE_TRANSACTION, payload: id });
  }, []);

  const addCategory = useCallback((category) => {
    const newCat = {
      ...category,
      id:    `cat-${Date.now()}`,
      color: category.color || '#94a3b8',
      icon:  category.icon  || '📝',
    };
    dispatch({ type: A.ADD_CATEGORY, payload: newCat });
    return newCat;
  }, []);

  const updateCategory = useCallback((c)  => dispatch({ type: A.UPDATE_CATEGORY, payload: c }), []);
  const deleteCategory = useCallback((id) => dispatch({ type: A.DELETE_CATEGORY, payload: id }), []);
  const updateUser     = useCallback((u)  => dispatch({ type: A.UPDATE_USER, payload: u }), []);
  const clearError     = useCallback(()   => dispatch({ type: A.CLEAR_ERROR }), []);

  const setBusinessMode = useCallback((mode) => {
    dispatch({ type: A.SET_BUSINESS_MODE, payload: mode });
  }, []);

  // Derived: streak days
  const streakDays = computeStreak(state.transactions);

  // --- Loan actions ---
  const addLoan = useCallback((loan) => {
    const newLoan = {
      ...loan,
      id:       `loan-${Date.now()}`,
      status:   'pending',
      payments: [],
      date:     loan.date || new Date().toISOString().split('T')[0],
    };
    dispatch({ type: A.ADD_LOAN, payload: newLoan });
    return newLoan;
  }, []);

  const updateLoan = useCallback((loan) => {
    dispatch({ type: A.UPDATE_LOAN, payload: loan });
  }, []);

  const deleteLoan = useCallback((id) => {
    dispatch({ type: A.DELETE_LOAN, payload: id });
  }, []);

  const addLoanPayment = useCallback((loanId, paymentAmount, paymentDate, note) => {
    const loan = state.loans.find(l => l.id === loanId);
    if (!loan) return;

    const payment = {
      id:     `pay-${Date.now()}`,
      amount: paymentAmount,
      date:   paymentDate || new Date().toISOString().split('T')[0],
      note:   note || '',
    };

    dispatch({ type: A.ADD_LOAN_PAYMENT, payload: { loanId, payment } });

    const txType = loan.direction === 'lent' ? 'in' : 'out';
    const txNote = loan.direction === 'lent'
      ? `Repayment from ${loan.personName}`
      : `Repayment to ${loan.personName}`;

    dispatch({
      type: A.ADD_TRANSACTION,
      payload: {
        id:       `t-${Date.now()}`,
        type:     txType,
        amount:   paymentAmount,
        category: 'Other',
        date:     payment.date,
        note:     note || txNote,
      },
    });

    return payment;
  }, [state.loans]);

  return (
    <AppContext.Provider value={{
      ...state,
      streakDays,
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
      setBusinessMode,
      addLoan,
      updateLoan,
      deleteLoan,
      addLoanPayment,
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
