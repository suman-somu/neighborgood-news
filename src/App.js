import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import ArticleDetail from './components/ArticleDetail';
import Homepage from './components/Homepage';

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/article/:id",
      element: <ArticleDetail />,
    },
  ]);

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
        <header className="bg-black text-white py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-white">
              ModernNews
            </h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <RouterProvider router={router} />
        </main>
        <footer className="bg-black text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <p>&copy; 2024 ModernNews. All rights reserved.</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Contact Us</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Provider>
  );
};

export default App;
