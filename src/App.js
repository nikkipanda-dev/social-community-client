import { useState, useEffect } from 'react';
import { isAuth as isAuthenticated } from './util';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db, } from './util/Firebase';
import { doc, updateDoc, } from 'firebase/firestore';
import { Routes, Route } from "react-router-dom";
import Cookies from 'js-cookie';

import { globalStyles, styled } from './stitches.config';
import './App.css';

import Navbar from './components/widgets/Navbar';
import LandingPage from './components/pages/landing-page';
import Home from './components/pages/home';
import CommunityBlog from './components/pages/community-blog';
import { CommunityBlog as CommunityBlogSection } from './components/sections/CommunityBlog';
import CommunityBlogEntry from './components/widgets/CommunityBlogEntry';
import PostCommunityBlog from './components/sections/PostCommunityBlog';
import Discussions from './components/pages/discussions';
import { Discussions as DiscussionsSection } from './components/sections/Discussions';
import UserDiscussions from './components/sections/UserDiscussions';
import DiscussionPost from './components/widgets/DiscussionPost';
import Profile from './components/pages/profile';
import Microblog from './components/sections/Microblog';
import Journal from './components/pages/journal';
import { Journal as JournalSection } from './components/sections/Journal';
import JournalEntry from './components/widgets/JournalEntry';
import About from './components/pages/about';
import Friends from './components/pages/friends';
import FriendInvitations from './components/widgets/FriendInvitations';
import { Friends as FriendsSection } from './components/sections/Friends';
import DiscussionPosts from './components/widgets/DiscussionPosts';
import CommunityBlogEntries from './components/widgets/CommunityBlogEntries';
import Events from './components/pages/events';
import { Events as EventsSection } from './components/sections/Events';
import Event from './components/widgets/Event';
import PostEvent from './components/sections/PostEvent';
import Messages from './components/pages/messages';
import {Messages as MessagesSection} from './components/sections/Messages';
import Settings from './components/pages/settings';
import Register from './components/pages/register';
import NotFound from './components/widgets/NotFound';
import PostJournal from './components/widgets/PostJournal';

const Main = styled('div', {});

function App() {
    globalStyles();

    const [isAuth, setIsAuth] = useState(false);
    const [forceRender, setForceRender] = useState(false);

    const handleForceRender = () => setForceRender(!forceRender);

    const Wrapper = styled('div', {
        minHeight: '100vh',
        background: !(isAuth) ? "center / cover no-repeat url('/backdrop_ver_1.png')" : "transparent",
    });

    const handleLogIn = () => setIsAuth(true);
    const handleLogOut = () => setIsAuth(false);

    useEffect(() => {
        let loading = true;

        if (loading) {
            if (isAuthenticated()) {
                handleLogIn();

                if (auth && db) {
                    signInWithEmailAndPassword(
                        auth,
                        JSON.parse(Cookies.get('auth_user')).email,
                        JSON.parse(Cookies.get('auth_user_firebase_secret')),
                    )

                    .then(response => {
                        // console.info('res login ', response);
                        updateDoc(doc(db, "users", response.user.uid), {
                            isOnline: true,
                        });
                    })

                    .catch(err => {
                        console.error('err ', err);
                    });
                }
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
            handleForceRender={handleForceRender}
            handleLogIn={handleLogIn}
            handleLogOut={handleLogOut} />
            <Main>
                <Routes>
                    <Route path="/" element={
                        <LandingPage
                        isAuth={isAuth}
                        handleLogIn={handleLogIn}
                        handleLogOut={handleLogOut} />} />
                    <Route path="/home" element={<Home isAuth={isAuth} />} />
                    <Route path="/community-blog" element={<CommunityBlog isAuth={isAuth} />} >
                        <Route index element={<CommunityBlogSection />} />
                        <Route path="editor" element={<PostCommunityBlog />} />
                        <Route path="post/:slug" element={<CommunityBlogEntry />} />
                        <Route path=":slug" element={<CommunityBlogSection />} />
                    </Route>
                    <Route path="/profile/:username" element={<Profile 
                    isAuth={isAuth}
                    forceRender={forceRender} 
                    handleForceRender={handleForceRender}/>}>
                        <Route index element={<Microblog />} />
                        <Route path="microblog" element={<Microblog />} />
                        <Route path="journal" element={<Journal />}>
                            <Route index element={<JournalSection />} />
                            <Route path="editor" element={<PostJournal />} />
                            <Route path="all" element={<JournalSection />} />
                            <Route path=":slug" element={<JournalEntry />} />
                        </Route>
                        <Route path="about" element={<About />} />
                        <Route path="friends" element={<Friends />} >
                            <Route index element={<FriendsSection />} />
                            <Route path="invitations" element={<FriendInvitations />} />
                            <Route path="all" element={<FriendsSection />} />
                        </Route>
                        <Route path="discussions" element={<DiscussionPosts />}>
                            <Route path="all" element={<UserDiscussions />} />
                        </Route>
                        <Route path="community-blog" element={<CommunityBlogEntries />} />
                    </Route>
                    <Route path="/discussions" element={<Discussions isAuth={isAuth} />}>
                        <Route index element={<DiscussionsSection />} />
                        <Route path="post/:slug" element={<DiscussionPost />} />
                        <Route path=":slug" element={<DiscussionsSection />} />
                    </Route>
                    <Route path="/events" element={<Events isAuth={isAuth} />}>
                        <Route index element={<EventsSection />} /> 
                        <Route path="post/:slug" element={<Event />} />
                        <Route path="editor" element={<PostEvent />} />
                        <Route path=":slug" element={<EventsSection />} />
                    </Route>     
                    <Route path="/messages" element={<Messages 
                    isAuth={isAuth} />} >
                        <Route index element={<MessagesSection />} />
                    </Route>
                    <Route path="register/:token" element={<Register 
                    isAuth={isAuth} 
                    handleLogIn={handleLogIn} />} />
                    <Route path="/:username/settings" element={<Settings />} />
                    <Route path="/:path" element={<NotFound />} />
                </Routes>
            </Main> 
        </Wrapper>
    );
}

export default App;
