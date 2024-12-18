import axios from "axios";
import { useEffect, useState } from "react";

function useGet({ baseUrl = process.env.NEXT_PUBLIC_API_URL, endpoint, onSuccess, onError }) {
    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(false);

    const getData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(baseUrl + endpoint);
            setData(response.data);
            onSuccess && onSuccess(res.data);
        } catch (error) {
            console.log(error);
            onError && onError(error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return { getData, data, loading, error };
}

export default useGet;
