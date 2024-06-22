import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
console.log('API_KEY:', process.env.REACT_APP_NEWS_API_KEY)
const BASE_URL = 'https://newsapi.org/v2';

export const fetchNews = createAsyncThunk(
    'news/fetchNews',
    async ({ category, page }) => {
        const response = await axios.get(`${BASE_URL}/top-headlines`, {
            params: {
                country: 'us',
                category,
                page,
                pageSize: 10,
                apiKey: API_KEY,
            },
        });
        return response.data;
    }
);

export const searchNews = createAsyncThunk(
    'news/searchNews',
    async (searchTerm) => {
        const response = await axios.get(`${BASE_URL}/everything`, {
            params: {
                q: searchTerm,
                pageSize: 10,
                apiKey: API_KEY,
            },
        });
        return response.data;
    }
);

const newsSlice = createSlice({
    name: 'news',
    initialState: {
        articles: [],
        status: 'idle',
        error: null,
        currentPage: 1,
        totalResults: 0,
        category: 'general',
    },
    reducers: {
        setCategory: (state, action) => {
            state.category = action.payload;
            state.currentPage = 1;
        },
        setPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNews.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.articles = action.payload.articles;
                state.totalResults = action.payload.totalResults;
            })
            .addCase(fetchNews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(searchNews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(searchNews.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.articles = action.payload.articles;
                state.totalResults = action.payload.totalResults;
            })
            .addCase(searchNews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setCategory, setPage } = newsSlice.actions;
export default newsSlice.reducer;