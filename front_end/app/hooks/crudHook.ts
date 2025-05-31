import { useState, useEffect } from 'react';
import axios from '@/axios';

export default function useCrud(baseUrl: string) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setopenForm] = useState(false);
    const [openFormDetail, setopenFormDetail] = useState(false);

    // READ
    const loadDataTable = () => {
        setLoading(true);
        axios.get(baseUrl)
            .then(res => {
                setData(res.data);
                setError(null);
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    };

    // CREATE
    const createItem = (newItem: object) => {
        setLoading(true);
        axios.post(baseUrl, newItem)
            .then(res => {
                if (res.data) {
                    console.log("check rest data ", res);
                    setData(res.data);
                    
                }
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    };

    // UPDATE
    const updateItem = async (id, updatedItem) => {
        // try {
        //   const res = await axios.put(`${baseUrl}/${id}`, updatedItem);
        //   setData(prev => prev.map(item => (item.id === id ? res.data : item)));
        // } catch (err) {
        //   setError(err);
        // }
    };

    // DELETE
    const deleteItem = async (id) => {
        // try {
        //   await axios.delete(`${baseUrl}/${id}`);
        //   setData(prev => prev.filter(item => item.id !== id));
        // } catch (err) {
        //   setError(err);
        // }
    };

    useEffect(() => {
        // loadDataTable();
    }, [baseUrl]);

    return {
        data,
        loading,
        error,
        openForm,
        setopenForm,
        loadDataTable,
        createItem,
        updateItem,
        deleteItem,
    };
}
