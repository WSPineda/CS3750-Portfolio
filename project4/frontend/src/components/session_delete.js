import React, {useEffect, useState} from "react";



export default function SessionDelete() {
    const [status, setStatus] = useState("");

   

    useEffect(()=>{
        async function run(){
            const response = await fetch(`http://localhost:4000/session_delete`,
                {
                   method:"GET",
                   credentials: 'include'

                }
            );
            if(!response.ok){
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const statusResponse = await response.json();
            setStatus(statusResponse.status);
        }
        run();
        return;
    })
    return(
        <div>
            <h3>Delete Session</h3>
            <p>{status}</p>
        </div>
    )
}