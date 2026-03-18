import { useState, useEffect } from "react";
import QuoteCard from "../components/QuoteCard";
import QuoteOfTheDay from "../components/QuoteOfTheDay";
import { 
    saveQuote, 
    getSavedQuotes, 
    removeSavedQuote,
    updateQuoteNote
} from "../services/firestore";
import { useAuth } from "../context/AuthContext";

/**
 * Main application page for interacting with quotes.
 * Handles fetching daily/random quotes from an API, saving to Firebase,
 * and managing the user's personal favorites list.
 */
function Quotes() {
    const { user } = useAuth();
    
    // Core Application State
    const [qotd, setQotd] = useState(null);
    const [quotes, setQuotes] = useState([]);
    
    // Persist the currently viewed random quote across hot-reloads/navigation using sessionStorage
    const [currentRandomQuote, setCurrentRandomQuote] = useState(() => {
        const saved = sessionStorage.getItem("droplet_current_random_quote");
        return saved ? JSON.parse(saved) : null;
    });
    
    // User Data State
    const [savedQuotes, setSavedQuotes] = useState([]);
    
    // UI Feedback State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFavorites, setShowFavorites] = useState(false); // Toggles between 'Browse' and 'Favorites'

    // Update session storage whenever the user cycles to a new random quote
    useEffect(() => {
        if (currentRandomQuote) {
            sessionStorage.setItem("droplet_current_random_quote", JSON.stringify(currentRandomQuote));
        }
    }, [currentRandomQuote]);

    // Initial data hydration (API fetching & Firebase sync)
    useEffect(() => {
        const fetchQuotes = async () => {
            console.log("Fetching quotes (UI Critical)...");
            const now = Date.now();
            
            // Look for cached API data to prevent rate-limiting
            const cachedQotd = JSON.parse(localStorage.getItem("droplet_qotd"));
            const cachedQuotes = JSON.parse(localStorage.getItem("droplet_random_quotes"));

            /**
             * Helper to fetch data with an abort controller to prevent hanging requests
             */
            const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), timeout);
                try {
                    const response = await fetch(url, { ...options, signal: controller.signal });
                    clearTimeout(id);
                    return response;
                } catch (e) {
                    clearTimeout(id);
                    throw e;
                }
            };

            const quoteTasks = [];

            // 1. Fetch Quote of the Day (24-hour cache limit)
            if (cachedQotd && (now - cachedQotd.timestamp < 24 * 60 * 60 * 1000)) {
                setQotd(cachedQotd.data);
            } else {
                quoteTasks.push(
                    fetchWithTimeout("/api/today")
                        .then(res => res.ok ? res.json() : Promise.reject(new Error("Failed to fetch Quote of the Day")))
                        .then(data => {
                            if (data && data[0]) {
                                setQotd(data[0]);
                                localStorage.setItem("droplet_qotd", JSON.stringify({ data: data[0], timestamp: now }));
                            }
                        }).catch((e) => {
                            console.error("Failed to load QOTD:", e);
                            setError("Could not load the Quote of the Day. Please try again later.");
                        })
                );
            }

            // 2. Fetch bulk Random Quotes (1-hour cache limit)
            if (cachedQuotes && (now - cachedQuotes.timestamp < 60 * 60 * 1000)) {
                setQuotes(cachedQuotes.data);
            } else {
                quoteTasks.push(
                    fetchWithTimeout("/api/quotes")
                        .then(res => res.ok ? res.json() : Promise.reject(new Error("Failed to fetch quotes")))
                        .then(data => {
                            if (Array.isArray(data)) {
                                setQuotes(data);
                                localStorage.setItem("droplet_random_quotes", JSON.stringify({ data: data, timestamp: now }));
                            }
                        }).catch((e) => {
                            console.error("Failed to load quotes:", e);
                            setError("Could not load inspiration quotes. Please try again later.");
                        })
                );
            }

            // Wait for both API requests (if any) to resolve
            await Promise.allSettled(quoteTasks);
            
            // 3. Sync user's saved quotes from Firestore
            if (user) {
                try {
                    console.log("Quotes.jsx: Fetching favorites...");
                    const saved = await getSavedQuotes(user.uid);
                    setSavedQuotes(saved);
                } catch (e) {
                    console.warn("Quotes.jsx: Firebase sync failed:", e.message);
                }
            }

            // Initialization complete
            setLoading(false);
        };

        if (user) {
            fetchQuotes();
        }
    }, [user]);

    /**
     * Persists a quote to Firestore and updates local state.
     * Prevents saving duplicates.
     */
    const handleSaveQuote = async (quote) => {
        if (!user) return;
        
        const text = quote.q || quote.text;
        const isDuplicate = savedQuotes.some(q => (q.q || q.text) === text);
        
        if (isDuplicate) {
            alert("This quote is already in your favorites!");
            return;
        }

        try {
            await saveQuote(user.uid, quote);
            // Re-fetch to guarantee sync with server
            const updatedSaved = await getSavedQuotes(user.uid);
            setSavedQuotes(updatedSaved);
        } catch (err) {
            console.error("Error saving quote:", err);
        }
    };

    /**
     * Deletes a quote from Firestore and updates local state.
     */
    const handleRemoveQuote = async (quoteId) => {
        if (!user) return;
        try {
            await removeSavedQuote(user.uid, quoteId);
            setSavedQuotes(savedQuotes.filter(q => q.id !== quoteId));
        } catch (err) {
            console.error("Error removing quote:", err);
        }
    };

    /**
     * Updates the personal notes attached to a saved quote.
     */
    const handleUpdateNote = async (quoteId, note) => {
        if (!user) return;
        try {
            await updateQuoteNote(user.uid, quoteId, note);
            setSavedQuotes(savedQuotes.map(q => q.id === quoteId ? { ...q, notes: note } : q));
        } catch (err) {
            console.error("Error updating note:", err);
        }
    };

    /**
     * Pulls a random quote from the local cache to display as the current discovery quote.
     */
    const handleNewRandomQuote = () => {
        if (quotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            setCurrentRandomQuote(quotes[randomIndex]);
        }
    };

    /**
     * Swaps the view back to the discovery tab.
     */
    const handleRandomQuoteClick = () => {
        setShowFavorites(false);
    };

    /**
     * Helper to determine if a quote currently exists in the user's favorites.
     * Used to disable the 'Save' button.
     */
    const isQuoteSaved = (quote) => {
        if (!quote) return false;
        return savedQuotes.some(q => (q.q || q.text) === (quote.q || quote.text));
    };

    // Render loading or error states before attempting to render the main UI
    if (loading) return <div id="loading-text"><p>Loading quotes...</p></div>;
    if (error) return <div className="error"><p>Error: {error}</p></div>;

    return (
        <div className="quotes-container">
            {/* Hero Section */}
            <QuoteOfTheDay 
                qotd={qotd} 
                onSave={handleSaveQuote} 
                isAlreadySaved={isQuoteSaved(qotd)}
            />

            {/* Navigation Tabs */}
            <div className="quotes-nav">
                <button onClick={handleRandomQuoteClick} className={!showFavorites ? "active" : ""}>Random Quote</button>
                <button onClick={() => setShowFavorites(true)} className={showFavorites ? "active" : ""}>Favorites</button>
            </div>

            {/* View Switching Logic */}
            {!showFavorites ? (
                <section className="browse-section">
                    <div className="single-quote-display">
                        {currentRandomQuote ? (
                            <QuoteCard 
                                quote={currentRandomQuote} 
                                onSave={handleSaveQuote} 
                                isSaved={false} 
                                isAlreadySaved={isQuoteSaved(currentRandomQuote)}
                                onNewQuote={handleNewRandomQuote}
                            />
                        ) : (
                            <div className="empty-random-state" style={{ textAlign: 'center', padding: '2rem' }}>
                                <p>Ready for some inspiration?</p>
                                <button onClick={handleNewRandomQuote} className="new-quote-btn">Get a Random Quote</button>
                            </div>
                        )}
                    </div>
                </section>
            ) : (
                <section className="saved-section">
                    <h1>Favorites</h1>
                    <div className="quotes-grid">
                        {savedQuotes.map(quote => (
                            <QuoteCard 
                                key={quote.id} 
                                quote={quote} 
                                onRemove={handleRemoveQuote}
                                onUpdateNote={handleUpdateNote}
                                isSaved={true} 
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Footer Attribution for API usage requirements */}
            <div className="attribution">
                Inspirational quotes provided by <a href="https://zenquotes.io/" target="_blank" rel="noopener noreferrer">ZenQuotes.io</a>
            </div>
        </div>
    );
}

export default Quotes;
