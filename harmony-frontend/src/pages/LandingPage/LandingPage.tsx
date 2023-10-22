import guitarists from "../../assets/landing-guitarists.png";

const LandingPage = () => {
    return (
        <section className="relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6"></div>
            <div className="flex flex-row items-center justify-between pt-32 pb-12 px-64">
                <img src={guitarists} className="max-w-md max-h-md" />
                <div className="flex flex-col">
                    <h1 className="text-7xl font-serif font-bold text-fuchsia-950">
                        Harmony
                    </h1>
                    <h2 className="text-4xl font-serif font-medium text-zinc-600 mb-2">
                        Donde tu música y colaboración se unen
                    </h2>
                    <p className="text-xl font-serif text-zinc-500">
                        ¿Eres un músico que busca colaborar con otros artistas,
                        sin importar la distancia? Harmony es tu solución.
                        Desarrollada pensando en músicos de todo el mundo,
                        nuestra plataforma te permite crear música de forma
                        colaborativa y en tiempo real, sin importar dónde te
                        encuentres. Ya no tendrás que lidiar con los obstáculos
                        de la distancia física. Descubre cómo Harmony puede
                        potenciar tu creatividad y hacer que tus ideas musicales
                        cobren vida de manera eficiente y emocionante.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LandingPage;
