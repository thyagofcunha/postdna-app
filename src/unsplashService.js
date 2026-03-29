/**
 * Unsplash Service - PostDNA
 * Alta performance para busca de imagens reais de grife.
 */

const UNSPLASH_ACCESS_KEY = ''; // Thyago: Insira sua Access Key do Unsplash aqui

export const searchUnsplashImages = async (query, page = 1, perPage = 12) => {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn("Unsplash Access Key ausente. Usando mock de imagens.");
    return [
      { id: 1, url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800', alt: 'Luxo' },
      { id: 2, url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800', alt: 'Business' },
      { id: 3, url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800', alt: 'Elegance' },
    ];
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const data = await response.json();
    return data.results.map(img => ({
      id: img.id,
      url: img.urls.regular,
      thumb: img.urls.small,
      author: img.user.name,
      link: img.links.html
    }));
  } catch (error) {
    console.error("Erro ao buscar no Unsplash:", error);
    return [];
  }
};
