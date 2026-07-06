// Typed-by-convention Redux hooks. Import these instead of the raw react-redux
// hooks so every component reaches the store the same way and a future TS
// migration only has to annotate this one file.
import { useDispatch, useSelector } from 'react-redux'

export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector
