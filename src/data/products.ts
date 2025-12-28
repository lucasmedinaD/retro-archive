export interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    buyUrl: string;
    category: 'APPAREL' | 'ACCESSORIES' | 'STICKERS';
    description: string;
}

const productsData = {
    en: [
        {
            id: "p1",
            name: "CYBER DEMON TEE",
            price: "$35.00",
            image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
            buyUrl: "https://www.redbubble.com/",
            category: "APPAREL",
            description: "Heavyweight cotton tee featuring high-contrast cyber-demonic sigils. Puff print finish. Oversized fit for maximum dystopian comfort."
        },
        {
            id: "p2",
            name: "NEON SOUL HOODIE",
            price: "$65.00",
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
            buyUrl: "https://www.redbubble.com/",
            category: "APPAREL",
            description: "Bio-luminescent aesthetic hoodie. 400gsm fleece. Generous hood depth for avoiding facial recognition scanners."
        },
        {
            id: "p3",
            name: "MECHA PROTOCOL CAP",
            price: "$25.00",
            image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop",
            buyUrl: "https://www.redbubble.com/",
            category: "ACCESSORIES",
            description: "Structured 5-panel cap with mecha protocol embroidery. Adjustable strap. Neutral tactical colorway."
        },
        {
            id: "p4",
            name: "DATA LOSS STICKER",
            price: "$4.00",
            image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?q=80&w=1000&auto=format&fit=crop",
            buyUrl: "https://www.redbubble.com/",
            category: "STICKERS",
            description: "Die-cut vinyl sticker. Weatherproof. Perfect for laptops, decks, and street signage."
        },
        {
            id: "p5",
            name: "GLITCH REALITY PHONE CASE",
            price: "$20.00",
            image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=1000&auto=format&fit=crop",
            buyUrl: "https://www.redbubble.com/",
            category: "ACCESSORIES",
            description: "Impact resistant case with glitch art print. Shock absorbing liner. Raises the question: is any of this real?"
        },
        {
            id: "p6",
            name: "VOID WALKER TOTE",
            price: "$18.00",
            image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop",
            buyUrl: "https://www.redbubble.com/",
            category: "ACCESSORIES",
            description: "Canvas tote bag for carrying contraband or groceries. Reinforced stitching. Voidwalker insignia print."
        }
    ],
    es: [
        {
            id: "p1",
            name: "CAMISETA CYBER DEMON",
            price: "$35.00",
            image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
            buyUrl: "https://www.redbubble.com/",
            category: "ROPA",
            description: "Camiseta de algodón pesado con símbolos ciber-demoníacos de alto contraste. Acabado en relieve. Corte oversize para máximo confort distópico."
        },
        {
            id: "p2",
            name: "SUDADERA NEON SOUL",
            price: "$65.00",
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
            buyUrl: "https://www.redbubble.com/",
            category: "ROPA",
            description: "Sudadera con estética bioluminiscente. Felpa de 400gsm. Capucha profunda para evitar escáneres de reconocimiento facial."
        },
        {
            id: "p3",
            name: "GORRA MECHA PROTOCOL",
            price: "$25.00",
            image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop",
            buyUrl: "https://www.redbubble.com/",
            category: "ACCESORIOS",
            description: "Gorra estructurada de 5 paneles con bordado de protocolo mecha. Correa ajustable. Color táctico neutral."
        },
        {
            id: "p4",
            name: "PEGATINA DATA LOSS",
            price: "$4.00",
            image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?q=80&w=1000&auto=format&fit=crop",
            buyUrl: "https://www.redbubble.com/",
            category: "STICKERS",
            description: "Pegatina de vinilo troquelada. Resistente a la intemperie. Perfecta para portátiles, tablas y señalización urbana."
        },
        {
            id: "p5",
            name: "FUNDA GLITCH REALITY",
            price: "$20.00",
            image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=1000&auto=format&fit=crop",
            buyUrl: "https://www.redbubble.com/",
            category: "ACCESORIOS",
            description: "Funda resistente a impactos con impresión de arte glitch. Forro absorbente de golpes. Plantea la pregunta: ¿es algo de esto real?"
        },
        {
            id: "p6",
            name: "BOLSA VOID WALKER",
            price: "$18.00",
            image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop",
            buyUrl: "https://www.redbubble.com/",
            category: "ACCESORIOS",
            description: "Bolsa de lona para llevar contrabando o comestibles. Costuras reforzadas. Estampado de insignia Voidwalker."
        }
    ]
};

export const getProducts = (lang: 'en' | 'es'): Product[] => {
    return productsData[lang] || productsData['en'];
};
