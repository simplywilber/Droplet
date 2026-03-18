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

function Quotes() {
    const { user } = useAuth();
    const [qotd, setQotd] = useState(null);
    const [quotes, setQuotes] = useState([]);
    const [currentRandomQuote, setCurrentRandomQuote] = useState(() => {
        const saved = sessionStorage.getItem("droplet_current_random_quote");
        return saved ? JSON.parse(saved) : null;
    });
    const [savedQuotes, setSavedQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFavorites, setShowFavorites] = useState(false);

    useEffect(() => {
        if (currentRandomQuote) {
            sessionStorage.setItem("droplet_current_random_quote", JSON.stringify(currentRandomQuote));
        }
    }, [currentRandomQuote]);

    useEffect(() => {
        const fetchQuotes = async () => {
            console.log("Fetching quotes (UI Critical)...");
            const now = Date.now();
            const cachedQotd = JSON.parse(localStorage.getItem("droplet_qotd"));
            const cachedQuotes = JSON.parse(localStorage.getItem("droplet_random_quotes"));

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

            if (cachedQotd && (now - cachedQotd.timestamp < 24 * 60 * 60 * 1000)) {
                setQotd(cachedQotd.data);
            } else {
                quoteTasks.push(
                    fetchWithTimeout("/api/today")
                        .then(res => res.ok ? res.json() : null)
                        .then(data => {
                            if (data && data[0]) {
                                setQotd(data[0]);
                                localStorage.setItem("droplet_qotd", JSON.stringify({ data: data[0], timestamp: now }));
                            }
                        }).catch(() => {})
                );
            }

            if (cachedQuotes && (now - cachedQuotes.timestamp < 60 * 60 * 1000)) {
                setQuotes(cachedQuotes.data);
                // Do not set current random quote automatically on load
            } else {
                quoteTasks.push(
                    fetchWithTimeout("/api/quotes")
                        .then(res => res.ok ? res.json() : null)
                        .then(data => {
                            if (Array.isArray(data)) {
                                setQuotes(data);
                                localStorage.setItem("droplet_random_quotes", JSON.stringify({ data: data, timestamp: now }));
                                // Do not set current random quote automatically on load
                            }
                        }).catch(() => {})
                );
            }

            await Promise.allSettled(quoteTasks);
            
            if (user) {
                try {
                    console.log("Quotes.jsx: Fetching favorites...");
                    const saved = await getSavedQuotes(user.uid);
                    setSavedQuotes(saved);
                } catch (e) {
                    console.warn("Quotes.jsx: Firebase sync failed:", e.message);
                }
            }

            setLoading(false);
        };

        if (user) {
            fetchQuotes();
        }
    }, [user]);

    const handleSaveQuote = async (quote) => {
        if (!user) return;
        
        // Prevent duplicates
        const text = quote.q || quote.text;
        const isDuplicate = savedQuotes.some(q => (q.q || q.text) === text);
        
        if (isDuplicate) {
            alert("This quote is already in your favorites!");
            return;
        }

        try {
            await saveQuote(user.uid, quote);
            const updatedSaved = await getSavedQuotes(user.uid);
            setSavedQuotes(updatedSaved);
        } catch (err) {
            console.error("Error saving quote:", err);
        }
    };

    const handleRemoveQuote = async (quoteId) => {
        if (!user) return;
        try {
            await removeSavedQuote(user.uid, quoteId);
            setSavedQuotes(savedQuotes.filter(q => q.id !== quoteId));
        } catch (err) {
            console.error("Error removing quote:", err);
        }
    };

    const handleUpdateNote = async (quoteId, note) => {
        if (!user) return;
        try {
            await updateQuoteNote(user.uid, quoteId, note);
            setSavedQuotes(savedQuotes.map(q => q.id === quoteId ? { ...q, notes: note } : q));
        } catch (err) {
            console.error("Error updating note:", err);
        }
    };

    const handleNewRandomQuote = () => {
        if (quotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            setCurrentRandomQuote(quotes[randomIndex]);
        }
    };

    const handleRandomQuoteClick = () => {
        setShowFavorites(false);
    };

    const isQuoteSaved = (quote) => {
        if (!quote) return false;
        return savedQuotes.some(q => (q.q || q.text) === (quote.q || quote.text));
    };

    if (loading) return <div id="loading-text"><p>Loading quotes...</p></div>;
    if (error) return <div className="error"><p>Error: {error}</p></div>;

    return (
        <div className="quotes-container">
            <QuoteOfTheDay 
                qotd={qotd} 
                onSave={handleSaveQuote} 
                isAlreadySaved={isQuoteSaved(qotd)}
            />

            <div className="quotes-nav">
                <button onClick={handleRandomQuoteClick} className={!showFavorites ? "active" : ""}>Random Quote</button>
                <button onClick={() => setShowFavorites(true)} className={showFavorites ? "active" : ""}>Favorites</button>
            </div>

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

            <div className="attribution">
                Inspirational quotes provided by <a href="https://zenquotes.io/" target="_blank" rel="noopener noreferrer">ZenQuotes.io</a>
            </div>
        </div>
    );
}

export default Quotes;
