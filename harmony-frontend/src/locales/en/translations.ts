export const TRANSLATIONS_EN = {
    pages: {
        configuration: {
            title: "Configuration",
            language: "Language",
            changePassword: "Change password",
            deleteAccount: "Delete account",
            changeImage: "Change profile image"
        },
        home: {
            myOrgs: "My Organizations",
            noOrgs: "Oops! You don't have any organizations yet",
            recentSongs: "Recent Songs",
            noSongs: "Oops! You don't have any songs yet",
            myAlbums: "My Albums",
            noAlbums: "Oops! You don't have any albums yet",
            song: {
                name: "Name",
                org: "Organization",
                creationDate: "Creation Date",
                lastModified: "Last Modification",
                actions: "Actions",
            },
            more: "See more",
        },
        search: {
            placeholder: "Search here...",
            songs: "songs",
            albums: "albums",
            organizations: "organizations",
        },
        landingPage: {
            guitarists: "Guitarists",
            jazzband: "Jazz Band",
            listening: "Listening to music in a room",
            rockband: "Rock Band",
            collaboration: {
                title: "Where your music and collaboration seamlessly blend",
                description:
                    "Are you a musician looking to collaborate with other artists, regardless of distance? Harmony is your solution. Developed with musicians worldwide in mind, our platform allows you to create music collaboratively and in real-time, no matter where you are. You no longer have to deal with the obstacles of physical distance. Discover how Harmony can boost your creativity and bring your musical ideas to life efficiently and excitingly",
            },
            offer: {
                title: "What we offer",
                collaboration: {
                    title: "Borderless Collaboration",
                    description:
                        "Work with musicians from all over the world in a shared virtual space.",
                },
                realtime: {
                    title: "Real-time Editing",
                    description:
                        "Edit and improve your compositions instantly, while others listen to them.",
                },
                remote: {
                    title: "Efficient Workflow",
                    description:
                        "Forget about commuting and in-person meetings; save time and resources.",
                },
                tools: {
                    title: "Creativity Tools",
                    description:
                        "Access a range of tools to bring your musical ideas to life, from scorewriting to online recording.",
                },
            },
            steps: {
                title: "How does it work?",
                create: "Create your musical project.",
                invite: "Invite your collaborators.",
                compose: "Start composing and editing together.",
                improve: "Listen and perfect your music in real time.",
                easy: "It's that easy!",
            },
            join: {
                title: "Join now!",
                description:
                    "Don't let physical distance limit your musical creativity! Join Harmony today and discover how real-time musical collaboration can be exciting, efficient, and truly global. Sign up now to start your team musical journey.",
                signUp: "Register!",
            },
        },
        login: {
            title: "Log In",
            mail: "Email Address",
            password: "Password",
            forget: "Forgot your password?",
            remember: "Remember me",
            submit: "LOG IN",
            error: {
                mail: "Mail error",
                password: "Password error",
                credentials: "Invalid login credentials",
            },
        },
        register: {
            title: "Register",
            firstName: "First Name",
            lastName: "Last Name",
            mail: "Email Address",
            password: "Password",
            subscription:
                "By subscribing, I accept the Terms of Service and Privacy Policy",
            submit: "REGISTER",
            error: {
                firstName: "Error in first name",
                lastName: "Error in last name",
                mail: "Error in mail",
                password: "Error in password",
                passwordLength: "The password should have 8 characters minimum",
                subscription: "You should accept the Terms and Conditions",
            },
        },
        albums: {
            title: "All My Albums",
            edit: "Edit",
            delete: "Delete",
            noOrgs: "Oops! You don't have any albums yet",
        },
        orgs: {
            title: "All My Organizations",
            edit: "Edit",
            delete: "Delete",
            noOrgs: "Oops! You don't have any organizations yet",
        },
        org: {
            songs: {
                title: "Songs",
                name: "Name",
                creationDate: "Date of Creation",
                lastModified: "Last Modification",
                actions: "Actions",
                none: "Oops! You have no songs",
            },
            singles: {
                title: "Singles",
                none: "Oops! You have no singles",
            },
            albums: {
                title: "Albums",
                noneSongs: "Oops! You have no songs in this album",
                none: "Oops! You have no albums in this organization",
                see: "See full album",
                moreSongs: "more songs...",
                oneSong: "more song..."
            },
            members: "Members",
        },
        album: {
            from: "From organization ",
            songs: {
                title: "Songs",
                name: "Name",
                creationDate: "Date of Creation",
                lastModified: "Last Modification",
                actions: "Actions",
                none: "Oops! You have no songs",
            }
        },
        songs: {
            title: "Your organizations' songs",
            name: "Name",
            org: "Organization",
            creationDate: "Creation Date",
            lastModified: "Last Modification",
            actions: "Actions",
            none: "Oops! You don't have any songs yet",
        },
        edit: {
            view: {
                edit: "Edit",
                preview: "Preview",
            },
            me: "Me",
            showPiano: "Show piano",
            hidePiano: "Hide piano",
            chord: "Chord",
            lyrics: "Lyrics",
            chordInfo: "Only accepts letter notation",
            loadingDocument: "Loading document...",
            exportPDF: "Export to PDF",
            edit: "Edit song"
        },
        orgInvitation: {
            loading: "Processing invitation...",
        },
        error: {
            default: "Oops! Something went wrong",
            goToHome: "Go back to Home",
            forbidden: "You don't have permission to access this page",
            org: {
                notFound: "Organization not found",
                forbidden: "You don't have permission to access this organization",
            },
            song: {
                notFound: "Song not found",
                forbidden: "You don't have permission to access this song",
            }
        }
    },
    components: {
        pagination: {
            page: "Page",
            of: "of"
        },
        changePasswordModal: {
            title: "Change password",
            label: "New password",
            success: "Password changed successfully",
            error: {
                change: "Error changing password",
                length: "Password must be at least 8 characters long",
            },
            send: "Send",
            close: "Close",
        },
        piano: {
            metronome: {
                start: "Start",
                stop: "Stop",
            }
        },
        deleteAccountModal: {
            title: "Are you sure you want to delete your account?",
            yes: "Yes",
            cancel: "Cancel",
            error: "Error deleting account",
        },
        deleteOrgModal: {
            title: "Are you sure you want to delete the organization?",
            yes: "Yes",
            cancel: "Cancel",
            error: "Error deleting the organization",
        },
        deleteAlbumModal: {
            title: "Are you sure you want to delete the album?",
            cascade: "Also delete songs from album",
            yes: "Yes",
            cancel: "Cancel",
            error: "Error deleting the album",
        },
        deleteSongModal: {
            title: "Are you sure you want to delete the song?",
            yes: "Yes",
            cancel: "Cancel",
            error: "Error deleting the song",
        },
        changeProfileImageModal: {
            title: "Change Profile Image",
            cancel: "Cancel",
            change: "Change",
            error: {
                fetch: "Error fetching images, please try again ",
                edit: "Error changing profile image, please try again",
            },
        },
        editOrgModal: {
            title: "Edit Organization",
            edit: "Edit",
            cancel: "Cancel",
            upload: "Upload Image",
            error: {
                name: "The name of the organization cannot be longer than 50 characters",
                edit: "Error editing organization, please try again",
                image: "Error uploading image, the size must be less than 4MB",
            },
        },
        editAlbumModal: {
            title: "Edit Album",
            edit: "Edit",
            cancel: "Cancel",
            upload: "Upload Image",
            error: {
                name: "The name of the album cannot be longer than 50 characters",
                edit: "Error editing album, please try again",
                image: "Error uploading image, the size must be less than 4MB",
            },
        },
        editSongModal: {
            title: "Edit Song",
            edit: "Edit",
            cancel: "Cancel",
            error: {
                name: "The name of the song cannot be longer than 50 characters",
                edit: "Error editing song, please try again",
                album: "Select a valid album"
            },
            select: {
                noAlbum: "Without album",
                single: "By not selecting an album, the song will be a single"
            }
        },
        createOrgModal: {
            title: "Create Organization",
            create: "Create",
            cancel: "Cancel",
            upload: "Upload Image",
            error: {
                name: "The name of the organization cannot be longer than 50 characters",
                create: "Error creating organization, please try again",
                image: "Error uploading image, the size must be less than 4MB",
            },
        },
        createSongModal: {
            title: "Create Song",
            name: "Name",
            select: {
                org: "Select an organization",
                album: "Select an album",
                noAlbum: "By not selecting an album, a single will be created"
            },
            create: "Create",
            cancel: "Cancel",
            button: "Add Song",
            error: {
                name: "The name of the song cannot be longer than 50 characters",
                org: "Please select a valid organization",
                album: "Please select a valid album"
            },
        },
        createAlbumModal: {
            title: "Create Album",
            name: "Name",
            select: "Select an organization",
            create: "Create",
            cancel: "Cancel",
            button: "Add Album",
            error: {
                name: "The name of the album cannot be longer than 50 characters",
                org: "Please select a valid organization"
            },
        },
        navbar: {
            login: "Log In",
            register: "Register",
            userMenu: {
                configuration: "Settings",
                logout: "Logout"
            }
        },
        orgCard: {
            members: "Members: ",
        },
        albumCard: {
            org: "Organization: ",
        },
        addMember: {
            button: "Add Member",
            title: "Invite Member",
            cancel: "Cancel",
            send: "Send Invite",
        },
    },
};
