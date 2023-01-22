import { useState } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { ClearButton, GetButton } from "./buttons";

export default function GetTextBox() {
    const [key, setKey] = useState("");
    const [text, setText] = useState("");
    const [show, setShow] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (key === "") {
            return toast.error("Please enter a key");
        }
        try {
            const res = await axios.get(`/api/get?key=${key}`);
            setText(res.data.pastedText);
            setShow(true);
            toast.success("Gottem!");
        } catch (err) {
            console.log(err);
            toast.error("No text found using the key provided!");
        }
    };

    const handleClear = () => {
        setKey("");
        setText("");
        setShow(false);
    };
    
    return (
            <form onSubmit={handleSubmit}>
                <div className='grid grid-flow-row gap-1'>
                    <input className="border-2 border-lime-500 rounded-md" type="text" value={key} onChange={(e) => setKey(e.target.value)} />
        {show ? <textarea
        readOnly
            className="border-2 border-lime-500 rounded-md"
            rows="10"
            cols="50"
            value={text}
        ></textarea> : null}
          <ClearButton onClick={handleClear} />
            <GetButton />            
        </div>
        </form>
    );
}