"use client";
import { Form, Formik } from "formik";
import { ReactNode } from "react";
import Buttons from "../Buttons";
import Button from "../Button";

type Props = {
  initdata;
  handleSubmit: (values) => void;
  children?: ReactNode;
};
export default function FormSearch({ children, initdata, handleSubmit }: Props) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg mb-4">
          <Formik initialValues={initdata} onSubmit={handleSubmit}>
            {({  }) => (
              <Form className="flex flex-col">
                {children}
                <div className="flex justify-end mt-4">
                  <Buttons>
                    <Button type="submit" color="info" label="Search" isGrouped />
                  </Buttons>
                </div>
              </Form>
            )}
          </Formik>
    </div>
  );
}
