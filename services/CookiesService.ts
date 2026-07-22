import Cookies from 'universal-cookie';

const cookies=new Cookies()

class cookiesService{
    //get 
    get(name:string){
        return cookies.get(name)
    }
    //set 
    set(name:string,value:string,opetions:object){
        return cookies.set(name,value,opetions)
    }
    //remove 
    remove(name:string){
        return cookies.remove(name)
    }

}

export default new cookiesService()