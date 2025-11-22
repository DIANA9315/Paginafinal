import { useState, useEffect } from 'react';
import './App.css'; // Importante: para que los estilos de motociclista funcionen

// URL de la API fake que provee fotos (simula ser playeras)
const FAKE_API_URL = 'https://jsonplaceholder.typicode.com/photos';

// Componente individual para mostrar una playera
const TshirtCard = ({ product }) => (
    <div className="card">
        {/* Usamos el URL de la miniatura que trae la API para la imagen */}
        <img 
            src={product.thumbnailUrl} 
            alt={`Playera ${product.title}`} 
            className="product-image"
            // Si la imagen falla, muestra un placeholder motero
            onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/350x350/1C1C1C/CC0000?text=SKULL"; 
            }}
        />
        {/* El título es el título de la foto de la API, acortado */}
        <h3 className="text-xl font-bold">{product.title.toUpperCase().substring(0, 30)}...</h3>
        
        <p className="text-sm italic mb-4 text-gray-400">
            Diseño exclusivo con la fuerza de un motor V8. Tela de algodón reforzado.
        </p>
        
        {/* Precio simulado */}
        <p className="text-2xl font-bold text-red-600 mb-3">$29.99</p> 
        
        <button className="btn-primary">
            AÑADIR AL CARRO
        </button>
    </div>
);


// Componente principal de la aplicación
export default function App() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect para hacer la llamada a la API de fotos
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Hacemos la llamada a la API de fotos y limitamos a 12 productos
                const response = await fetch(FAKE_API_URL + '?_limit=12');
                
                if (!response.ok) {
                    throw new Error('No se pudo obtener la información de las playeras.');
                }
                
                const data = await response.json();
                
                setProducts(data); 
            } catch (err) {
                console.error("Error al cargar los datos:", err);
                setError("Error al cargar las playeras. Revisa tu conexión a Internet.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []); // Se ejecuta solo una vez al montar

    // -------------------
    // Renderizado
    // -------------------

    return (
        <div className="App">
            <header className="w-full bg-dark-leather py-6 shadow-2xl">
                <h1>Hell's Angels Apparel</h1>
                <h2 className="text-xl text-chrome-light">Catálogo de Playeras V8</h2>
            </header>

            <main className="w-full p-4 flex flex-col items-center">
                {/* Indicador de Carga */}
                {isLoading && (
                    <div className="text-3xl mt-20 text-danger-red animate-pulse">
                        Cargando el Garaje...
                    </div>
                )}

                {/* Mensaje de Error */}
                {error && (
                    <div className="text-red-600 border border-red-600 p-4 mt-10 rounded">
                        {error}
                    </div>
                )}

                {/* Grid de Productos */}
                {!isLoading && !error && (
                    <section className="tshirts-grid">
                        {products.map(product => (
                            <TshirtCard key={product.id} product={product} />
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}