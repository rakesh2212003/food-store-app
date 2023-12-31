import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'

import { Login, Main } from './containers'
import { validateUserJWTToken } from './api';
import { setUserDetails } from './context/actions/userActions'
import { MainLoader } from './components';

import { getAuth } from 'firebase/auth'
import { app } from './config/firebase.config'
import { fadeInOut } from './animations';

function App() {

    const [isLoading, setIsLoading] = useState(false)

    const auth = getAuth(app)

    const dispatch = useDispatch()

    useEffect(() => {
        setIsLoading(true)
        auth.onAuthStateChanged(cred => {
            if(cred){
                cred.getIdToken().then(token => {
                    validateUserJWTToken(token).then(data => {
                        dispatch(setUserDetails(data))
                    })
                })
            }
            setInterval(() => {
                setIsLoading(false)
            }, 3000);
        })
    }, [])

    return (
        <div className='w-screen min-h-screen h-auto flex flex-col items-center justify-center'>
            {isLoading && (
                <motion.div
                    className='fixed z-50 inset-0 bg-lightOverlay backdrop-blur-md flex items-center justify-center w-full'
                    {...fadeInOut}
                >
                    <MainLoader />
                </motion.div>
            )}
            <Routes>
                <Route path='/*' element={<Main />} />
                <Route path='/login' element={<Login />} />
            </Routes>
        </div>
    );
}

export default App;