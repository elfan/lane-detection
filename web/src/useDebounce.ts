import {useState, useEffect} from 'react';

export const useDebounce = (initValue: any, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(initValue);
    const [value, setValue] = useState(initValue);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
  
    return [debouncedValue, setValue];
  }

export default useDebounce;
