import { createContext, useEffect, useContext, useState }  from 'react'
import {auth, db} from '../firebase';
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged} from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; 

const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({});
    function signUp(email, password){
        setDoc(doc(db, 'users', email),{
            savedShows: []
        })
        return createUserWithEmailAndPassword(auth,email,password);
    }
    function signIn(email, password){
        return signInWithEmailAndPassword(auth,email,password);
    }

    function logOut(){
        return signOut(auth);
    }

    useEffect(() => {
        const unsub =onAuthStateChanged(auth, (currentUser) =>{
            setUser(currentUser);
        });
        return () => unsub();
    });

  return (
    <div>
        <AuthContext.Provider value={{signUp, signIn, logOut, user}}>
        {children}
        </AuthContext.Provider>
    </div>
  )
}


export function UserAuth(){
    return useContext(AuthContext);
}
