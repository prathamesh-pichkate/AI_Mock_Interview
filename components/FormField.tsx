import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Control, Controller, FieldValues, Path, useForm } from "react-hook-form"
import * as z from "zod"
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface FormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password';
}

const FormField = <T extends FieldValues>({control, name, label, placeholder, type="text"}:FormFieldProps<T>) => (
    <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                <FormLabel className='label'>{label}</FormLabel>
                <FormControl>
                    <Input placeholder={placeholder} type={type} {...field} />
                </FormControl>
                
                <FormMessage />
                </FormItem>
            )}
            />
)

export default FormField