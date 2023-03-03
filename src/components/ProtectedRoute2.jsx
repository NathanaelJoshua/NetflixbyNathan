import React from 'react'
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext'

export const ProtectedRoute2 = ({children}) => {
    const {user} = UserAuth();
  if(user ) {
    return <Navigate to={ 'Home'}/>
  }
  else return children;
}
