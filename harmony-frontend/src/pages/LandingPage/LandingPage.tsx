import guitarists from "../../assets/landing-guitarists.png";
import jazzband from "../../assets/landing-jazz-band.png";

const LandingPage = () => {
    return (
        <>
            <section className="relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6"></div>
                <div className="flex flex-row items-center justify-between pt-32 pb-12 px-12">
                    <img src={guitarists} className="max-w-md max-h-md" />
                    <div className="flex flex-col">
                        <h1 className="text-7xl font-serif font-bold text-fuchsia-950">
                            Harmony
                        </h1>
                        <h2 className="text-4xl font-serif font-medium text-zinc-600 mb-2">
                            Donde tu música y colaboración se unen
                        </h2>
                        <p className="text-xl font-serif text-zinc-500">
                            ¿Eres un músico que busca colaborar con otros
                            artistas, sin importar la distancia? Harmony es tu
                            solución. Desarrollada pensando en músicos de todo
                            el mundo, nuestra plataforma te permite crear música
                            de forma colaborativa y en tiempo real, sin importar
                            dónde te encuentres. Ya no tendrás que lidiar con
                            los obstáculos de la distancia física. Descubre cómo
                            Harmony puede potenciar tu creatividad y hacer que
                            tus ideas musicales cobren vida de manera eficiente
                            y emocionante.
                        </p>
                    </div>
                </div>
            </section>
            <section className="relative">
                <h1 className="text-center text-5xl font-serif font-bold text-fuchsia-950 pb-12">
                    ¿Qué te ofrecemos?
                </h1>
                <div className="grid grid-cols-3 gap-2 px-12 justify-center text-center">
                    <div className="grid grid-rows-2 grid-flow-col">
                        <div>
                            <h1 className="text-3xl font-serif font-semibold text-fuchsia-900">
                                Colaboración sin Fronteras
                            </h1>
                            <p className="text-xl font-serif text-zinc-500">
                                Trabaja con músicos de todo el mundo en un
                                espacio virtual compartido.
                            </p>
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-semibold text-fuchsia-900">
                                Edición en Tiempo Real
                            </h1>
                            <p className="text-xl font-serif text-zinc-500">
                                Modifica y mejora tus composiciones al instante,
                                mientras los demás las escuchan.
                            </p>
                        </div>
                    </div>
                    <img src={jazzband} className="max-w-md max-h-md" />
                    <div className="grid grid-rows-2 grid-flow-col">
                        <div>
                            <h1 className="text-3xl font-serif font-semibold text-fuchsia-900">
                                Flujo de Trabajo Eficiente
                            </h1>
                            <p className="text-xl font-serif text-zinc-500">
                                Olvídate de los desplazamientos y las reuniones
                                presenciales; ahorra tiempo y recursos.
                            </p>
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-semibold text-fuchsia-900">
                                Herramientas de Creatividad
                            </h1>
                            <p className="text-xl font-serif text-zinc-500">
                                Accede a una gama de herramientas para dar vida
                                a tus ideas musicales, desde la escritura de
                                partituras hasta la grabación en línea.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LandingPage;
