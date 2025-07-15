/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button as MuiButton } from "@mui/material"

const Button = ({children, ...rest}: {children: React.ReactNode, [key: string]: any}) => {
    return <MuiButton {...rest}>{children}</MuiButton>
}

export default Button