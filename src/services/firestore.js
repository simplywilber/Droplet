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
 * Saves a new quote to the user's "savedQuotes" collection in Firestore.
 * 
 * @param {string} userId - The Firebase Auth UID of the current user
 * @param {Object} quote - The quote object to save
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
 * Retrieves all saved quotes for a specific user.
 * Automatically sorts them locally by their saved timestamp (newest first).
 * 
 * @param {string} userId - The Firebase Auth UID
 * @returns {Promise<Array>} Array of quote objects with document IDs
 */
export const getSavedQuotes = async (userId) => {
    const savedQuotesRef = collection(db, "users", userId, "savedQuotes");
    const querySnapshot = await getDocs(savedQuotesRef);
    
    // Sort in memory to avoid needing complex Firestore indexes for simple queries
    return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
};

/**
 * Updates the personal notes field for a specific saved quote.
 * 
 * @param {string} userId - The Firebase Auth UID
 * @param {string} quoteId - The Firestore document ID of the quote
 * @param {string} note - The updated note string
 */
export const updateQuoteNote = async (userId, quoteId, note) => {
    const quoteRef = doc(db, "users", userId, "savedQuotes", quoteId);
    await updateDoc(quoteRef, { notes: note });
};

/**
 * Permanently deletes a saved quote from the user's Firestore collection.
 * 
 * @param {string} userId - The Firebase Auth UID
 * @param {string} quoteId - The Firestore document ID of the quote
 */
export const removeSavedQuote = async (userId, quoteId) => {
    await deleteDoc(doc(db, "users", userId, "savedQuotes", quoteId));
};