import { db } from "../firebase";
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    updateDoc
} from "firebase/firestore";

/**
 * Saves a quote to favorites.
 */
export const saveQuote = async (userId, quote) => {
    const savedQuotesRef = collection(db, "users", userId, "savedQuotes");
    await addDoc(savedQuotesRef, {
        text: quote.q || quote.text,
        author: quote.a || quote.author,
        notes: "",
        savedAt: Date.now(),
        listId: "Favorites" // legacy compat
    });
};

/**
 * Gets all saved quotes for a user.
 */
export const getSavedQuotes = async (userId) => {
    const savedQuotesRef = collection(db, "users", userId, "savedQuotes");
    const querySnapshot = await getDocs(savedQuotesRef);
    
    // Sort in memory to avoid indexing requirements
    return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
};

/**
 * Updates the notes for a specific saved quote.
 */
export const updateQuoteNote = async (userId, quoteId, note) => {
    const quoteRef = doc(db, "users", userId, "savedQuotes", quoteId);
    await updateDoc(quoteRef, { notes: note });
};

/**
 * Removes a quote from saved quotes.
 */
export const removeSavedQuote = async (userId, quoteId) => {
    await deleteDoc(doc(db, "users", userId, "savedQuotes", quoteId));
};
