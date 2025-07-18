"use client";

import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import Divider from "../../_components/Divider";
import FormField from "../../_components/FormField";
import FormCheckRadio from "../../_components/FormField/CheckRadio";
import authService from "../../_services/auth.service";
import Cookies from 'js-cookie';

type LoginForm = {
  login: string;
  password: string;
  remember: boolean;
};

export default function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (formValues: LoginForm) => {
    try {
      const { login, password } = formValues;

      const result = await authService.authenticate({
        username: login,
        password: password,
      });
      if (result?.jwt) {
        Cookies.set('jwt', result?.jwt, { expires: 10/24 }); // expires = 1 day
        router.push("/dashboard");
      } else {
        setErrorMessage("Login failed: No token received.");
      }
    } catch (error) {
      setErrorMessage("Login failed: Invalid credentials.");
    }
  };

  const initialValues: LoginForm = {
    login: "",
    password: "",
    remember: true,
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form>
        <FormField label="Login" help="Please enter your login">
          {({ className }) => <Field name="login" className={className} />}
        </FormField>

        <FormField label="Password" help="Please enter your password">
          {({ className }) => (
            <Field name="password" type="password" className={className} />
          )}
        </FormField>

        <FormCheckRadio type="checkbox" label="Remember">
          <Field type="checkbox" name="remember" />
        </FormCheckRadio>

        {errorMessage && (
          <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
        )}

        <Divider />

        <Buttons>
          <Button type="submit" label="Login" color="info" isGrouped />
          <Button
            href="/dashboard"
            label="Home"
            color="info"
            outline
            isGrouped
          />
        </Buttons>
      </Form>
    </Formik>
  );
}
