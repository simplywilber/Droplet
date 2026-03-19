import { db } from "../firebase";
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    updateDoc,
    setDoc
} from "firebase/firestore";

/**
 * Saves a new quote to the user's "savedQuotes" collection in Firestore.
 * Uses a deterministic ID based on the quote content to prevent duplicates
 * even if multiple save requests are sent simultaneously.
 * 
 * @param {string} userId - The Firebase Auth UID of the current user
 * @param {Object} quote - The quote object to save
 */
export const saveQuote = async (userId, quote) => {
    const text = quote.q || quote.text;
    const author = quote.a || quote.author;
    
    // Generate a deterministic hash for the quote content to use as a document ID
    const msgBuffer = new TextEncoder().encode(`${text}-${author}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const quoteId = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);

    const quoteRef = doc(db, "users", userId, "savedQuotes", quoteId);
    
    await setDoc(quoteRef, {
        text,
        author,
        notes: "",
        savedAt: Date.now(),
        listId: "Favorites" // legacy compat
    }, { merge: true }); // Use merge to prevent overwriting existing notes if somehow called again
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