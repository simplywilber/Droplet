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
    const [isEditingNote, setIsEditingNote] = useState(false);
    
    // Normalize data structure: 
    // Random quotes from API usually use 'q' and 'a'
    // Saved quotes from Firestore might use 'text' and 'author' depending on legacy schema
    const text = quote.q || quote.text;
    const author = quote.a || quote.author;

    const toggleNoteEditing = (e) => {
        setIsEditingNote(!isEditingNote);
        e.currentTarget.blur();
    };

    const handleNoteBlur = (e) => {
        onUpdateNote(quote.id, e.target.value);
        // We keep it open if it's not empty, or maybe close it? 
        // User asked to hide while not being created or edited.
        // Let's keep it open while editing, and allow toggling it off.
    };

    return (
        <article className={`quote-card ${isSaved ? 'saved-card' : ''}`}>
            <p className="quote-text">"{text}"</p>
            <p className="quote-author">- {author}</p>
            
            {/* Render note-taking UI only for quotes in the Favorites list */}
            {isSaved && onUpdateNote && isEditingNote && (
                <div className="quote-notes">
                    <textarea 
                        aria-label={`Personal notes for quote by ${author}`}
                        placeholder="Add personal notes..."
                        defaultValue={quote.notes}
                        onBlur={handleNoteBlur}
                        autoFocus
                    />
                </div>
            )}

            {isSaved && quote.notes && !isEditingNote && (
                <div className="quote-display-notes">
                    <p><strong>Note:</strong> {quote.notes}</p>
                </div>
            )}

            <div className="quote-actions">
                {isSaved ? (
                    // Action for quotes in the Favorites list
                    <div className="favorite-actions">
                        <button 
                            className={`icon-btn edit-note-btn ${isEditingNote ? 'active' : ''}`} 
                            aria-label="Edit note" 
                            onClick={toggleNoteEditing}
                            onMouseDown={(e) => e.preventDefault()}
                            title={isEditingNote ? "Close notes" : "Edit note"}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                            </svg>
                        </button>
                        <button 
                            className="icon-btn delete-btn" 
                            aria-label="Remove from favorites" 
                            onClick={() => onRemove(quote.id)}
                            title="Remove from favorites"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </div>
                ) : (
                    // Actions for discovery mode (Random / QOTD)
                    <>
                        <button 
                            aria-label={isAlreadySaved ? "Already saved to favorites" : "Save to favorites"} 
                            onClick={() => onSave(quote)} 
                            disabled={isAlreadySaved}
                        >
                            {isAlreadySaved ? "Saved to Favorites" : "Save to Favorites"}
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
