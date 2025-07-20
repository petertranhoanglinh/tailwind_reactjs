'use client';
import { Field, Formik, Form } from 'formik';

import * as mdi from '@mdi/js';
import FormField from '../../FormField';
import FormGrid from '../../FormField/FormGrid';
import { FilterOption, FilterType } from '../../../_type/types';

export type FieldConfig = {
    name: string;
    label: string;
    type: FilterType;
    placeholder?: string;
    icon?: string;
    options?: FilterOption[];
    hiddenKey?: string;
    renderCustom?: (className: string) => React.ReactNode;
};

type Props = {
    config: FieldConfig[] | null;
    columns?: number;
    onSubmit: (values: any) => void;
};

export default function DynamicFormFields({ config, columns = 3, onSubmit }: Props) {
    if (config == null) return <>    </>
    const generateInitialValues = (config: FieldConfig[]) => {
        const initialValues: Record<string, any> = {};
        config.forEach((field) => {
            if (field.type === 'checkbox' || field.type === 'switch') {
                initialValues[field.name] = false;
            } else {
                initialValues[field.name] = '';
            }
        });
        return initialValues;
    };
    return (
        <Formik initialValues={generateInitialValues(config)} onSubmit={onSubmit}>
            <Form>
                <FormGrid columns={columns}>
                    {config.map((field) => {
                        if (field.hiddenKey) return null;
                        const IconPath = field.icon ? (mdi as any)[field.icon] : undefined;
                        return (
                            <FormField key={field.name} label={field.label} labelFor={field.name} icon={IconPath}>
                                {({ className }) => {
                                    if (field.type === 'custom' && field.renderCustom) {
                                        return field.renderCustom(className);
                                    }
                                    if (field.type === 'select') {
                                        return (
                                            <Field as="select" name={field.name} id={field.name} className={className}>
                                                {field.options?.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </Field>
                                        );
                                    }
                                    if (field.type === 'checkbox' || field.type === 'switch') {
                                        return (
                                            <label className="flex items-center space-x-2">
                                                <Field
                                                    type="checkbox"
                                                    name={field.name}
                                                    id={field.name}
                                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{field.label}</span>
                                            </label>

                                        );
                                    }

                                    if (field.type === 'date' ||  field.type === 'date-range') {
                                        return (
                                                    <Field
                                                        type="date"
                                                        name={field.name}
                                                        id={field.name}
                                                        className={className}
                                                    />
                                        );
                                    }
                                    return (
                                        <Field
                                            name={field.name}
                                            id={field.name}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            className={className}
                                        />
                                    );
                                }}
                            </FormField>
                        );
                    })}
                </FormGrid>
                <button type="submit">Submit</button>
            </Form>
        </Formik>
    );
}
