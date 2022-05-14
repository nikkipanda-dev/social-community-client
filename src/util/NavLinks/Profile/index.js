import {
    faQuoteLeft,
    faBook,
    faIdCard,
    faUserGroup,
    faChalkboardUser,
    faBlog,
} from '@fortawesome/free-solid-svg-icons';

export const ProfileSidebarItems = [
    {
        id: 1,
        section: "Microblog",
        link: "microblog",
        icon: faQuoteLeft,
    },
    {
        id: 2,
        section: "Journal",
        link: "journal",
        icon: faBook,
    },
    {
        id: 3,
        section: "About",
        link: "about",
        icon: faIdCard,
    },
    {
        id: 4,
        section: "Friends",
        link: "friends",
        icon: faUserGroup,
    },
    {
        id: 5,
        section: "Discussions",
        link: "discussions",
        icon: faChalkboardUser,
    },
    {
        id: 6,
        section: "Community Blog Posts",
        link: "community-blog",
        icon: faBlog,
    },
];