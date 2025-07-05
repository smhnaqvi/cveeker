/* eslint-disable @typescript-eslint/no-explicit-any */
import {  Stack, styled, TextField, Typography } from "@mui/material"
import { Controller, useFormContext } from "react-hook-form"
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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

type IInputPorps = { 
    name: string, 
    label: string, 
    type: string, 
    maxLength?: number,
    [key: string]: any 
}

const Input = ({name, label, type, maxLength, ...rest}: IInputPorps) => {
    const currentValue = rest.value || '';
    const charCount = currentValue.length;
    const remainingChars = maxLength ? maxLength - charCount : 0;
    const isNearLimit = maxLength && remainingChars <= 10;
    const isOverLimit = maxLength && remainingChars < 0;

    return (
        <Stack gap={0.5}>
            <TextFieldComponent 
                fullWidth 
                name={name} 
                label={label} 
                type={type} 
                inputProps={{
                    ...rest.inputProps,
                    maxLength: maxLength
                }}
                {...rest} 
            />
            {maxLength && (
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: isOverLimit ? 'error.main' : isNearLimit ? 'warning.main' : 'text.secondary',
                        fontSize: '0.75rem',
                        textAlign: 'right',
                        mt: 0.5
                    }}
                >
                    {charCount}/{maxLength} characters
                    {remainingChars >= 0 && ` (${remainingChars} remaining)`}
                    {isOverLimit && ` (${Math.abs(remainingChars)} over limit)`}
                </Typography>
            )}
        </Stack>
    );
}

export const RHFInput = (props: IInputPorps) => {
    const { control } = useFormContext()
    return (<Controller
        control={control}
        name={props.name}
        render={({ field: { onChange, onBlur, value, ref }, fieldState }) => { 
            const hasErrorMessage = fieldState.error?.message
            return <Stack gap={1}>
                <Input
                    {...props}
                    error={!!hasErrorMessage}
                    onChange={onChange} // send value to hook form
                    onBlur={onBlur} // notify when input is touched
                    value={value} // return updated value
                    ref={ref} // set ref for focus management
                />
                {hasErrorMessage && <FormFieldError message={hasErrorMessage} />}
            </Stack>
        }}
    />)
}

export const FormFieldError = ({ message }: {message: string}) => {
    return (
        <Stack flexDirection="row" gap={1} sx={{color:(theme) => theme.palette.error.main}}>
            <ErrorOutlineIcon />
            <Typography>{message}</Typography>
        </Stack>
    )
}

export default Input