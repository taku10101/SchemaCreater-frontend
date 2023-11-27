import firebase from "firebase/app";
import { createContext, useEffect, useState, VFC, ReactNode } from "react";
import { auth } from "@/lib/firebase/client";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Top from "@/components/top";
export type User = firebase.User;

type AuthContextProps = {
  currentUser: User | null | undefined;
  signInCheck: boolean;
  logout: () => void;
  login: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps>({
  currentUser: undefined,
  signInCheck: false,
  logout: () => {},
  login: async () => {},
});

const AuthProvider: VFC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined
  );

  const [signInCheck, setSignInCheck] = useState(false);

  const logout = () => {
    try {
      auth.signOut();
      setSignInCheck(false);
      console.log(signInCheck);
      console.log("logout");
    } catch (err) {
      console.log(err);
    }
  };

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      console.log(res.user);
    } catch (err) {
      console.log(err);
    }
  };

  // ログイン状態を確認する
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        setSignInCheck(true);
        console.log(currentUser);
      } else {
        setSignInCheck(false);
      }
    });
  }, [setSignInCheck, currentUser]);

  // if (signInCheck) {
  return (
    <AuthContext.Provider value={{ currentUser, signInCheck, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
  // } else {
  //   // ログイン確認中
  //   // 自分で作ったローディングコンポーネントをレンダリングする
  //   return (
  //     <>
  //       <AuthContext.Provider
  //         value={{ currentUser, signInCheck, logout, login }}
  //       >
  //         <Top />
  //       </AuthContext.Provider>
  //     </>
  //   );
  // }
};

export { AuthContext, AuthProvider };