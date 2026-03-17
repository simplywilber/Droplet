import React from 'react';
import QuoteCard from './QuoteCard';

function QuoteOfTheDay({ qotd, onSave, isAlreadySaved }) {
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
