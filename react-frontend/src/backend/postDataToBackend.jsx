import axios from "axios";

// export interface queryBackendProps {
//     route: string;
// }

export const BASE_URL = 'http://127.0.0.1:8000';
const destination = `${BASE_URL}/data`;


async function postDataToBackend (file){

    const fd = new FormData();
    // THIS FILE HAS TO BE NAMED FILE
    fd.append('file', file, file.name)

    console.log(file)
    //console.log(this.state.uploadFile)
    
    const headers={'Content-Type': file.type};

    let res = await axios.post(destination, fd, headers);
    
    console.log(res);
    console.log('posted data to backend');
}

export default postDataToBackend;