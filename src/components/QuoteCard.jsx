import React, { useState } from 'react';

/**
 * A reusable UI component for displaying a single quote.
 * Supports different modes depending on whether the quote is "saved" (from Firestore)
 * or a "random" discovery quote (from API).
 *
 * @param {Object} props
 * @param {Object} props.quote - The quote data object
 * @param {Function} props.onSave - Callback when saving a quote
 * @param {Function} props.onRemove - Callback when removing a saved quote
 * @param {Function} props.onUpdateNote - Callback when a user updates their personal note
 * @param {boolean} props.isSaved - Flag indicating if this quote is currently being viewed in the 'Favorites' list
 * @param {boolean} props.isAlreadySaved - Flag indicating if this quote already exists in the user's favorites
 * @param {Function} props.onNewQuote - Callback to request a new random quote (only used in discovery mode)
 */
function QuoteCard({ quote, onSave, onRemove, onUpdateNote, isSaved, isAlreadySaved, onNewQuote }) {
    const [isSaving, setIsSaving] = useState(false);

    // Normalize data structure: 
    // Random quotes from API usually use 'q' and 'a'
    // Saved quotes from Firestore might use 'text' and 'author' depending on legacy schema
    const text = quote.q || quote.text;
    const author = quote.a || quote.author;

    const handleSave = async () => {
        if (isSaving || isAlreadySaved) return;
        
        setIsSaving(true);
        try {
            await onSave(quote);
        } catch (error) {
            console.error("Failed to save quote:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <article className={`quote-card ${isSaved ? 'saved-card' : ''}`}>
            <p className="quote-text">"{text}"</p>
            <p className="quote-author">- {author}</p>
            
            {/* Render note-taking UI only for quotes in the Favorites list */}
            {isSaved && onUpdateNote && (
                <div className="quote-notes">
                    <textarea 
                        aria-label={`Personal notes for quote by ${author}`}
                        placeholder="Add personal notes..."
                        defaultValue={quote.notes}
                        onBlur={(e) => onUpdateNote(quote.id, e.target.value)}
                    />
                </div>
            )}

            <div className="quote-actions">
                {isSaved ? (
                    // Action for quotes in the Favorites list
                    <button aria-label="Remove from favorites" onClick={() => onRemove(quote.id)}>Remove from Favorites</button>
                ) : (
                    // Actions for discovery mode (Random / QOTD)
                    <>
                        <button 
                            aria-label={isSaving ? "Saving quote" : (isAlreadySaved ? "Already saved to favorites" : "Save to favorites")} 
                            onClick={handleSave} 
                            disabled={isAlreadySaved || isSaving}
                        >
                            {isSaving ? "Saving..." : (isAlreadySaved ? "Saved to Favorites" : "Save to Favorites")}
                        </button>
                        
                        {/* Only show 'New Quote' button if the callback is provided (e.g., Random Quote generator) */}
                        {onNewQuote && (
                            <button aria-label="Get a new random quote" onClick={onNewQuote} className="new-quote-btn">New Quote</button>
                        )}
                    </>
                )}
            </div>
        </article>
    );
}

export default QuoteCard;
