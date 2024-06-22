import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchNews, setCategory, setPage, searchNews } from '../slices/newsSlice';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { HeartIcon } from 'lucide-react';

const Homepage = () => {
    const dispatch = useDispatch();
    const { articles, status, error, currentPage, totalResults, category } = useSelector(state => state.news);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        dispatch(fetchNews({ category, page: currentPage }));
    }, [dispatch, category, currentPage]);

    useEffect(() => {
        if (status === 'succeeded') {
            setIsLoading(false);
        }
    }, [status]);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const handleCategoryChange = (newCategory) => {
        setIsLoading(true);
        dispatch(setCategory(newCategory));
    };

    const handlePageChange = (newPage) => {
        setIsLoading(true);
        dispatch(setPage(newPage));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setIsLoading(true);
            dispatch(searchNews(searchTerm));
        }
    };

    const toggleFavorite = (article) => {
        setFavorites(prevFavorites => {
            const isAlreadyFavorite = prevFavorites.some(fav => fav.url === article.url);
            if (isAlreadyFavorite) {
                return prevFavorites.filter(fav => fav.url !== article.url);
            } else {
                return [...prevFavorites, article];
            }
        });
    };

    const isFavorite = (article) => favorites.some(fav => fav.url === article.url);

    if (status === 'failed') {
        return <div className="text-red-500 text-center">Error: {error}</div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                    News Categories
                </h2>
                <div className="flex flex-wrap gap-4 mb-6">
                    {['general', 'business', 'technology', 'entertainment'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-6 py-3 rounded-full text-lg transition-all duration-300 transform hover:scale-105 ${category === cat
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                : 'bg-white text-gray-800 hover:shadow-lg'
                                }`}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search news..."
                        className="flex-grow px-4 py-2 rounded-full border-2 border-gray-300 focus:outline-none focus:border-purple-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Search
                    </button>
                </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                            <div className="w-full h-48 bg-gray-300"></div>
                            <div className="p-4">
                                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    articles
                        .filter(article =>
                            article.title !== "[Removed]" &&
                            article.description !== "[Removed]" &&
                            article.urlToImage
                        )
                        .map(article => (
                            <div key={article.url} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                                <LazyLoadImage
                                    src={article.urlToImage}
                                    alt={article.title}
                                    effect="blur"
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h2>
                                    <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>
                                    <div className='flex justify-between'>

                                        <Link
                                            to={`/article/${encodeURIComponent(article.url)}`}
                                            className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                                        >
                                            Read more
                                        </Link>
                                        <button
                                            onClick={() => toggleFavorite(article)}
                                            className={`p-2 rounded-full transition-colors duration-300 ${isFavorite(article) ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-500'
                                                }`}
                                        >
                                            <HeartIcon
                                                className={`w-6 h-6 ${isFavorite(article) ? 'fill-current' : 'stroke-current'}`}
                                                fill={isFavorite(article) ? 'currentColor' : 'none'}
                                                strokeWidth={2}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                )}
            </div>
            <div className="mt-12 flex justify-center gap-4">
                {currentPage > 1 && (
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Previous
                    </button>
                )}
                {currentPage < Math.ceil(totalResults / 10) && (
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default Homepage;