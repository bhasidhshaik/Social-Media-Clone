import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = ()=>{
    const queryClient = useQueryClient()
    const {mutate:follow , isPending} = useMutation({
        mutationFn: async (userId) => {
            const res = await fetch(`/api/user/friendship/${userId}`, {
                method: "POST",
            })
            const data = await res.json()
            if(!res.ok){
                throw new Error(data.error)
            }
            return data
            
        },
        onSuccess: () => {
            Promise.all[
                queryClient.invalidateQueries({
                    queryKey: ["authUser"]
                }),
                queryClient.invalidateQueries({queryKey : ["suggestedUsers"]})
            ]   
        },
        onError: (error) => {
            toast.error(error.message)
            }


    })
    return {follow , isPending}
    
}
export default useFollow