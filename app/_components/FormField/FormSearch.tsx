"use client";
import { Form, Formik } from "formik";
import { ReactNode, useState } from "react";
import Buttons from "../Buttons";
import Button from "../Button";
import { mdiCog } from "@mdi/js";
import FormCheckRadioGroup from "./CheckRadioGroup";
import FormCheckRadio from "./CheckRadio";
import { Field } from "formik";
type Props = {
  initdata;
  handleSubmit: (values) => void;
  hideFields?: Record<string, boolean>;
  children?: (hideFields: Record<string, boolean>) => ReactNode;
};
export default function FormSearch({ initdata, handleSubmit, hideFields = {}, children }: Props) {
  const [showOptions, setShowOptions] = useState(false);
  const toggleOptions = () => setShowOptions(!showOptions);
  return (
    <Formik
      initialValues={{ ...initdata, ...hideFields }}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div className="flex justify-end">
            <Button icon={mdiCog} color="whiteDark" onClick={toggleOptions} />
          </div>
          {children && children(values)}
          {showOptions && (
            <FormCheckRadioGroup>
              {Object.keys(hideFields).map((key) => (
                <FormCheckRadio key={key} type="switch" label={key.slice(2).replaceAll("_" , " ")} isGrouped>
                  <Field
                    type="checkbox"
                    name={key}
                    checked={!values[key]} 
                    onChange={() => setFieldValue(key, !values[key])}
                  />
                </FormCheckRadio>
              ))}
            </FormCheckRadioGroup>
          )}
          <div className="flex justify-end mt-4">
            <Buttons>
              <Button type="submit" color="info" label="Search" isGrouped />
            </Buttons>
          </div>
        </Form>
      )}
    </Formik>
  );
}