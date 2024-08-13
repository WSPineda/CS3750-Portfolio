import React, { useEffect, useState} from "react";

//import {Link} from "react-router-dom";

const Record = (props) => (
    <tr>
        <td>{props.record.email}</td>
    </tr>
   
)
///*     <td><Link to={`/edit/${props.record._id}`}>Edit</Link></td>/*
//One react component for the entire table (records)
// Antoher react compobnent for each row of the result (record)
export default function Records(){
    const [records, setRecords] = useState([]);

    useEffect(()=>{
        async function getRecords(){
            const response = await fetch(`http://localhost:4000/record`);
            if(!response.ok){
                const message = `An error occurred:  ${response.statusText}`;
                window.alert(message);
                return;

            }
            const responseRecords = await response.json();
            setRecords(responseRecords);
            return;

        }
        getRecords();
        return;
    },[records.length]);

    function recordList(){
        return records.map((record)=>{
            return(
                <Record
                    record={record}
                    key={record._id}
                />
            );
        });

    }


    return (
        <div>
            <h3>User List</h3>
            <table style={{marginTop: 20}}>
                <thead>
                    <tr>
                        <th>Registered Members</th>
                    </tr>
                </thead>
                <tbody>{recordList()}</tbody>
            </table>
        </div>

    );
}