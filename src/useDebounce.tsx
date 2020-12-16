import {useState, useEffect} from "react";

const useDebounce = (value: any, delay : number) => {
    const [debounce, setDebounce] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounce(value)
            },delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value])

    return debounce
}

export {useDebounce}