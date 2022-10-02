import { createContext, useEffect, useState } from 'react';
import { Auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Auth, (user) => {
      setCurrentUser(user);
    //   console.log(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <AuthContext.Provider value={{currentUser}}>{children}</AuthContext.Provider>
  );
};
