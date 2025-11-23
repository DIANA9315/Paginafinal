import React, { useState, useEffect } from 'react';

// API URL para obtener fotos (simulando ser playeras)
const FAKE_API_URL = 'https://jsonplaceholder.typicode.com/photos';

// Configuración de colores y estilos del tema Biker
const theme = {
    darkLeather: '#1c1c1c',
    black: '#0a0a0a',
    chromeLight: '#cccccc',
    dangerRed: '#cc0000',
};

const bikerFontStyles = {
    fontFamily: 'Impact, sans-serif',
    letterSpacing: '2px',
};

// Componente de Tarjeta de Playera
const TshirtCard = React.memo(({ product }) => {
    
    // Placeholder temático que simula una playera (Negro/Gris con texto Biker)
    // Esto asegura que cargue una imagen con estilo Biker sin depender de la API de prueba
    const thematicPlaceholder = "https://placehold.co/350x350/202020/6e6e6e?text=DESIGN+V8";

    return (
        <div 
            className="p-5 rounded-xl shadow-lg transition-all hover:-translate-y-1"
            style={{ 
                backgroundColor: theme.darkLeather, 
                border: `2px solid ${theme.chromeLight}`, 
                boxShadow: `0 4px 15px rgba(0, 0, 0, 0.8), 0 0 10px ${theme.dangerRed}`
            }}
        >
            <img 
                // Usamos el placeholder temático para garantizar la carga y el estilo
                src={thematicPlaceholder} 
                alt={`Playera ${product.title}`} 
                className="w-full h-auto rounded border border-gray-600 mb-4 object-cover aspect-square"
                // El onError se mantiene por si el placeholder falla, aunque es muy raro
                onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = thematicPlaceholder; 
                }}
            />
            
            {/* El título es el título de la foto de la API, acortado */}
            <h3 
                className="text-xl uppercase mb-2 truncate" 
                title={product.title}
                style={{ ...bikerFontStyles, color: theme.chromeLight }}
            >
                {product.title.toUpperCase().substring(0, 30)}...
            </h3>
            
            <p className="text-sm italic mb-4 text-gray-400">
                Diseño exclusivo con la fuerza de un motor V8. Tela de algodón reforzado.
            </p>
            
            {/* Precio simulado */}
            <p 
                className="text-3xl mb-4" 
                style={{ ...bikerFontStyles, color: theme.dangerRed }}
            >
                $29.99
            </p> 
            
            <button 
                className="w-full py-3 rounded-md transition-all hover:bg-red-700"
                style={{
                    ...bikerFontStyles,
                    backgroundColor: theme.dangerRed,
                    color: '#f0f0f0',
                    border: `2px solid #f0f0f0`,
                    boxShadow: `0 4px ${theme.darkLeather}`,
                }}
            >
                AÑADIR AL CARRO
            </button>
        </div>
    );
});

// Componente principal de la aplicación
const App = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estilo global del cuerpo (equivalente a CSS body)
    const appStyle = {
        minHeight: '100vh',
        backgroundColor: theme.black,
        backgroundImage: `radial-gradient(circle at center, ${theme.darkLeather} 0%, ${theme.black} 100%)`,
        color: '#f0f0f0',
        padding: '1rem',
    };

    // useEffect para hacer la llamada a la API de fotos
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            const maxRetries = 3;
            
            for (let attempt = 0; attempt < maxRetries; attempt++) {
                try {
                    // Hacemos la llamada a la API de fotos y limitamos a 12 productos
                    const response = await fetch(FAKE_API_URL + '?_limit=12');
                    
                    if (!response.ok) {
                        throw new Error('No se pudo obtener la información de las playeras.');
                    }
                    
                    const data = await response.json();
                    setProducts(data); 
                    setIsLoading(false);
                    return; // Salir de la función si es exitoso
                } catch (err) {
                    console.error(`Intento ${attempt + 1} fallido:`, err);
                    if (attempt === maxRetries - 1) {
                         // Último intento fallido
                        setError("Error al cargar las playeras. Revisa tu conexión a Internet o intenta más tarde.");
                    } else {
                        // Esperar antes de reintentar (Exponencial backoff)
                        const delay = Math.pow(2, attempt) * 1000;
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            }
            setIsLoading(false);
        };

        fetchProducts();
    }, []); // Se ejecuta solo una vez al montar

    // -------------------
    // Renderizado
    // -------------------

    return (
        <div style={appStyle} className="min-h-screen">
            <header className="w-full text-center py-6 shadow-2xl mb-8" style={{ backgroundColor: theme.darkLeather }}>
                <h1 
                    className="text-5xl uppercase" 
                    style={{ ...bikerFontStyles, color: theme.dangerRed }}
                >
                    Hell's Angels Apparel
                </h1>
                <h2 
                    className="text-xl" 
                    style={{ ...bikerFontStyles, color: theme.chromeLight }}
                >
                    Catálogo de Playeras V8
                </h2>
            </header>

            <main className="max-w-7xl mx-auto">
                {/* Indicador de Carga */}
                {isLoading && (
                    <div 
                        className="text-center mt-20 text-3xl animate-pulse" 
                        style={{ ...bikerFontStyles, color: theme.dangerRed }}
                    >
                        Cargando el Garaje...
                    </div>
                )}

                {/* Mensaje de Error */}
                {error && (
                    <div className="text-red-500 border border-red-500 p-4 mt-10 rounded text-center">
                        {error}
                    </div>
                )}

                {/* Grid de Productos */}
                {!isLoading && !error && products.length > 0 && (
                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <TshirtCard key={product.id} product={product} />
                        ))}
                    </section>
                )}
                {!isLoading && !error && products.length === 0 && (
                    <div className="text-center mt-20 text-xl text-gray-500">
                        No se encontraron productos.
                    </div>
                )}
            </main>
             
            {/* Pie de página (Footer) con Contacto y Redes Sociales */}
            <footer className="w-full mt-12 py-10 border-t border-gray-700" style={{ backgroundColor: theme.black }}>
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left p-4">
                    
                    {/* Columna 1: Contacto */}
                    <div>
                        <h3 className="text-2xl uppercase mb-4" style={{ ...bikerFontStyles, color: theme.dangerRed }}>
                            Contacto Rápido
                        </h3>
                        <p className="text-sm mb-2">
                            <span className="text-gray-400">Dirección:</span> 666 V8 Road, Biker City, USA
                        </p>
                        <p className="text-sm mb-2">
                            <span className="text-gray-400">Teléfono:</span> +1 (555) 555-FIRE
                        </p>
                        <p className="text-sm">
                            <span className="text-gray-400">Email:</span>
                            <a href="mailto:support@hellsangels.apparel.com" className="hover:text-red-500 transition">soporte@v8apparel.com</a>
                        </p>
                    </div>

                    {/* Columna 2: Redes Sociales */}
                    <div className="md:text-center">
                        <h3 className="text-2xl uppercase mb-4" style={{ ...bikerFontStyles, color: theme.dangerRed }}>
                            Síguenos en la Carretera
                        </h3>
                        <div className="flex justify-center md:justify-center space-x-6">
                            {/* Iconos de redes sociales (Usando Placeholders) */}
                            <a href="#" className="text-3xl transition hover:text-red-500" style={bikerFontStyles} title="Facebook">FB</a>
                            <a href="#" className="text-3xl transition hover:text-red-500" style={bikerFontStyles} title="Instagram">IG</a>
                            <a href="#" className="text-3xl transition hover:text-red-500" style={bikerFontStyles} title="Twitter">X</a>
                        </div>
                    </div>

                    {/* Columna 3: Información Legal */}
                    <div className="md:text-right">
                        <h3 className="text-2xl uppercase mb-4" style={{ ...bikerFontStyles, color: theme.dangerRed }}>
                            Legal
                        </h3>
                        <p className="text-sm hover:text-red-500 transition cursor-pointer mb-2">
                            Política de Privacidad
                        </p>
                        <p className="text-sm hover:text-red-500 transition cursor-pointer">
                            Términos y Condiciones
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center mt-8 pt-4 border-t border-gray-800">
                    <p className="text-xs text-gray-500">
                        &copy; 2025 Hell's Angels Apparel. Todos los derechos reservados. | Powered by V8.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default App;