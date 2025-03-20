"use client";
import { Form, Formik } from "formik";
import { ReactNode } from "react";
import Buttons from "../Buttons";
import Button from "../Button";
import { mdiCog } from "@mdi/js";
import FormCheckRadioGroup from "./CheckRadioGroup";
import FormCheckRadio from "./CheckRadio";
import { Field } from "formik";

type Props = {
  initdata;
  handleSubmit: (values) => void;
  hideFields?: Record<string, boolean>; // Kiểu dữ liệu rõ ràng
  children?: (hideFields: Record<string, boolean>) => ReactNode;
};

export default function FormSearch({ initdata, handleSubmit, hideFields = {}, children }: Props) {
  return (
    <Formik initialValues={initdata} onSubmit={handleSubmit}>
      {() => (
        <Form>
          <div className="flex justify-end">
            <Button icon={mdiCog} color="whiteDark" />
          </div>

          {/* Kiểm tra và render children */}
          {children && children(hideFields)}

          {/* Render danh sách checkbox từ visibleFields */}
          <FormCheckRadioGroup>
            {Object.keys(hideFields).map((key) => (
              <FormCheckRadio key={key} type="switch" label={key} isGrouped>
                <Field type="checkbox" name={key} />
              </FormCheckRadio>
            ))}
          </FormCheckRadioGroup>

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
