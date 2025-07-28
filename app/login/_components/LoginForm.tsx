"use client";

import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import Divider from "../../_components/Divider";
import FormField from "../../_components/FormField";
import FormCheckRadio from "../../_components/FormField/CheckRadio";
import { loginStart, loginSuccess, loginFailure } from "../../_stores/auth/authSlice";
import Cookies from 'js-cookie';
import authService from "../../_services/auth.service";
import { User } from "../../_models/types";

type LoginForm = {
  login: string;
  password: string;
  remember: boolean;
};

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (formValues: LoginForm) => {
    const { login, password, remember } = formValues;
    
    dispatch(loginStart());
    
    try {
      const result = await authService.authenticate({
        username: login,
        password: password,
      });
      if (!result?.jwt) {
        throw new Error('No token received');
      }

      const expires = remember ? 1 : 1/24; 
     
      const user = result as User;
      Cookies.set('jwt', user.jwt, { expires });
      localStorage.setItem('authToken', user.jwt);
      dispatch(loginSuccess({ user, token: result.jwt }));
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      dispatch(loginFailure(message));
    }
  };

  const initialValues: LoginForm = {
    login: "",
    password: "",
    remember: true,
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <FormField label="Login" help="Please enter your login">
            {({ className }) => (
              <Field 
                name="login" 
                className={className} 
                disabled={isSubmitting}
              />
            )}
          </FormField>

          <FormField label="Password" help="Please enter your password">
            {({ className }) => (
              <Field 
                name="password" 
                type="password" 
                className={className}
                disabled={isSubmitting}
              />
            )}
          </FormField>

          <FormCheckRadio type="checkbox" label="Remember me">
            <Field type="checkbox" name="remember" disabled={isSubmitting} />
          </FormCheckRadio>

          <Divider />

          <Buttons>
            <Button 
              type="submit" 
              label={isSubmitting ? "Logging in..." : "Login"} 
              color="info" 
              isGrouped 
              disabled={isSubmitting}
            />
            <Button
              href="/"
              label="Cancel"
              color="info"
              outline
              isGrouped
            />
          </Buttons>
        </Form>
      )}
    </Formik>
  );
}