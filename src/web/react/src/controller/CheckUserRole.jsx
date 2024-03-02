import axios from 'axios';

export async function checkUserRole() {
    try{
        var response = await axios.get('http://localhost:5000/auth/get-user-data');
        
        var role;
        try{
            let success = response.data['success'];
            if (success && response.data['role'] !== null && response.data.role !== undefined){
                role = response.data['role'];
            }else {
                role = null;
            }
        }catch {
            role = null;
        }

        return role;
    }catch{ role =  null; return role; };

}