import { useState } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { ClearButton, SaveButton } from "./buttons";

function Info(props) {
    return (
        <div className="flex flex-col">
            <p className="text-sm text-gray-500">
                <strong>Info:</strong> {props.children}
            </p>
        </div>
    );            
}

export default function Textbox() {
    const [text, setText] = useState("");
    const [info, setInfo] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (text === "") {
            return toast.error("Nothing to save");
        }
        setSaving(true);
        try {
            const res = await axios.post("/api/save", { pastedText: text });
            setSaving(false);
            setInfo(res);
            toast.success("Saved");
            setText("");
        } catch (err) {
            setSaving(false);
            console.log(err);
            toast.error("Something went wrong");
        }
    };

    const handleClear = () => {
        setText("");
        setInfo(null);
    };
    
    return (
            <form onSubmit={handleSubmit}>
                                <div className='grid grid-flow-row gap-1'>

        <textarea
            className="border-2 border-lime-500 rounded-md"
            rows="10"
            cols="50"
            value={text}
            onChange={(e) => setText(e.target.value)}
        ></textarea>
          <ClearButton onClick={handleClear} />
            <SaveButton />
            {saving && <p>Saving...</p>}
            {info && <div className="grid grid-cols gap-2 justify-center text-center"><Info>Key: {info.data.key}, Pass: {info.data.password}</Info></div>
            }
        </div>
        </form>
    );
}