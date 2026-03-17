import React from 'react';

function QuoteCard({ quote, onSave, onRemove, onUpdateNote, isSaved, isAlreadySaved, onNewQuote }) {
    // Determine if it's a random quote (from API) or a saved quote (from Firestore)
    const text = quote.q || quote.text;
    const author = quote.a || quote.author;

    return (
        <article className={`quote-card ${isSaved ? 'saved-card' : ''}`}>
            <p className="quote-text">"{text}"</p>
            <p className="quote-author">- {author}</p>
            
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
                    <button aria-label="Remove from favorites" onClick={() => onRemove(quote.id)}>Remove from Favorites</button>
                ) : (
                    <>
                        <button aria-label={isAlreadySaved ? "Already saved to favorites" : "Save to favorites"} onClick={() => onSave(quote)} disabled={isAlreadySaved}>
                            {isAlreadySaved ? "Saved to Favorites" : "Save to Favorites"}
                        </button>
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
