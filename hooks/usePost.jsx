import { message } from "antd";
import axios from "axios";
import { useState } from "react";

function usePost() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const postData = async ({ baseUrl = process.env.NEXT_PUBLIC_API_URL, endpoint, data, loadingText = "Loading..", onSuccess, onError, successText = "Completed 🎉", allowMessage = true }) => {
        setLoading(true);

        if (allowMessage) {
            message.loading({ content: loadingText, key: 1 });
        }

        try {
            const res = await axios.post(baseUrl + endpoint, data);
            setData(res.data);
            onSuccess && onSuccess(res.data);
        } catch (error) {
            console.log(error);
            onSuccess && onError(error);
            allowMessage && message.error("Something went wrong..");
        } finally {
            setLoading(false);
            if (allowMessage) {
                message.destroy(1);
                message.success(successText);
            }
        }
    };

    return { postData, data, loading };
}

export default usePost;
