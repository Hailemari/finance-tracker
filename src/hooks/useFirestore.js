import { useState } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export function useFirestore(collectionName) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add a document
  const addDocument = async (data) => {
    try {
      await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date()
      });
      return { success: true };
    } catch (err) {
      console.error('Error adding document:', err);
      setError('Could not add document');
      return { success: false, error: err.message };
    }
  };

  // Delete a document
  const deleteDocument = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Could not delete document');
      return { success: false, error: err.message };
    }
  };

  // Update a document
  const updateDocument = async (id, updates) => {
    try {
      await updateDoc(doc(db, collectionName, id), updates);
      return { success: true };
    } catch (err) {
      console.error('Error updating document:', err);
      setError('Could not update document');
      return { success: false, error: err.message };
    }
  };

  // Get documents by user ID
  const getDocumentsByUser = async (userId) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, collectionName),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      let results = [];
      
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      
      setDocuments(results);
      setLoading(false);
      return results;
    } catch (err) {
      console.error('Error getting documents:', err);
      setError('Could not fetch documents');
      setLoading(false);
      return [];
    }
  };

  return { 
    documents, 
    loading, 
    error, 
    addDocument, 
    deleteDocument, 
    updateDocument, 
    getDocumentsByUser 
  };
}