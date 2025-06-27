/* eslint-disable @typescript-eslint/no-explicit-any */
import { styled, TextField } from "@mui/material"

const TextFieldComponent = styled(TextField)(({theme}) => ({    
    '& .MuiInputBase-root': {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-error': {
            borderColor: theme.palette.error.main,
        },
        '&.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
        },
        '& .MuiInputBase-input': {
            color: theme.palette.text.primary,
        },
        '& .MuiInputBase-input:disabled': {
            color: theme.palette.text.disabled,
        },
        '& .MuiInputBase-input:placeholder': {
            color: theme.palette.text.secondary,
        },
        '& .MuiInputBase-input:placeholder:hover': {
            color: theme.palette.text.primary,
        },
        '& .MuiInputBase-input:placeholder:focus': {
            color: theme.palette.text.primary,
        },
        '& .MuiInputBase-input:placeholder:active': {
            color: theme.palette.text.primary,
        },
        '& .MuiInputBase-input:placeholder:visited': {
            color: theme.palette.text.primary,
        },
        '& .MuiInputBase-input:placeholder:focus-within': {
            color: theme.palette.text.primary,
        }
    }
}))

const Input = ({name, label, type, ...rest}: {name: string, label: string, type: string, [key: string]: any}) => {
    return <TextFieldComponent fullWidth name={name} label={label} type={type} {...rest} />
}

export default Input