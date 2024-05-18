export const TRANSLATIONS_ES = {
    pages: {
        configuration: {
            title: "Configuración",
            language: "Idioma",
            changePassword: "Cambiar la contraseña",
            deleteAccount: "Eliminar cuenta",
            changeImage: "Cambiar imagen de perfil",
        },
        home: {
            myOrgs: "Mis Organizaciones",
            noOrgs: "¡Oops! No tienes ninguna organización",
            recentSongs: "Canciones Recientes",
            noSongs: "¡Oops! No tienes ninguna canción",
            song: {
                name: "Nombre",
                org: "Organización",
                creationDate: "Fecha de Creación",
                lastModified: "Última de Modificación",
                actions: "Acciones",
            },
            more: "Ver más",
        },
        landingPage: {
            guitarists: "Guitarristas",
            jazzband: "Banda de Jazz",
            listening: "Escuchando música en una sala",
            rockband: "Banda de Rock",
            collaboration: {
                title: "Donde tu música y colaboración se unen",
                description:
                    "¿Eres un músico que busca colaborar con otros artistas, sin importar la distancia? Harmony es tu solución. Desarrollada pensando en músicos de todo el mundo, nuestra plataforma te permite crear música de forma colaborativa y en tiempo real, sin importar dónde te encuentres. Ya no tendrás que lidiar con los obstáculos de la distancia física. Descubre cómo Harmony puede potenciar tu creatividad y hacer que tus ideas musicales cobren vida de manera eficiente y emocionante.",
            },
            offer: {
                title: "¿Qué te ofrecemos?",
                collaboration: {
                    title: "Colaboración sin Fronteras",
                    description:
                        "Trabaja con músicos de todo el mundo en un espacio virtual compartido.",
                },
                realtime: {
                    title: "Edición en Tiempo Real",
                    description:
                        "Modifica y mejora tus composiciones al instante, mientras los demás las escuchan.",
                },
                remote: {
                    title: "Flujo de Trabajo Eficiente",
                    description:
                        "Olvídate de los desplazamientos y las reuniones presenciales; ahorra tiempo y recursos.",
                },
                tools: {
                    title: "Herramientas de Creatividad",
                    description:
                        "Accede a una gama de herramientas para dar vida a tus ideas musicales, desde la escritura de partituras hasta la grabación en línea.",
                },
            },
            steps: {
                title: "¿Cómo funciona?",
                create: "Crea tu proyecto musical.",
                invite: "Invita a sus colaboradores.",
                compose: "Comienza a componer y modificar juntos.",
                improve: "Escucha y perfecciona tu música en tiempo real.",
                easy: "¡Es muy fácil!",
            },
            join: {
                title: "¡Unite ahora!",
                description:
                    "¡No dejes que la distancia física limite tu creatividad musical! Únete a Harmony hoy mismo y descubre cómo la colaboración musical en tiempo real puede ser emocionante, eficiente y verdaderamente global. Regístrate ahora para comenzar tu viaje musical en equipo.",
                signUp: "Registrate",
            },
        },
        login: {
            title: "Iniciar sesión",
            mail: "Dirección de Correo",
            password: "Contraseña",
            forget: "¿Te olvidaste la contraseña?",
            remember: "Recordarme",
            submit: "INICIAR SESIÓN",
            error: {
                mail: "Error en el mail",
                password: "Error en la contraseña",
                credentials: "Credenciales inválidas",
            },
        },
        register: {
            title: "Registrarse",
            firstName: "Nombre",
            lastName: "Apellido",
            mail: "Dirección de Correo",
            password: "Contraseña",
            subscription:
                "Al subscribirme, acepto los Términos de Servicio y la Política de Privacidad",
            submit: "REGISTRATE",
            error: {
                firstName: "Error en el nombre",
                lastName: "Error en el apellido",
                mail: "Error en el mail",
                password: "Error la contraseña",
                passwordLength: "La contraseña debe tener mínimo 8 caracteres",
                subscription: "Debes aceptar los Términos y Condiciones",
            },
        },
        orgs: {
            title: "Mis Organizaciones",
            edit: "Editar",
            delete: "Eliminar",
            noSongs: "¡Oops! No tienes ninguna organización",
        },
        org: {
            songs: {
                title: "Canciones",
                name: "Nombre",
                creationDate: "Fecha de Creación",
                lastModified: "Última de Modificación",
                actions: "Acciones",
                none: "¡Oops! No tienes canciones",
            },
            members: "Integrantes",
        },
        edit: {
            view: {
                edit: "Editar",
                preview: "Preview",
            },
        },
    },
    components: {
        changePasswordModal: {
            title: "Cambiar contraseña",
            label: "Contraseña nueva",
            error: {
                change: "Error al cambiar la contraseña",
                length: "La contraseña debe tener al menos 8 caracteres",
            },
            send: "Enviar",
            close: "Cerrar",
        },
        deleteAccountModal: {
            title: "¿Estás seguro que querés eliminar tu cuenta?",
            yes: "Sí",
            cancel: "Cancelar",
            error: "Error al eliminar la cuenta",
        },
        deleteOrgModal: {
            title: "¿Estás seguro que querés eliminar la organización?",
            yes: "Sí",
            cancel: "Cancelar",
            error: "Error al eliminar la organización",
        },
        changeProfileImageModal: {
            title: "Cambiar Imagen de Perfil",
            cancel: "Cancelar",
            change: "Cambiar",
            error: {
                edit: "Error al cambiar la imagen de perfil, por favor volver a intentar",
            },
        },
        editOrgModal: {
            title: "Editar Organización",
            edit: "Editar",
            cancel: "Cancelar",
            upload: "Subir Imagen",
            error: {
                name: "El nombre de la organización debe tener menos de 50 caracteres",
                edit: "Error al editar organización, por favor volver a intentar",
                image: "Error al subir la imagen, el tamaño máximo es 4MB",
            },
        },
        createOrgModal: {
            title: "Crear Organización",
            create: "Crear",
            cancel: "Cancelar",
            upload: "Subir Imagen",
            error: {
                name: "El nombre de la organización debe tener menos de 50 caracteres",
                create: "Error al crear organización, por favor volver a intentar",
                image: "Error al subir la imagen, el tamaño máximo es 4MB",
            },
        },
        createSongModal: {
            title: "Crear Canción",
            name: "Nombre",
            select: "Seleccionar una organización",
            create: "Crear",
            cancel: "Cancelar",
            error: {
                name: "El nombre de la canción debe tener menos de 50 caracteres",
                org: "Seleccionar una organización válida"
            },
        },
        navbar: {
            login: "Iniciar sesión",
            register: "Registrarse",
            userMenu: {
                configuration: "Configuración",
                logout: "Cerrar sesión"
            }
        },
        orgCard: {
            members: "Miembros: ",
            edit: "Editar",
            delete: "Eliminar",
        },
        addMember: {
            button: "Agregar Miembro",
            title: "Invitar Miembro",
            cancel: "Cancelar",
            send: "Enviar Invitación",
        },
    },
};
