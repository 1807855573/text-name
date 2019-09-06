import request from "@/utils/request"

let music = {
    querymusic:(data)=> request.get('/api/querymusic',data),
    addmusic:data=>request.post("/api/addmusic",data),
    delmusic:data => request.get('/api/deletemusic',data),
    updatemusic:data=>request.post("/api/updatemusic",data),
    upload:data=>request.post("/api/upload",data)
}

export default music