import { useEffect,useState } from 'react'
const axios = require('axios');

function Builds(p) {

    const {GetData,BACKENDURL} = p
    const [builds,setBuilds] = useState([])

    useEffect(()=>{
        axios.get(BACKENDURL+"/builds")
    },[BACKENDURL])

    return <>
    <div className="box skillTreeBox">
          <div className="boxTitleBar">
            <h1>Builds List</h1>
            {}
            <div></div>
          </div>
    </div></>
}

export default Builds;