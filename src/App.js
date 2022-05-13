import { useState, useEffect } from 'react';
import { isAuth as isAuthenticated } from './util';
import { Routes, Route } from "react-router-dom";

import { globalStyles, styled } from './stitches.config';
import './App.css';

import Navbar from './components/widgets/Navbar';
import LandingPage from './components/pages/landing-page';
import Home from './components/pages/home';
import CommunityBlog from './components/pages/community-blog';
import Discussions from './components/pages/discussions';
import Profile from './components/pages/profile';
import Microblog from './components/sections/Microblog';
import Journal from './components/sections/Journal';
import Events from './components/pages/events';
import Settings from './components/pages/settings';
import NotFound from './components/widgets/NotFound';

const Main = styled('main', {});

function App() {
    globalStyles();

    const [isAuth, setIsAuth] = useState(false);

    const Wrapper = styled('div', {
        minHeight: '100vh',
        background: !(isAuth) ? "center / cover no-repeat url('/backdrop_ver_1.png')" : "transparent",
    });

    const handleLogIn = () => {
        setIsAuth(true);
    }

    const handleLogOut = () => {
        setIsAuth(false);
    }

    useEffect(() => {
        let loading = true;
        if (loading) {
            if (isAuthenticated()) {
                handleLogIn();
            } else {
                handleLogOut();
            }
        }

        return () => {
            loading = false
        }
    }, [isAuth]);

    return (
        <Wrapper>
            <Navbar 
            isAuth={isAuth}
            handleLogIn={handleLogIn}
            handleLogOut={handleLogOut} />
            <Main>
                <Routes>
                    <Route path="/" element={
                        <LandingPage
                        isAuth={isAuth}
                        handleLogIn={handleLogIn}
                        handleLogOut={handleLogOut} />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/community-blog" element={<CommunityBlog />} />
                    <Route path="/profile/:username" element={<Profile />}>
                        <Route path="microblog" element={<Microblog />} />
                        <Route path="journal" element={<Journal />} />
                    </Route>
                    <Route path="/discussions" element={<Discussions />} />
                    <Route path="/events" element={<Events />} />     
                    <Route path="/:username/settings" element={<Settings />} />
                    <Route path="/:path" element={<NotFound />} />
                </Routes>
            </Main> 
        </Wrapper>
    );
}

export default App;
