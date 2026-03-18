import React from 'react';
import QuoteCard from './QuoteCard';

/**
 * A specialized wrapper component for displaying the "Quote of the Day"
 * in a highlighted hero section.
 *
 * @param {Object} props
 * @param {Object} props.qotd - The quote object representing the daily quote
 * @param {Function} props.onSave - Callback triggered when the user saves the quote
 * @param {boolean} props.isAlreadySaved - Boolean flag preventing duplicate saves
 */
function QuoteOfTheDay({ qotd, onSave, isAlreadySaved }) {
    // Fail gracefully if data isn't available yet
    if (!qotd) return null;

    return (
        <section className="qotd-section">
            <h1>Quote of the Day</h1>
            <div className="qotd-card-wrapper">
                <QuoteCard 
                    quote={qotd} 
                    onSave={onSave} 
                    isSaved={false} 
                    isAlreadySaved={isAlreadySaved}
                />
            </div>
        </section>
    );
}

export default QuoteOfTheDay;
