import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";


export default function Edit() {
    const [form, setForm] = useState({
        name: "",
        position: "", 
        level: "",
    });
    const params = useParams();
    const navigate = useNavigate();

    
    useEffect(()=>{
        async function fetchData(){
            const id = params.id.toString();
            const response = await fetch(`http://localhost:4000/record/${id}`);
            if(!response.ok){
                const message = `An error occurred:  ${response.statusText}`;
                window.alert(message);
                return;

            }
            const responseRecord = await response.json();
            if(!responseRecord){
                window.alert(`Record with id ${id} not found!`);
                navigate("/");
            }
            setForm(responseRecord);
            return;

        }
        fetchData();
        return;
    },[params.id, navigate]);

    function updateForm(jsonObj){
        return setForm((prevJsonObj) =>{
            return { ...prevJsonObj, ...jsonObj};

        })
    }

    async function onSubmit(e) {
        e.preventDefault();
        const editedPerson = {
            name: form.name,
            position: form.position,
            level: form.level,
        };
        await fetch(`http://localhost:4000/update/${params.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editedPerson),
        }).catch(error =>{
            window.alert(error)
            return;
        })
        navigate("/");
    }

    return(
        <div>
            <h3>Update Record</h3>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Name: </label>
                    <input 
                    type="text" 
                    id="name" 
                    value={form.name}
                    onChange={(e)=>updateForm({name: e.target.value })}
                    />
                </div>
                <div>
                    <label>Position: </label>
                    <input 
                    type="text" 
                    id="position" 
                    value={form.position}
                    onChange={(e)=>updateForm({position: e.target.value })}
                    />
                </div>
                <div>
                    <label>Level: </label>
                    <input 
                    type="text" 
                    id="level" 
                    value={form.level}
                    onChange={(e)=>updateForm({level: e.target.value })}
                    />
                </div>
                <br/>
                <div>
                    <input
                    type="submit"
                    value="Update Record"
                    />
                </div>
            </form>
        </div>
    )
}