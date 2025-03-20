"use client";
import { Form, Formik } from "formik";
import { ReactNode } from "react";
import Buttons from "../Buttons";
import Button from "../Button";
import { mdiCog } from "@mdi/js";

type Props = {
  initdata;
  handleSubmit: (values) => void;
  children?: ReactNode;
};
export default function FormSearch({ children, initdata, handleSubmit }: Props) {
  return (
        <Formik initialValues={initdata} onSubmit={handleSubmit}>
          {({  }) => (
            <Form>
              <div className="flex justify-end">
                  <Button icon={mdiCog} color="whiteDark" />
              </div>
              {children}
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
