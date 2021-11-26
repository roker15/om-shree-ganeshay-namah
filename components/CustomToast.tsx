import { createStandaloneToast } from "@chakra-ui/react"

const toast = createStandaloneToast()
interface CustomtoastProps{
    title:string,
    position?: "top",
    status: "success"| "error"| "warning"| "info",
    variant?: "subtle",
    duration?: 3000,
    isClosable?: true,
}
export function customToast({title,position,status,variant,duration,isClosable}:CustomtoastProps) {
    // const toast = useToast()
    // const toastIdRef = React.useRef()
  
    // function update() {
    //   if (toastIdRef.current) {
    //     toast.update(toastIdRef.current, { description: "new text" })
    //   }
    // }
  
    // function addToast() {
    //   toastIdRef.current = toast({ description: "some text" })
    // }
  
    return (
    
        toast({
            title,
            position,
            status,
            variant,
            duration,
            isClosable,
          })
    )
  }